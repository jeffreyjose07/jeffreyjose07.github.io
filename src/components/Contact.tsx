import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Loader2, Copy, Check } from "lucide-react";
import { socialLinks } from "@/data/socials";

const Contact = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("jeffreyjose.k@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      toast({
        title: "Form unavailable",
        description: "Please email me directly at jeffreyjose.k@gmail.com",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Portfolio Contact: ${formData.name}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Message sent",
          description: "Thanks — I'll reply when I can.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error: unknown) {
      console.error("Web3Forms error:", error);
      const message = error instanceof Error ? error.message : undefined;
      toast({
        title: "Failed to send message",
        description:
          message || "Please try again or email me directly at jeffreyjose.k@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 bg-background relative border-t border-border/50">
      <div className="container mx-auto max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Details */}
          <div>
            <div className="text-xs font-mono font-semibold uppercase tracking-widest text-primary mb-3">
              // 06. DIRECT CONTACT
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
              Open to senior backend, distributed systems engineering, and architecture discussions.
              Prefer email for career opportunities.
            </p>

            <div className="space-y-4 mb-8">
              {/* Email with copy button */}
              <div className="dev-card p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Email
                    </h3>
                    <a
                      href="mailto:jeffreyjose.k@gmail.com"
                      className="text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      jeffreyjose.k@gmail.com
                    </a>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyEmail}
                  className="h-8 px-2.5 text-xs font-mono text-muted-foreground hover:text-foreground gap-1.5 rounded-lg border border-border/60 hover:bg-secondary/60"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-primary" />
                      <span className="text-primary">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Phone */}
              <div className="dev-card p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Phone
                  </h3>
                  <span className="text-sm sm:text-base font-semibold text-foreground">
                    +91 95677 61105
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="dev-card p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Location
                  </h3>
                  <span className="text-sm sm:text-base font-semibold text-foreground">
                    Bengaluru, India
                  </span>
                </div>
              </div>
            </div>

            {/* Social pills */}
            <div className="flex gap-2.5">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2.5 rounded-lg border border-border/70 bg-secondary/30 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-secondary/50 transition-all"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="dev-card dev-card-highlight p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-mono font-medium text-foreground">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-background/80 border-border/80 focus:border-primary focus:ring-1 focus:ring-primary h-10 rounded-lg text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-mono font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-background/80 border-border/80 focus:border-primary focus:ring-1 focus:ring-primary h-10 rounded-lg text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-mono font-medium text-foreground">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Role, team, or systems question…"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isLoading}
                  rows={4}
                  className="bg-background/80 border-border/80 focus:border-primary focus:ring-1 focus:ring-primary resize-none rounded-lg text-sm"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-md shadow-primary/20 text-sm font-mono gap-2 transition-all mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
