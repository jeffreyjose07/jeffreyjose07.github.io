"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

/**
 * Renders identically on every pass, so the prerendered HTML and React's first
 * client render always agree.
 *
 * The previous version gated on a `mounted` flag set in useEffect and returned
 * a dimmed placeholder until then. In a pure SPA that only cost a brief
 * flicker, but against prerendered markup it was a hydration mismatch: the
 * prerender captured the mounted button, React hydrated with the placeholder,
 * and the whole root fell back to client rendering (React #418 → #423) —
 * silently undoing the prerender.
 *
 * Both icons are always in the DOM; which one is visible is decided purely by
 * the `.dark` class on <html>, which next-themes sets from its own blocking
 * script before first paint. No render-time branch on theme, so nothing can
 * disagree. `resolvedTheme` is read inside the click handler, where it has no
 * bearing on hydration.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="hidden md:block fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-all duration-300 shadow-lg"
      aria-label="Toggle theme"
    >
      <span className="relative block h-[1.2rem] w-[1.2rem]">
        <Sun className="absolute inset-0 h-[1.2rem] w-[1.2rem] scale-0 text-foreground transition-transform dark:scale-100" />
        <Moon className="absolute inset-0 h-[1.2rem] w-[1.2rem] scale-100 text-foreground transition-transform dark:scale-0" />
      </span>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
