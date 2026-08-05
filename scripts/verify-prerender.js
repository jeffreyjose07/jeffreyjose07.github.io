#!/usr/bin/env node
/**
 * Assert that the prerendered homepage is actually usable.
 *
 * Prerendering fails in ways a green build never shows. The first attempt here
 * shipped markup with 4 posts and a seed containing all 37 — the HTML looked
 * perfect, and React replaced it with a 37-row list the moment it booted. Only
 * loading the page twice, once with JavaScript disabled and once with it on,
 * catches that.
 *
 * Checks:
 *   1. With JS off, the LCP text and the writing list are present — this is
 *      the whole point of prerendering.
 *   2. With JS on, React renders the same number of posts. A difference means
 *      content visibly changes under the reader.
 *   3. posts.json is never fetched, proving the seed was used.
 *   4. Exactly one <main> landmark, and no console or page errors.
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath, pathToFileURL } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '../dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
};

function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let filePath = path.join(DIST, urlPath);
    if (!filePath.startsWith(DIST)) return void res.writeHead(403).end();
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if (!fs.existsSync(filePath)) filePath = path.join(DIST, '404.html');
    if (!fs.existsSync(filePath)) return void res.writeHead(404).end();
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

async function verify() {
  const { server, port } = await startServer();
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const failures = [];

  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    // Stub the external origins rather than aborting them. An aborted request
    // logs "Failed to load resource: net::ERR_FAILED", which is indistinguishable
    // from a genuinely missing asset — and this check exists to notice those.
    await page.setRequestInterception(true);
    page.on('request', (r) => {
      const u = r.url();
      if (u.includes('gc.zgo.at') || u.includes('fonts.g')) {
        return r.respond({ status: 200, contentType: 'text/plain', body: '' });
      }
      r.continue();
    });

    // 1. What paints before any JavaScript runs
    await page.setJavaScriptEnabled(false);
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
    const staticPosts = await page.$$eval('#writing li', (e) => e.length).catch(() => 0);
    const staticHero = await page.$eval('#hero p', (e) => e.textContent.trim()).catch(() => '');

    if (!staticHero) failures.push('No hero text in the static HTML — the page is still a blank shell.');
    if (staticPosts === 0) failures.push('No writing posts in the static HTML.');

    // 2. What React produces once it boots
    await page.setJavaScriptEnabled(true);
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1200));
    const bootedPosts = await page.$$eval('#writing li', (e) => e.length).catch(() => 0);
    const bootedHero = await page.$eval('#hero p', (e) => e.textContent.trim()).catch(() => '');
    const postsJsonRequests = await page.evaluate(
      () => performance.getEntriesByType('resource').filter((r) => r.name.includes('posts.json')).length,
    );
    const mainCount = await page.$$eval('main', (e) => e.length);

    if (bootedPosts !== staticPosts) {
      failures.push(`Post count changes on boot: ${staticPosts} prerendered vs ${bootedPosts} rendered.`);
    }
    if (bootedHero !== staticHero) failures.push('Hero text changes between the static HTML and React.');
    if (postsJsonRequests > 0) failures.push(`posts.json fetched ${postsJsonRequests}x — the seed was not used.`);
    if (mainCount !== 1) failures.push(`Expected exactly one <main> landmark, found ${mainCount}.`);
    if (errors.length) failures.push(`Console/page errors:\n      ${errors.slice(0, 5).join('\n      ')}`);

    console.log(`  static HTML : ${staticPosts} posts, hero ${staticHero ? 'present' : 'MISSING'}`);
    console.log(`  after boot  : ${bootedPosts} posts, ${postsJsonRequests} posts.json request(s), ${mainCount} <main>`);
  } finally {
    await browser.close();
    server.close();
  }

  if (failures.length) {
    throw new Error(`Prerender verification failed:\n  - ${failures.join('\n  - ')}`);
  }
  console.log('✅ Prerendered homepage verified: static paint matches the booted render');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  verify().catch((err) => {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  });
}

export { verify };
