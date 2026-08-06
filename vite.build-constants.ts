/**
 * Build-time constants shared by vite.config.ts and vite.prerender.config.ts.
 *
 * Both configs must define the same values: the prerender harness and the
 * shipped bundle render the same components, so any constant that differs
 * between them becomes a hydration mismatch. Keeping them in one module is what
 * stops the two configs drifting apart.
 */
export const buildConstants = {
  /**
   * The copyright year, frozen at build time.
   *
   * The footer used `new Date().getFullYear()`, evaluated in the visitor's
   * browser. Prerendered HTML carries the build year, so from 1 January until
   * the next deploy every visitor would render a different year than the markup
   * contained — a text mismatch that fails hydration exactly the way the
   * timezone-dependent post dates did.
   */
  __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
};
