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
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Quick links */}
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-6 text-sm text-muted-foreground">
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

          {/* Social icons */}
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="p-2 rounded-md text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="p-2 rounded-md text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Jeffrey Jose. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
