interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isScrolled: boolean;
  navItems: { label: string; href: string; external?: boolean }[];
  gameItems: { label: string; href: string }[];
  onNavClick: (href: string, external?: boolean) => void;
}

const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  gameItems,
  onNavClick,
}: MobileMenuProps) => {
  return (
    <>
      <div
        className={`md:hidden fixed left-0 right-0 z-40 transform transition-all duration-300 ease-in-out ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
        style={{ top: "64px" }}
      >
        <div className="bg-background border-b border-border">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick(item.href, item.external);
                }}
                className="text-foreground hover:text-primary hover:bg-accent block px-4 py-3 text-base font-medium transition-colors rounded-md"
              >
                {item.label}
              </a>
            ))}

            <div className="space-y-1 pt-2">
              <div className="text-muted-foreground font-medium px-4 py-2 text-xs uppercase tracking-wider">
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
                  className="text-foreground hover:text-primary hover:bg-accent block px-8 py-2 text-base font-medium transition-colors rounded-md"
                >
                  {game.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={onClose}
          style={{ top: "0", height: "100vh" }}
        />
      </div>
    </>
  );
};

export default MobileMenu;
