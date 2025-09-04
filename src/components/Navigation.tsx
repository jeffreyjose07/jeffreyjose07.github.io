import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGamesDropdownOpen, setIsGamesDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const navItems = [
    { label: "Home", href: "#hero" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Education", href: "#education" },
    { label: "Blog", href: "/blog", external: true },
    { label: "Analytics", href: "/analytics.html", external: true },
    { label: "Contact", href: "#contact" }
  ];

  const gameItems = [
    { label: "Snake", href: "/games/snake/" },
    { label: "Void Blocks", href: "/games/void-blocks/" }
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isGamesDropdownOpen) {
        setIsGamesDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isGamesDropdownOpen]);

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm border-b border-gray-200/20 dark:border-gray-700/20" 
        : "bg-transparent"
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
              className={`text-2xl font-bold transition-colors duration-300 ${
                isScrolled 
                  ? "text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400" 
                  : "text-white hover:text-blue-200"
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
                      ? "text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400" 
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    isScrolled 
                      ? "bg-blue-600 dark:bg-blue-400" 
                      : "bg-white"
                  }`}></span>
                </a>
              ))}
              
              {/* Games Dropdown */}
              <div className="relative group">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsGamesDropdownOpen(!isGamesDropdownOpen);
                  }}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 relative group/games flex items-center gap-1 ${
                    isScrolled 
                      ? "text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400" 
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  Games
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isGamesDropdownOpen ? 'rotate-180' : ''}`} />
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover/games:w-full ${
                    isScrolled 
                      ? "bg-blue-600 dark:bg-blue-400" 
                      : "bg-white"
                  }`}></span>
                </button>
                
                {/* Dropdown Menu */}
                <div className={`absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl transition-all duration-200 z-50 ${
                  isGamesDropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}>
                  {gameItems.map((game) => (
                    <a
                      key={game.href}
                      href={game.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsGamesDropdownOpen(false);
                        window.location.href = game.href;
                      }}
                      className="block px-4 py-3 text-sm text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {game.label}
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Desktop Theme Toggle - integrated into nav */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isScrolled
                      ? "text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100/50 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
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
                  ? "text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100/50 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
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
                  ? "text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100/50 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
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
        <div className={`md:hidden fixed left-0 right-0 z-40 transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? "translate-y-0 opacity-100" 
            : "-translate-y-full opacity-0 pointer-events-none"
        }`} style={{ top: isScrolled ? '64px' : '64px' }}>
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href, (item as any).external);
                  }}
                  className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 block px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-600 active:bg-gray-100 dark:active:bg-gray-700"
                >
                  {item.label}
                </a>
              ))}
              
              {/* Mobile Games Section */}
              <div className="space-y-1">
                <div className="text-gray-900 dark:text-white font-medium px-4 py-2 text-base">
                  Games
                </div>
                {gameItems.map((game) => (
                  <a
                    key={game.href}
                    href={game.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      window.location.href = game.href;
                    }}
                    className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 block px-8 py-2 text-base font-medium transition-all duration-200 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-600 active:bg-gray-100 dark:active:bg-gray-700"
                  >
                    {game.label}
                  </a>
                ))}
              </div>
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