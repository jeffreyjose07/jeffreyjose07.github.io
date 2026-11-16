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
        className="px-3 py-1 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all flex items-center gap-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>Games</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`absolute top-full right-0 mt-2 w-48 rounded-xl border border-border/80 bg-popover/95 backdrop-blur-xl shadow-xl py-1.5 transition-all duration-200 z-50 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          Playable Experiments
        </div>
        {gameItems.map((game) => (
          <a
            key={game.href}
            href={game.href}
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              window.location.href = game.href;
            }}
            className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-secondary/60 transition-colors mx-1 rounded-lg"
          >
            {game.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default GamesDropdown;
