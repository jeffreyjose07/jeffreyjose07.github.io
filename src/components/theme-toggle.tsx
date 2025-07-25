"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="hidden md:block fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-all duration-300"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] opacity-50" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="hidden md:block fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-all duration-300 shadow-lg"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-foreground transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-foreground transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}