import { ArrowUp } from "lucide-react";
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
    <footer className="border-t border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Quick links */}
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="p-2 rounded-full text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="p-2 rounded-full glass text-muted-foreground hover:text-primary transition-all duration-300 hover:-translate-y-1"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Jeffrey Jose. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
