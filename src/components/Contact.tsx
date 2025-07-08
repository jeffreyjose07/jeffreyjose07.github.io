import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact-section" className="py-24 bg-gradient-hero text-white relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-white rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-glow rounded-full blur-3xl floating-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-primary rounded-full blur-2xl pulse-glow"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 slide-up">
          <div className="inline-block">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gradient bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text">
              Let's Work Together
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-white/50 to-white/80 rounded-full mx-auto mb-6"></div>
          </div>
          <p className="text-xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
            Ready to bring your next project to life? Let's discuss how we can create something amazing together and push the boundaries of innovation.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="glass-effect border-white/30 shadow-elegant slide-up-delayed group glow-hover">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
            <CardContent className="p-10 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Enhanced Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-3xl font-bold mb-8 text-white group-hover:text-blue-100 transition-colors duration-300">
                      Get in Touch
                    </h3>
                    <div className="space-y-6">
                      <div className="group/item flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                        <div className="p-2 rounded-full bg-white/10 group-hover/item:bg-white/20 transition-all duration-300">
                          <Mail className="h-5 w-5 text-blue-200 group-hover/item:text-white group-hover/item:scale-110 transition-all duration-300" />
                        </div>
                        <a href="mailto:jeffreyjose.k@gmail.com" className="text-white/80 hover:text-white transition-colors font-medium">
                          jeffreyjose.k@gmail.com
                        </a>
                      </div>
                      <div className="group/item flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                        <div className="p-2 rounded-full bg-white/10 group-hover/item:bg-white/20 transition-all duration-300">
                          <Phone className="h-5 w-5 text-blue-200 group-hover/item:text-white group-hover/item:scale-110 transition-all duration-300" />
                        </div>
                        <span className="text-white/80 font-medium">+919567761105</span>
                      </div>
                      <div className="group/item flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                        <div className="p-2 rounded-full bg-white/10 group-hover/item:bg-white/20 transition-all duration-300">
                          <MapPin className="h-5 w-5 text-blue-200 group-hover/item:text-white group-hover/item:scale-110 transition-all duration-300" />
                        </div>
                        <span className="text-white/80 font-medium">Kharagpur, India</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold mb-6 text-white">
                      Connect with me
                    </h4>
                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="glass-effect border-white/30 text-white hover:bg-white/20 transition-all duration-500 group/btn btn-modern glow-hover"
                        asChild
                      >
                        <a href="https://www.linkedin.com/in/jeffrey-jose-07-k/" target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="glass-effect border-white/30 text-white hover:bg-white/20 transition-all duration-500 group/btn btn-modern glow-hover"
                        asChild
                      >
                        <a href="https://github.com/jeffreyjose07" target="_blank" rel="noopener noreferrer">
                          <Github className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="glass-effect border-white/30 text-white hover:bg-white/20 transition-all duration-500 group/btn btn-modern glow-hover"
                        asChild
                      >
                        <a href="mailto:jeffreyjose.k@gmail.com">
                          <Mail className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Call to Action */}
                <div className="flex flex-col justify-center space-y-8">
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <h4 className="text-3xl font-bold mb-6 text-white">
                        Ready to Start?
                      </h4>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-white/50 to-white/80 rounded-full"></div>
                    </div>
                    <p className="text-white/80 mb-8 leading-relaxed text-lg font-light">
                      Whether you need backend development, system architecture, or full-stack solutions, 
                      I'm here to help bring your vision to reality with cutting-edge technology.
                    </p>
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-white to-gray-100 text-primary hover:from-gray-100 hover:to-white transition-all duration-500 shadow-elegant btn-modern group/cta px-8 py-4 text-lg font-medium border-0"
                    >
                      <Mail className="mr-3 h-5 w-5 group-hover/cta:scale-110 transition-transform duration-300" />
                      Send Message
                    </Button>
                  </div>

                  {/* Stats or highlights */}
                  <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/20">
                    <div className="text-center group/stat">
                      <div className="text-2xl font-bold text-white mb-2 group-hover/stat:text-blue-100 transition-colors duration-300">5+</div>
                      <div className="text-white/70 text-sm font-medium">Years Experience</div>
                    </div>
                    <div className="text-center group/stat">
                      <div className="text-2xl font-bold text-white mb-2 group-hover/stat:text-blue-100 transition-colors duration-300">50+</div>
                      <div className="text-white/70 text-sm font-medium">Projects Completed</div>
                    </div>
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