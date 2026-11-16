import { ArrowUp, Terminal } from "lucide-react";
import { socialLinks } from "@/data/socials";

const Footer = () => {
  const quickLinks = [
    { label: "Blog", href: "/blog" },
    { label: "Games", href: "/play/snake" },
    { label: "Analytics", href: "/analytics.html" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/60 bg-background/50 relative py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand & Micro Tag */}
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-primary/10 text-primary border border-primary/20">
              <Terminal className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm font-heading font-bold text-foreground">
              Jeffrey<span className="text-primary">.</span>Jose
            </span>
            <span className="text-xs font-mono text-muted-foreground ml-2">
              • Systems & Backend
            </span>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-5 text-xs font-mono text-muted-foreground">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social icons & back to top */}
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 rounded-lg border border-border/70 bg-secondary/30 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="p-2 rounded-lg border border-border/70 bg-secondary/30 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors ml-1"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-muted-foreground">
          <p>
            &copy; {typeof __BUILD_YEAR__ === "number" ? __BUILD_YEAR__ : new Date().getFullYear()} Jeffrey Jose. All rights reserved.
          </p>
          <p className="text-[11px] text-muted-foreground/70">
            Engineered with React, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
