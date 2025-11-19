import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface GamesDropdownProps {
    isScrolled: boolean;
    gameItems: { label: string; href: string }[];
}

const GamesDropdown = ({ isScrolled, gameItems }: GamesDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = () => {
            if (isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative group">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`px-3 py-2 text-sm font-medium transition-all duration-300 relative group/games flex items-center gap-1 ${isScrolled
                        ? "text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                        : "text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
            >
                Games
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover/games:w-full ${isScrolled
                        ? "bg-blue-600 dark:bg-blue-400"
                        : "bg-blue-600 dark:bg-blue-400"
                    }`}></span>
            </button>

            {/* Dropdown Menu */}
            <div className={`absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl transition-all duration-200 z-50 ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}>
                {gameItems.map((game) => (
                    <a
                        key={game.href}
                        href={game.href}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                            window.location.href = game.href;
                        }}
                        className="block px-4 py-3 text-sm text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 first:rounded-t-lg last:rounded-b-lg"
                    >
                        {game.label}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default GamesDropdown;
