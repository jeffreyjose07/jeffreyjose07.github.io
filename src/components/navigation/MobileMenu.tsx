interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    isScrolled: boolean;
    navItems: { label: string; href: string; external?: boolean }[];
    gameItems: { label: string; href: string }[];
    onNavClick: (href: string, external?: boolean) => void;
}

const MobileMenu = ({ isOpen, onClose, isScrolled, navItems, gameItems, onNavClick }: MobileMenuProps) => {
    return (
        <>
            <div className={`md:hidden fixed left-0 right-0 z-40 transform transition-all duration-300 ease-in-out ${isOpen
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
                                    onNavClick(item.href, item.external);
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
                                        onClose();
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
                    onClick={onClose}
                    style={{ top: '0', height: '100vh' }}
                />
            </div>
        </>
    );
};

export default MobileMenu;
