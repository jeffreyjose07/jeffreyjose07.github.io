import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin, Github, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-gray-50 dark:bg-gray-900 relative">
      {/* Clean geometric background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/40 to-transparent dark:from-emerald-900/20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-100/40 to-transparent dark:from-blue-900/20"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Let's Work Together
          </h2>
          <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Ready to bring your next project to life? Let's discuss how we can create something amazing together.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 slide-up border-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-blue-50/30 dark:from-emerald-950/10 dark:to-blue-950/10 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
            <CardContent className="p-8 md:p-10 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                      Get in Touch
                    </h3>
                    <div className="space-y-6">
                      <div className="group/item flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300">
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 group-hover/item:bg-blue-200 dark:group-hover/item:bg-blue-800 transition-all duration-300">
                          <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-all duration-300" />
                        </div>
                        <a href="mailto:jeffreyjose.k@gmail.com" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                          jeffreyjose.k@gmail.com
                        </a>
                      </div>
                      <div className="group/item flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300">
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 group-hover/item:bg-blue-200 dark:group-hover/item:bg-blue-800 transition-all duration-300">
                          <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-all duration-300" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">+919567761105</span>
                      </div>
                      <div className="group/item flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300">
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 group-hover/item:bg-blue-200 dark:group-hover/item:bg-blue-800 transition-all duration-300">
                          <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-all duration-300" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Bengaluru, India</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                      Connect with me
                    </h4>
                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-12 w-12 border-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300"
                        asChild
                      >
                        <a href="https://www.linkedin.com/in/jeffrey-jose-07-k/" target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-12 w-12 border-2 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300"
                        asChild
                      >
                        <a href="https://github.com/jeffreyjose07" target="_blank" rel="noopener noreferrer">
                          <Github className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-12 w-12 border-2 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 dark:hover:border-red-500 transition-all duration-300"
                        asChild
                      >
                        <a href="mailto:jeffreyjose.k@gmail.com">
                          <Mail className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="flex flex-col justify-center space-y-8">
                  <div className="text-center space-y-6">
                    <div>
                      <h4 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                        Ready to Start?
                      </h4>
                      <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-light">
                      Whether you need backend development, system architecture, or full-stack solutions, 
                      I'm here to help bring your vision to reality with cutting-edge technology.
                    </p>
                    <Button 
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 px-8 py-4"
                      onClick={() => window.location.href = 'mailto:jeffreyjose.k@gmail.com'}
                    >
                      <Mail className="mr-3 h-5 w-5" />
                      Send Message
                    </Button>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center group/stat">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover/stat:text-blue-600 dark:group-hover/stat:text-blue-400 transition-colors duration-300">5+</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Years Experience</div>
                    </div>
                    <div className="text-center group/stat">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover/stat:text-blue-600 dark:group-hover/stat:text-blue-400 transition-colors duration-300">50+</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Projects Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability Status */}
          <div className="text-center mt-8">
            <Badge variant="outline" className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 border-green-200 dark:border-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Available for new opportunities</span>
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;