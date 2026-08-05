#!/usr/bin/env node
/**
 * Prerender the homepage to static HTML.
 *
 * The site is a client-rendered SPA, so `dist/index.html` shipped an empty
 * `<div id="root">`. Nothing was painted until React had been fetched, parsed
 * and executed — Lighthouse measured 2.9 s LCP on throttled mobile, of which
 * 2,330 ms was "element render delay" with a time-to-first-byte of 0 ms. The
 * network was never the problem; the blank shell was.
 *
 * This loads the built site in headless Chrome, waits for it to settle, and
 * writes the resulting DOM back over `dist/index.html`. The first paint is then
 * real content straight from the HTML.
 *
 * Deliberately NOT hydration. `main.tsx` still calls `createRoot().render()`,
 * so React discards this markup and renders its own on boot. That costs a
 * redundant render but avoids every hydration-mismatch failure mode, and the
 * swap is invisible because the seeded data makes React's first render
 * identical to what was prerendered. Fixing FCP/LCP does not require
 * hydration — it only requires that something meaningful is in the HTML.
 *
 * Only `/` is prerendered. `dist/404.html` must stay the empty shell: it is the
 * SPA fallback for every other route, and baking the homepage into it would
 * flash homepage content on deep links.
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
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
};

/** Serve dist/ exactly as GitHub Pages would, including the SPA fallback. */
function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let filePath = path.join(DIST, urlPath);

    // Reject traversal outside dist/
    if (!filePath.startsWith(DIST)) {
      res.writeHead(403).end();
      return;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST, '404.html');
      if (!fs.existsSync(filePath)) {
        res.writeHead(404).end();
        return;
      }
    }

    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

async function prerender() {
  const indexPath = path.join(DIST, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('dist/index.html not found — run `vite build` first.');
  }

  const { server, port } = await startServer();
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Don't bill a pageview to GoatCounter on every deploy, and don't make the
    // build depend on Google Fonts being reachable.
    // Stubbed, not aborted: an abort surfaces as a page error and would trip the
    // error check below on every run.
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const url = req.url();
      const external =
        url.includes('gc.zgo.at') ||
        url.includes('goatcounter') ||
        url.includes('fonts.googleapis.com') ||
        url.includes('fonts.gstatic.com');
      if (external) return req.respond({ status: 200, contentType: 'text/plain', body: '' });
      req.continue();
    });

    const errors = [];
    page.on('pageerror', (err) => errors.push(String(err)));

    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle0', timeout: 60_000 });

    // The hero is the LCP element; the writing list is the async one. Waiting on
    // both means we never capture a half-populated page.
    await page.waitForSelector('#hero', { timeout: 30_000 });
    await page.waitForSelector('#writing li', { timeout: 30_000 });

    if (errors.length) {
      throw new Error(`Page errors during prerender:\n  - ${errors.join('\n  - ')}`);
    }

    // Seed the data the client would otherwise fetch, so React's first render
    // matches this markup instead of blanking the section out.
    //
    // Trimmed to the same handful the component shows. Seeding the raw file
    // shipped all 37 posts against 4 rows of prerendered markup — React would
    // then render 37, which is the exact mismatch this seed exists to prevent.
    // RecentWriting re-sorts and re-slices defensively, so this only has to be
    // small and correct, not authoritative.
    const POST_COUNT = 4;
    const allPosts = await page.evaluate(async () => {
      const res = await fetch('/blog/posts.json');
      return res.json();
    });
    const posts = [...allPosts]
      .sort((a, b) => b.date.localeCompare(a.date) || Number(b.episode) - Number(a.episode))
      .slice(0, POST_COUNT);

    const renderedCount = await page.$$eval('#writing li', (els) => els.length);
    if (renderedCount !== posts.length) {
      throw new Error(
        `Seed/markup mismatch: prerendered ${renderedCount} posts but seeding ${posts.length}. ` +
        `React would re-render a different list on boot.`,
      );
    }

    const html = await page.evaluate(() => document.documentElement.outerHTML);

    // Injected into <head> so it is defined before the module script in <body>
    // executes. `<` is escaped because `</script>` inside JSON would close the
    // element early.
    const seed = `<script>window.__RECENT_POSTS__=${JSON.stringify(posts).replace(/</g, '\\u003c')}</script>`;
    const withSeed = html.replace('</head>', `${seed}</head>`);
    if (withSeed === html) throw new Error('Could not inject seed: no </head> in prerendered output.');

    const output = `<!DOCTYPE html>\n${withSeed}\n`;
    const before = fs.statSync(indexPath).size;
    fs.writeFileSync(indexPath, output);

    console.log(`✅ Prerendered / — ${(before / 1024).toFixed(1)} KB shell → ${(output.length / 1024).toFixed(1)} KB static`);
    console.log(`   Seeded ${posts.length} posts; 404.html left as the SPA fallback.`);
  } finally {
    await browser.close();
    server.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  prerender().catch((err) => {
    console.error('❌ Prerender failed:', err.message);
    process.exit(1);
  });
}

export { prerender };
