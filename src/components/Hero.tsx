import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, Linkedin, Github, ArrowRight } from "lucide-react";
import profileImage from "@/assets/jeffrey-profile.jpg";

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30 relative pt-16">
      {/* Enhanced dynamic background with floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient layers */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200/30 to-transparent dark:from-blue-900/30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-200/30 to-transparent dark:from-violet-900/30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating orbs - stars/bubbles effect - Mobile responsive */}
        <div className="hidden sm:block absolute top-20 left-20 w-4 h-4 bg-blue-400/20 dark:bg-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-16 right-8 sm:top-40 sm:right-32 w-2 sm:w-3 h-2 sm:h-3 bg-violet-400/20 dark:bg-violet-400/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="hidden sm:block absolute bottom-40 left-32 w-2 h-2 bg-blue-500/30 dark:bg-blue-500/40 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-16 right-8 sm:bottom-20 sm:right-20 w-3 sm:w-5 h-3 sm:h-5 bg-violet-500/20 dark:bg-violet-500/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        <div className="absolute top-32 left-1/4 sm:top-60 sm:left-1/3 w-2 sm:w-3 h-2 sm:h-3 bg-indigo-400/20 dark:bg-indigo-400/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}></div>
        <div className="hidden sm:block absolute bottom-60 right-1/3 w-4 h-4 bg-blue-300/20 dark:bg-blue-300/30 rounded-full animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '3.2s' }}></div>
        
        {/* Additional smaller particles - Reduced on mobile */}
        <div className="absolute top-24 left-1/2 w-1 h-1 bg-blue-600/40 dark:bg-blue-400/50 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="hidden sm:block absolute bottom-32 left-1/4 w-1 h-1 bg-violet-600/40 dark:bg-violet-400/50 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-indigo-600/40 dark:bg-indigo-400/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 max-w-4xl">
        {/* Modern Profile Section */}
        <div className="mb-8 slide-up">
          <Avatar className="w-24 h-24 mx-auto mb-6 ring-4 ring-white/10 shadow-2xl">
            <AvatarImage src={profileImage} alt="Jeffrey Jose" />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-violet-500 text-white">JJ</AvatarFallback>
          </Avatar>
          <div className="flex justify-center mb-4">
            <Badge variant="outline" className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 border-green-200 dark:border-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Available for opportunities</span>
            </Badge>
          </div>
        </div>
        
        <div className="slide-up-delayed">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent leading-tight drop-shadow-sm">
            Jeffrey Jose
          </h1>
          <div className="mb-8">
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-gray-700 dark:text-gray-200 drop-shadow-sm">
              Code craftsman • Tech explorer • Minimalist
            </p>
          </div>
          <p className="text-lg md:text-xl mb-12 text-gray-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
            Passionate about crafting scalable solutions and driving innovation in software engineering. 
            Building the future with clean code and thoughtful architecture.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Mail className="mr-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              Get in Touch
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="group px-8 py-4 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/resume.pdf';
                link.download = 'Jeffrey_Jose_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Resume
            </Button>
          </div>

          <div className="flex gap-6 justify-center">
            <a 
              href="https://www.linkedin.com/in/jeffrey-jose-07-k/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a 
              href="https://github.com/jeffreyjose07" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Github className="h-6 w-6" />
            </a>
            <a 
              href="mailto:jeffreyjose.k@gmail.com"
              className="group p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-red-600 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;