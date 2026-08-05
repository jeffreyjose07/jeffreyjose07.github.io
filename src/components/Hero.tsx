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
      className="min-h-screen flex items-center justify-center bg-background relative pt-24 md:pt-32"
    >
      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 max-w-5xl">
        <div className="mb-10">
          {/* A plain <img>, not Radix's Avatar.
              Radix renders AvatarImage as null until the image reports loaded,
              so the prerendered HTML (captured after load) contained an <img>
              that React's first hydration pass did not — a structural mismatch
              that dropped the entire root back to client rendering. The loading
              state machine bought nothing here: this photo always exists and is
              eagerly fetched. `fetchpriority` is lowercase because React 18
              does not recognise the camelCase prop. */}
          <img
            src={profileImage}
            alt="Jeffrey Jose"
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8 ring-1 ring-border rounded-full object-cover"
            width={160}
            height={160}
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
        </div>

        <h1 className="text-6xl sm:text-7xl md:text-8xl font-heading font-bold mb-6 tracking-tight">
          Jeffrey <span className="text-gradient-premium">Jose</span>
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl font-light text-muted-foreground mb-8">
          Senior Backend Engineer • Distributed Systems • 6 yrs @ Jio
        </p>

        <p className="text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          I design and ship Spring Boot systems that stay correct under load — Kafka pipelines,
          WebFlux services, and the failure modes that only show up in production.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <Button
            size="lg"
            className="h-12 px-7 text-base rounded-md bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => {
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Mail className="mr-2 h-4 w-4" />
            Get in Touch
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <a
            href="/resume.pdf"
            download="Jeffrey_Jose_Resume.pdf"
            className="inline-flex items-center justify-center h-12 px-7 text-base rounded-md border border-border bg-secondary/40 hover:bg-secondary transition-colors font-medium"
          >
            <Download className="mr-2 h-4 w-4" />
            Resume
          </a>
        </div>

        <div className="flex gap-3 justify-center">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="p-3 rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            >
              <social.icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
