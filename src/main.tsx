import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const container = document.getElementById("root")!;

/**
 * Hydrate the prerendered homepage; client-render everything else.
 *
 * `createRoot().render()` on prerendered markup *discards* those nodes and
 * paints new ones. The browser then records a second, later LCP candidate, so
 * the metric reflects whenever React finished booting and prerendering buys
 * nothing. Measured: element render delay stayed at 2,320 ms with the LCP text
 * already sitting in the HTML, and the extra markup moved the Lighthouse
 * performance score from 89 down to 85.
 *
 * LCP is the *latest* contentful paint, not the first. Prerendered content only
 * counts if it survives, and surviving means hydration.
 *
 * Routes other than `/` are served the empty SPA shell (dist/404.html), where
 * the container has no children and a normal client render is correct.
 */
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
