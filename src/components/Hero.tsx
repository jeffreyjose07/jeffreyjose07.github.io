import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, Linkedin, Github, ArrowRight } from "lucide-react";
import profileImage from "@/assets/jeffrey-profile.jpg";

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-800 relative pt-16">
      {/* Clean geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-50/50 to-transparent dark:from-blue-950/30" />
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-violet-50/30 to-transparent dark:from-violet-950/20" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 max-w-4xl">
        {/* Modern Profile Section */}
        <div className="mb-8 slide-up">
          <Avatar className="w-24 h-24 mx-auto mb-6 ring-4 ring-white/10 shadow-2xl">
            <AvatarImage src={profileImage} alt="Jeffrey Jose" />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-violet-500 text-white">JJ</AvatarFallback>
          </Avatar>
          <div className="flex justify-center mb-4">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
              Available for opportunities
            </Badge>
          </div>
        </div>
        
        <div className="slide-up-delayed">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent leading-tight">
            Jeffrey Jose
          </h1>
          <div className="mb-8">
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-gray-600 dark:text-gray-300 mb-4">
              Full Stack Developer & Tech Innovator
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Code craftsman • Tech explorer • Minimalist
            </p>
          </div>
          <p className="text-lg md:text-xl mb-12 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Passionate about crafting scalable solutions and driving innovation in software engineering. 
            Building the future with clean code and thoughtful architecture.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="group px-8 py-4 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300"
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