import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import GamesDropdown from "./navigation/GamesDropdown";
import MobileMenu from "./navigation/MobileMenu";
import { games } from "@/data/games";
import Logo from "./Logo";

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const navItems: NavItem[] = [
    { label: "Home", href: "/#hero" },
    { label: "Writing", href: "/#writing" },
    { label: "Experience", href: "/#experience" },
    { label: "Skills", href: "/#skills" },
    { label: "Projects", href: "/#projects" },
    { label: "Blog", href: "/blog", external: true },
    { label: "Contact", href: "/#contact" },
  ];

  const gameItems = games.map(game => ({
    label: game.title,
    href: `/play/${game.id}`
  }));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string, external?: boolean) => {
    setIsMobileMenuOpen(false);
    if (external) {
      window.location.href = href;
      return;
    }

    // Handle hash links
    if (href.startsWith("/#")) {
      const hash = href.substring(1); // remove leading /
      const isHomePage = window.location.pathname === "/" || window.location.pathname === "/index.html";

      if (isHomePage) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
          window.history.pushState(null, "", href);
        }
      } else {
        window.location.href = href;
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <nav className={`
      fixed top-0 left-0 w-full z-50 transition-all duration-300
      ${isScrolled
        ? "bg-background/80 backdrop-blur-xl border-b border-border/60 py-3 shadow-xs"
        : "bg-transparent py-4 sm:py-5"}
    `}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a
            href="/#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("/#hero");
            }}
            className="flex items-center gap-2.5 group"
          >
            <Logo className="w-8 h-8 group-hover:scale-105 transition-transform duration-200" />
            <div className="flex items-center gap-2">
              <span className="text-lg font-heading font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                Jeffrey<span className="text-primary">.</span>Jose
              </span>
              <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border border-primary/25 bg-primary/10 text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                backend
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 border border-border/70 bg-secondary/35 backdrop-blur-md px-2.5 py-1 rounded-full shadow-inner">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href, item.external);
              }}
              className="px-3 py-1 text-xs font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-background/90 transition-all duration-150"
            >
              {item.label}
            </a>
          ))}

          <div className="pl-0.5">
            <GamesDropdown isScrolled={isScrolled} gameItems={gameItems} />
          </div>
        </div>

        {/* Right controls */}
        <div className="hidden md:flex items-center space-x-2.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="h-8 w-8 rounded-full border border-border/70 hover:bg-secondary/60 hover:text-primary transition-colors duration-200"
            aria-label="Toggle theme"
          >
            <span className="relative block h-4 w-4">
              <Sun size={16} className="absolute inset-0 scale-0 text-yellow-400 transition-transform hover:text-yellow-300 dark:scale-100" />
              <Moon size={16} className="absolute inset-0 scale-100 text-slate-700 transition-transform hover:text-slate-900 dark:scale-0" />
            </span>
          </Button>

          <a
            href="/resume.pdf"
            download="Jeffrey_Jose_Resume.pdf"
            className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-mono font-medium rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200"
          >
            Resume.pdf
          </a>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center space-x-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="h-8 w-8 rounded-full border border-border/60 hover:bg-secondary/60"
            aria-label="Toggle theme"
          >
            <span className="relative block h-4 w-4">
              <Sun size={16} className="absolute inset-0 scale-0 transition-transform dark:scale-100" />
              <Moon size={16} className="absolute inset-0 scale-100 transition-transform dark:scale-0" />
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-8 w-8 rounded-full border border-border/60 hover:bg-secondary/60"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isScrolled={true}
        navItems={navItems}
        gameItems={gameItems}
        onNavClick={handleNavClick}
      />
    </nav>
  );
};

export default Navigation;
