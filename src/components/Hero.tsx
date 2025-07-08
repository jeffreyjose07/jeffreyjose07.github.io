import { Button } from "@/components/ui/button";
import { Download, Mail, Linkedin, Github } from "lucide-react";
import profileImage from "@/assets/jeffrey-profile.jpg";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-hero text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-glow rounded-full blur-3xl animate-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Profile Image */}
        <div className="mb-8 animate-fade-in">
          <img 
            src={profileImage} 
            alt="Jeffrey Jose" 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto shadow-glow border-4 border-white/20 backdrop-blur-sm"
          />
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Jeffrey Jose
          </h1>
          <h2 className="text-xl md:text-2xl mb-4 text-blue-100 font-medium">
            Senior Software Engineer
          </h2>
          <p className="text-lg md:text-xl mb-8 text-blue-50 max-w-3xl mx-auto leading-relaxed">
            Always eager to learn new skills and adapt to new situations. I love challenging myself by overcoming them. 
            Always keen on solving real-world problems using latest technologies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-elegant"
              onClick={() => {
                const contactSection = document.getElementById('contact-section');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Mail className="mr-2 h-5 w-5" />
              Get in Touch
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 transition-all duration-300 shadow-elegant"
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
              Download Resume
            </Button>
          </div>

          <div className="flex gap-6 justify-center">
            <a 
              href="https://www.linkedin.com/in/jeffrey-jose-07-k/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-110 transform"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a 
              href="https://github.com/jeffreyjose07" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-110 transform"
            >
              <Github className="h-6 w-6" />
            </a>
            <a 
              href="mailto:jeffreyjose.k@gmail.com"
              className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-110 transform"
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