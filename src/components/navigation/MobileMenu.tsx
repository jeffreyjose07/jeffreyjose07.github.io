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
      {/* Backdrop overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Menu sheet */}
      <div
        className={`md:hidden fixed inset-x-0 top-[60px] z-50 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-popover text-popover-foreground border border-border shadow-2xl p-5 mx-4 mt-2 rounded-2xl">
          <div className="space-y-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick(item.href, item.external);
                }}
                className="text-foreground hover:text-primary hover:bg-secondary/70 flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors rounded-xl"
              >
                <span>{item.label}</span>
                <span className="text-xs text-muted-foreground font-mono">→</span>
              </a>
            ))}

            <div className="pt-3 mt-2 border-t border-border/70">
              <div className="text-muted-foreground font-mono px-4 py-1 text-xs uppercase tracking-wider">
                Playable Experiments
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
                  className="text-foreground hover:text-primary hover:bg-secondary/70 block px-6 py-2.5 text-xs font-mono transition-colors rounded-xl"
                >
                  {game.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
