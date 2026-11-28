import { Button } from "@/components/ui/button";
import { Download, ArrowRight, Mail } from "lucide-react";
// 384px WebP: the avatar renders at 160px CSS max (sm:w-40), so this covers 2x
// displays. The 592px JPEG it replaced was 86 KiB for a 160px slot — the single
// largest asset on the page. The JPEG is still the source of record and is what
// the blog build copies to public/ for post author cards.
import profileImage from "@/assets/jeffrey-profile.webp";
import { socialLinks } from "@/data/socials";

const Hero = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-background bg-grid-pattern relative pt-20 sm:pt-28 md:pt-36 pb-10 sm:pb-16 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-primary/10 rounded-full blur-[130px] pointer-events-none -z-0" />

      <div className="mx-auto px-4 sm:px-6 text-center relative z-10 max-w-4xl w-full">
        {/* Status Chip */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/10 text-xs font-mono text-primary mb-5 sm:mb-6 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>Senior Backend Engineer</span>
        </div>

        {/* Profile Avatar */}
        <div className="mb-5 sm:mb-6">
          <div className="relative inline-block group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/30 via-emerald-400/20 to-teal-400/30 blur-md opacity-70 group-hover:opacity-100 transition duration-500" />
            {/* A plain <img>, not Radix's Avatar to preserve prerender hydration matching */}
            <img
              src={profileImage}
              alt="Jeffrey Jose"
              className="relative w-24 h-24 sm:w-36 sm:h-36 mx-auto rounded-full ring-2 ring-primary/30 object-cover shadow-xl"
              width={144}
              height={144}
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-background border-2 border-background flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold mb-3 sm:mb-4 tracking-tight text-foreground">
          Jeffrey <span className="text-gradient-premium">Jose</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl font-normal text-muted-foreground mb-3 sm:mb-4 max-w-2xl mx-auto">
          Distributed Systems • 6 yrs @ Jio
        </p>

        <p className="text-sm sm:text-base md:text-lg mb-5 sm:mb-6 text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
          I design and ship Spring Boot systems that stay correct under load — Kafka pipelines,
          WebFlux services, and the failure modes that only show up in production.
        </p>

        {/* High-credibility Developer Proof Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-7 sm:mb-10 max-w-2xl mx-auto">
          <div className="dev-chip">
            <span className="text-primary font-bold">6 yrs</span> @ Jio Platforms
          </div>
          <div className="dev-chip">
            <span className="text-primary font-bold">50k+ req/s</span> WebFlux
          </div>
          <div className="dev-chip">
            <span className="text-primary font-bold">GATE AIR 170</span>
          </div>
          <div className="dev-chip">
            <span className="text-primary font-bold">IIT Kharagpur</span> M.Tech
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-3.5 justify-center mb-8 sm:mb-12">
          <Button
            size="lg"
            className="h-11 px-6 text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
            onClick={() => {
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Mail className="h-4 w-4" />
            Get in Touch
            <ArrowRight className="h-4 w-4" />
          </Button>

          <a
            href="/resume.pdf"
            download="Jeffrey_Jose_Resume.pdf"
            className="inline-flex items-center justify-center h-11 px-6 text-sm rounded-lg border border-border/80 bg-secondary/40 hover:bg-secondary hover:border-border transition-all font-medium text-foreground gap-2"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
            Resume
          </a>
        </div>

        {/* Social Links */}
        <div className="flex gap-2.5 justify-center">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="p-2.5 rounded-lg border border-border/70 bg-secondary/20 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-secondary/40 transition-all duration-200"
            >
              <social.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
