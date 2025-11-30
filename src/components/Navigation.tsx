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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const navItems = [
    { label: "Home", href: "/#hero" },
    { label: "Projects", href: "/#projects" },
    { label: "Skills", href: "/#skills" },
    { label: "Experience", href: "/#experience" },
    { label: "Education", href: "/#education" },
    { label: "Contact", href: "/#contact" },
    { label: "Blog", href: "/blog", external: true },
    { label: "Analytics", href: "/analytics.html", external: true }
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

  useEffect(() => {
    setMounted(true);
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
      if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
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
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:bg-accent hover:text-primary relative group"
            >
              {item.label}
            </a>
          ))}

          <div className="ml-2">
            <GamesDropdown isScrolled={true} gameItems={gameItems} />
          </div>

          {/* Desktop Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-2 rounded-full hover:bg-transparent hover:text-primary transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-yellow-400 hover:text-yellow-300 transition-colors" />
              ) : (
                <Moon size={20} className="text-slate-700 hover:text-slate-900 transition-colors" />
              )}
            </Button>
          )}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-white/10"
          >
            {mounted && theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-full hover:bg-white/10"
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