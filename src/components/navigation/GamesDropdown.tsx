import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface GamesDropdownProps {
  isScrolled: boolean;
  gameItems: { label: string; href: string }[];
}

const GamesDropdown = ({ gameItems }: GamesDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 hover:bg-accent hover:text-primary flex items-center gap-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Games
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`absolute top-full left-0 mt-2 w-44 rounded-md border border-border bg-background shadow-md transition-all duration-200 z-50 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        {gameItems.map((game) => (
          <a
            key={game.href}
            href={game.href}
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              window.location.href = game.href;
            }}
            className="block px-4 py-2.5 text-sm text-foreground hover:text-primary hover:bg-accent transition-colors first:rounded-t-md last:rounded-b-md"
          >
            {game.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default GamesDropdown;
