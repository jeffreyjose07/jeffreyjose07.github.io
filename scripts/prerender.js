#!/usr/bin/env node
/**
 * Prerender the homepage to static HTML.
 *
 * The site is a client-rendered SPA, so `dist/index.html` shipped an empty
 * `<div id="root">`. Nothing painted until React had been fetched, parsed and
 * executed — Lighthouse measured LCP 2.9 s on throttled mobile, of which
 * 2,320 ms was "element render delay" against a 0 ms time to first byte. The
 * network was never the bottleneck; the blank shell was.
 *
 * The markup comes from React's own `renderToString`, via a build-time harness
 * (prerender.html → src/entry-prerender.tsx) loaded in headless Chrome. It is
 * then hydrated by main.tsx, which is what makes the early paint count: LCP is
 * the *latest* contentful paint, so if React discarded this markup and rendered
 * its own, the metric would just move to whenever React finished booting.
 *
 * Rendering through React — rather than screenshotting the DOM — is what makes
 * hydration succeed. See src/entry-prerender.tsx for the three mismatch classes
 * a DOM capture cannot avoid.
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
const REPO = path.join(__dirname, '..');
const DIST = path.join(REPO, 'dist');
const HARNESS = path.join(REPO, 'dist-prerender');

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

/**
 * Serve the harness overlaid on dist/, so the harness page can fetch
 * /blog/posts.json and its own bundle from one origin.
 */
function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);

    for (const base of [HARNESS, DIST]) {
      const candidate = path.join(base, urlPath);
      if (!candidate.startsWith(base)) continue;
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        res.writeHead(200, {
          'Content-Type': MIME[path.extname(candidate)] || 'application/octet-stream',
        });
        fs.createReadStream(candidate).pipe(res);
        return;
      }
    }
    res.writeHead(404).end();
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
  if (!fs.existsSync(path.join(HARNESS, 'prerender.html'))) {
    throw new Error('dist-prerender/ not found — run `npm run build:prerender-harness` first.');
  }

  const shell = fs.readFileSync(indexPath, 'utf8');
  const ROOT_DIV = '<div id="root"></div>';
  if (!shell.includes(ROOT_DIV)) {
    throw new Error(`Could not find ${ROOT_DIV} in dist/index.html — nothing to prerender into.`);
  }

  const { server, port } = await startServer();
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Stubbed rather than aborted: an abort logs "Failed to load resource",
    // which is indistinguishable from a genuinely missing asset. Blocked so the
    // build neither bills a GoatCounter pageview on every deploy nor depends on
    // Google Fonts being reachable.
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

    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(String(err)));

    await page.goto(`http://127.0.0.1:${port}/prerender.html`, {
      waitUntil: 'networkidle0',
      timeout: 60_000,
    });
    await page.waitForFunction('window.__PRERENDER_DONE__ === true', { timeout: 60_000 });

    const error = await page.evaluate(() => window.__PRERENDER_ERROR__);
    if (error) throw new Error(`Harness failed:\n${error}`);
    if (pageErrors.length) {
      throw new Error(`Page errors during prerender:\n  - ${pageErrors.join('\n  - ')}`);
    }

    const result = await page.evaluate(() => window.__PRERENDER__);
    if (!result?.html) throw new Error('Harness produced no HTML.');

    const { html, posts } = result;

    // Sanity-check that the render is not an empty shell in disguise.
    if (!html.includes('id="hero"')) {
      throw new Error('Prerendered HTML has no #hero section — the app did not render.');
    }

    // Seed the data the client would otherwise fetch, so React's first render
    // matches this markup rather than blanking the writing section out and
    // refilling it. `<` is escaped because `</script>` inside JSON would close
    // the element early.
    const seed = `<script>window.__RECENT_POSTS__=${JSON.stringify(posts).replace(/</g, '\\u003c')}</script>`;

    const output = shell
      .replace('</head>', `${seed}</head>`)
      .replace(ROOT_DIV, `<div id="root">${html}</div>`);

    fs.writeFileSync(indexPath, output);

    console.log(
      `✅ Prerendered / via renderToString — ${(shell.length / 1024).toFixed(1)} KB shell → ` +
      `${(output.length / 1024).toFixed(1)} KB static`,
    );
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
