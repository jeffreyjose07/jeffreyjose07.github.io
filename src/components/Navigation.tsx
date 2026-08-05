import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import GamesDropdown from "./navigation/GamesDropdown";
import MobileMenu from "./navigation/MobileMenu";
import { games } from "@/data/games";
import Logo from "./Logo";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const navItems = [
    { label: "Home", href: "/#hero" },
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
      // Check if we are on the home page (root or index.html)
      const isHomePage = window.location.pathname === "/" || window.location.pathname === "/index.html";

      if (isHomePage) {
        // We are on home page, scroll to element
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
          // Update URL without reload
          window.history.pushState(null, "", href);
        }
      } else {
        // We are on another page, navigate to home with hash
        window.location.href = href;
      }
    } else {
      // Regular link
      window.location.href = href;
    }
  };

  return (
    <nav className={`
      fixed top-0 left-0 w-full z-50 transition-all duration-300
      ${isScrolled
        ? "bg-background/70 backdrop-blur-md border-b border-white/10"
        : "bg-transparent"}
    `}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a
            href="/#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("/#hero");
            }}
            className="flex items-center gap-2 group"
          >
            <Logo className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-heading font-bold tracking-tight group-hover:text-primary transition-colors duration-300">
              Jeffrey<span className="text-primary">.</span>Jose
            </span>
          </a>
        </div>



        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href, (item as any).external);
              }}
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 hover:bg-accent hover:text-primary"
            >
              {item.label}
            </a>
          ))}

          <div className="ml-2">
            <GamesDropdown isScrolled={true} gameItems={gameItems} />
          </div>

          {/* Desktop Theme Toggle.
              Always rendered, with the icon chosen by CSS from the `.dark`
              class rather than by a render-time branch. Gating this on a
              `mounted` flag meant the button was absent on React's first pass
              but present in the prerendered HTML — a structural hydration
              mismatch that dropped the whole root back to client rendering. */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="ml-2 rounded-md hover:bg-transparent hover:text-primary transition-colors duration-200"
            aria-label="Toggle theme"
          >
            <span className="relative block h-5 w-5">
              <Sun size={20} className="absolute inset-0 scale-0 text-yellow-400 transition-transform hover:text-yellow-300 dark:scale-100" />
              <Moon size={20} className="absolute inset-0 scale-100 text-slate-700 transition-transform hover:text-slate-900 dark:scale-0" />
            </span>
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-md hover:bg-white/10"
            aria-label="Toggle theme"
          >
            <span className="relative block h-5 w-5">
              <Sun size={20} className="absolute inset-0 scale-0 transition-transform dark:scale-100" />
              <Moon size={20} className="absolute inset-0 scale-100 transition-transform dark:scale-0" />
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md hover:bg-white/10"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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