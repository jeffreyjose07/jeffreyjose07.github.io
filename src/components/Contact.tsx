import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Linkedin, Github, Phone, MapPin, Send, Loader2 } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Web3Forms API endpoint
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'd32b9d9e-c870-410c-9153-2f6f627c3baa';

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Portfolio Contact: ${formData.name}`,
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Message sent! ✓",
          description: "Thank you for reaching out. I'll get back to you soon!",
        });

        // Clear form
        setFormData({
          name: "",
          email: "",
          message: ""
        });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Web3Forms error:', error);

      toast({
        title: "Failed to send message",
        description: error.message || "Please try again or email me directly at jeffreyjose.k@gmail.com",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Let's Work <span className="text-gradient-premium">Together</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              Ready to bring your next project to life? I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-1">Email</h4>
                  <a href="mailto:jeffreyjose.k@gmail.com" className="text-xl font-medium hover:text-primary transition-colors">
                    jeffreyjose.k@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-1">Phone</h4>
                  <span className="text-xl font-medium">+91 95677 61105</span>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-1">Location</h4>
                  <span className="text-xl font-medium">Bengaluru, India</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              {[
                { icon: Linkedin, href: "https://www.linkedin.com/in/jeffrey-jose-07-k/", label: "LinkedIn" },
                { icon: Github, href: "https://github.com/jeffreyjose07", label: "GitHub" },
                { icon: Mail, href: "mailto:jeffreyjose.k@gmail.com", label: "Email" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-12 h-12 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass p-8 md:p-10 rounded-3xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium ml-1">Name</label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-white/5 border-white/10 focus:border-primary/50 h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium ml-1">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-white/5 border-white/10 focus:border-primary/50 h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium ml-1">Message</label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isLoading}
                  rows={5}
                  className="bg-white/5 border-white/10 focus:border-primary/50 resize-none rounded-xl"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
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