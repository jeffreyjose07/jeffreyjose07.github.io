import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, Linkedin, Github, ArrowRight } from "lucide-react";
import profileImage from "@/assets/jeffrey-profile.jpg";

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-background relative pt-24 md:pt-32 overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 bg-mesh opacity-60 animate-pulse-slow"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 max-w-5xl">
        {/* Profile Section */}
        <div className="mb-12 animate-fade-in-up">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50 animate-pulse-slow"></div>
            <Avatar className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8 ring-4 ring-background shadow-2xl relative z-10">
              <AvatarImage src={profileImage} alt="Jeffrey Jose" className="object-cover" />
              <AvatarFallback className="text-3xl sm:text-4xl font-bold bg-primary text-primary-foreground">JJ</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex justify-center mb-6">
            <Badge variant="outline" className="glass px-4 py-1.5 text-sm font-medium text-primary border-primary/20 rounded-full">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Available for opportunities
            </Badge>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-heading font-bold mb-6 tracking-tight">
            Jeffrey <span className="text-gradient-premium">Jose</span>
          </h1>

          <div className="mb-10">
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-muted-foreground">
              Code craftsman • Tech explorer • Minimalist
            </p>
          </div>

          <p className="text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Passionate about crafting scalable solutions and driving innovation in software engineering.
            Building the future with clean code and thoughtful architecture.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Mail className="mr-2 h-5 w-5" />
              Get in Touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg rounded-full glass border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/resume.pdf';
                link.download = 'Jeffrey_Jose_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              Resume
            </Button>
          </div>

          <div className="flex gap-6 justify-center">
            {[
              { icon: Linkedin, href: "https://www.linkedin.com/in/jeffrey-jose-07-k/" },
              { icon: Github, href: "https://github.com/jeffreyjose07" },
              { icon: Mail, href: "mailto:jeffreyjose.k@gmail.com" }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full glass hover:bg-white/10 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <social.icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;