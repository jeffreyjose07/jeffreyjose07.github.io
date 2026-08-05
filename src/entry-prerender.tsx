import { renderToString } from "react-dom/server.browser";
import App from "./App.tsx";
import { selectRecentPosts, type BlogPost } from "./components/RecentWriting.tsx";
import "./index.css";

/**
 * Build-time only entry: renders the app to the exact HTML that hydration expects.
 *
 * This must go through React's own serializer. An earlier version of the
 * prerender loaded the built site in headless Chrome and captured
 * `document.documentElement.outerHTML`, which cannot work:
 *
 *  - `renderToString` emits Suspense boundary markers (`<!--$-->`) that
 *    hydration uses to locate boundaries. A client `createRoot` render never
 *    creates them, so a DOM capture has no way to contain them.
 *  - The browser normalises inline styles (`pointer-events: none;`) while React
 *    writes `pointer-events:none`. Same CSS, different bytes.
 *  - A DOM capture happens *after* effects have run; hydration compares against
 *    the first render, *before* them. Anything that settles asynchronously —
 *    Radix's Avatar waiting on image load, a `mounted` flag — differs.
 *
 * Every one of those is a hydration mismatch that silently drops the whole root
 * back to client rendering, undoing the prerender while still shipping the
 * larger HTML. Rendering through React removes the entire class.
 *
 * Runs in a headless browser rather than Node so that `window`, `fetch` and
 * BrowserRouter behave normally.
 */
declare global {
  interface Window {
    __PRERENDER__?: { html: string; posts: BlogPost[] };
    __PRERENDER_ERROR__?: string;
    __PRERENDER_DONE__?: boolean;
    __RECENT_POSTS__?: BlogPost[];
  }
}

async function run() {
  // BrowserRouter reads window.location; this bundle is served from its own
  // page, so point it at the route being prerendered.
  history.replaceState({}, "", "/");

  const res = await fetch("/blog/posts.json");
  if (!res.ok) throw new Error(`posts.json returned ${res.status}`);
  const posts = selectRecentPosts(await res.json());

  // RecentWriting reads this during render. It must be set *before*
  // renderToString or the prerendered markup would omit the section entirely.
  window.__RECENT_POSTS__ = posts;

  window.__PRERENDER__ = { html: renderToString(<App />), posts };
}

run()
  .catch((err) => {
    window.__PRERENDER_ERROR__ = String(err?.stack || err);
  })
  .finally(() => {
    window.__PRERENDER_DONE__ = true;
  });
