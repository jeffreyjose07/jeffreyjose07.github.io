import { Button } from "@/components/ui/button";
import { Download, Mail, Linkedin, Github } from "lucide-react";
import profileImage from "@/assets/jeffrey-profile.jpg";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-hero text-white relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl floating" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-glow rounded-full blur-3xl floating-delayed" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-primary rounded-full blur-2xl pulse-glow" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-60 floating" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-primary-glow rounded-full opacity-80 floating-delayed" />
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-50 floating" />
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-primary rounded-full opacity-70 floating-delayed" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Enhanced Profile Image */}
        <div className="mb-12 slide-up">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-full blur-xl opacity-30 animate-pulse"></div>
            <img 
              src={profileImage} 
              alt="Jeffrey Jose" 
              className="w-36 h-36 md:w-44 md:h-44 rounded-full mx-auto shadow-glow border-4 border-white/30 backdrop-blur-sm relative z-10 glow-hover transition-all duration-500 hover:scale-105"
            />
            <div className="absolute -inset-2 bg-gradient-to-r from-primary via-primary-glow to-primary rounded-full opacity-20 blur-lg"></div>
          </div>
        </div>
        
        <div className="slide-up-delayed">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight text-gradient bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-shadow">
            Jeffrey Jose
          </h1>
          <div className="relative inline-block mb-6">
            <h2 className="text-2xl md:text-3xl font-medium text-white/90 tracking-wide">
              Senior Software Engineer
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-primary-glow rounded-full"></div>
          </div>
          <p className="text-lg md:text-xl mb-12 text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
            Passionate about crafting scalable solutions and driving innovation in software engineering. 
            Always eager to learn new technologies and solve complex real-world problems.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button 
              variant="outline" 
              size="lg" 
              className="glass-effect border-white/30 text-white hover:bg-white/20 transition-all duration-500 shadow-elegant btn-modern group px-8 py-4 text-lg font-medium"
              onClick={() => {
                const contactSection = document.getElementById('contact-section');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Mail className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Get in Touch
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-gradient-to-r from-white to-gray-100 text-primary hover:from-gray-100 hover:to-white transition-all duration-500 shadow-elegant btn-modern group px-8 py-4 text-lg font-medium border-0"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/resume.pdf';
                link.download = 'Jeffrey_Jose_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Download Resume
            </Button>
          </div>

          <div className="flex gap-8 justify-center">
            <a 
              href="https://www.linkedin.com/in/jeffrey-jose-07-k/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative p-3 rounded-full glass-effect border border-white/20 text-white/80 hover:text-white transition-all duration-500 hover:scale-110 glow-hover"
            >
              <Linkedin className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 rounded-full bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </a>
            <a 
              href="https://github.com/jeffreyjose07" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative p-3 rounded-full glass-effect border border-white/20 text-white/80 hover:text-white transition-all duration-500 hover:scale-110 glow-hover"
            >
              <Github className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 rounded-full bg-gray-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </a>
            <a 
              href="mailto:jeffreyjose.k@gmail.com"
              className="group relative p-3 rounded-full glass-effect border border-white/20 text-white/80 hover:text-white transition-all duration-500 hover:scale-110 glow-hover"
            >
              <Mail className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 rounded-full bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;