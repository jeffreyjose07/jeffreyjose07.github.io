import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import GamesDropdown from "./navigation/GamesDropdown";
import MobileMenu from "./navigation/MobileMenu";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const navItems = [
    { label: "Home", href: "#hero" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
    { label: "Blog", href: "/blog", external: true },
    { label: "Analytics", href: "/analytics.html", external: true }
  ];

  const gameItems = [
    { label: "Snake", href: "/play/snake" },
    { label: "Void Blocks", href: "/play/void-blocks" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
      ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm border-b border-gray-200/20 dark:border-gray-700/20"
      : "bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm"
      }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#hero");
              }}
              className={`text-2xl font-bold transition-colors duration-300 ${isScrolled
                ? "text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                : "text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                }`}
            >
              Jeffrey Jose
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href, (item as any).external);
                  }}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${isScrolled
                    ? "text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                    : "text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isScrolled
                    ? "bg-blue-600 dark:bg-blue-400"
                    : "bg-blue-600 dark:bg-blue-400"
                    }`}></span>
                </a>
              ))}

              <GamesDropdown isScrolled={isScrolled} gameItems={gameItems} />

              {/* Desktop Theme Toggle - integrated into nav */}
              {mounted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-10 w-10 p-0"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun size={18} />
                  ) : (
                    <Moon size={18} />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Mobile controls - Theme toggle and menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme toggle for mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10 p-0"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </Button>

            {/* Hamburger menu button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-12 w-12 p-0"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          isScrolled={isScrolled}
          navItems={navItems}
          gameItems={gameItems}
          onNavClick={handleNavClick}
        />
      </div>
    </nav>
  );
};

export default Navigation;