import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const navItems = [
    { label: "Home", href: "#hero" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Education", href: "#education" },
    { label: "Blog", href: "/blog", external: true },
    { label: "Contact", href: "#contact" }
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/20" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a 
              href="#hero" 
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#hero");
              }}
              className={`text-2xl font-bold transition-colors duration-300 ${
                isScrolled 
                  ? "text-foreground hover:text-primary" 
                  : "text-white hover:text-white/80"
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
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${
                    isScrolled 
                      ? "text-foreground hover:text-primary" 
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    isScrolled 
                      ? "bg-gradient-to-r from-primary to-primary-glow" 
                      : "bg-gradient-to-r from-white to-white/80"
                  }`}></span>
                </a>
              ))}
              
              {/* Desktop Theme Toggle - integrated into nav */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isScrolled
                      ? "text-foreground hover:text-primary bg-accent/20 hover:bg-accent/40 border border-border/30"
                      : "text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20"
                  }`}
                  aria-label="Toggle theme"
                  type="button"
                >
                  {theme === "dark" ? (
                    <Sun size={18} />
                  ) : (
                    <Moon size={18} />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Mobile controls - Theme toggle and menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme toggle for mobile */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 touch-manipulation rounded-lg border transition-all duration-200 active:scale-95 ${
                isScrolled
                  ? "text-foreground hover:text-primary bg-accent/20 hover:bg-accent/40 border-border/30"
                  : "text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border-white/20"
              }`}
              aria-label="Toggle theme"
              type="button"
            >
              {mounted && theme === "dark" ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
            
            {/* Hamburger menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-3 touch-manipulation rounded-lg border transition-all duration-200 active:scale-95 ${
                isScrolled
                  ? "text-foreground hover:text-primary bg-accent/20 hover:bg-accent/40 border-border/30"
                  : "text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border-white/20"
              }`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              type="button"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced for webview compatibility */}
        <div className={`md:hidden fixed top-16 left-0 right-0 z-40 transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? "translate-y-0 opacity-100" 
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}>
          <div className="bg-background border-b border-border shadow-lg">
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href, (item as any).external);
                  }}
                  className="text-foreground hover:text-primary hover:bg-accent/50 block px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg border border-transparent hover:border-border/30 active:bg-accent/70"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          
          {/* Mobile menu backdrop - tap to close */}
          <div 
            className="fixed inset-0 bg-black/20 -z-10"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ top: '0', height: '100vh' }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;