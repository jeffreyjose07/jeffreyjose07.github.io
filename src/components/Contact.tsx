import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact-section" className="py-20 bg-gradient-hero text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Let's Work Together
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Ready to bring your next project to life? Let's discuss how we can create something amazing together.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-elegant animate-fade-in">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-white">
                    Get in Touch
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-blue-100">
                      <Mail className="h-5 w-5" />
                      <a href="mailto:jeffreyjose.k@gmail.com" className="hover:text-white transition-colors">
                        jeffreyjose.k@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-blue-100">
                      <Phone className="h-5 w-5" />
                      <span>+919567761105</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-100">
                      <MapPin className="h-5 w-5" />
                      <span>Kharagpur, India</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4 text-white">
                      Connect with me
                    </h4>
                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                        asChild
                      >
                        <a href="https://www.linkedin.com/in/jeffrey-jose-07-k/" target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                        asChild
                      >
                        <a href="https://github.com/jeffreyjose07" target="_blank" rel="noopener noreferrer">
                          <Github className="h-5 w-5" />
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                        asChild
                      >
                        <a href="mailto:jeffreyjose.k@gmail.com">
                          <Mail className="h-5 w-5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="flex flex-col justify-center">
                  <div className="text-center">
                    <h4 className="text-xl font-bold mb-4 text-white">
                      Ready to Start?
                    </h4>
                    <p className="text-blue-100 mb-6 leading-relaxed">
                      Whether you need backend development, system architecture, or full-stack solutions, 
                      I'm here to help bring your vision to reality.
                    </p>
                    <Button 
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 transition-all duration-300 shadow-elegant"
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability Status */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-100 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Available for new opportunities</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;