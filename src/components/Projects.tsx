import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "Scalable Chat Platform",
      description: "A full-stack real-time chat application with enterprise-grade architecture, featuring Spring Boot backend, React TypeScript frontend, WebSocket communication, and microservices design with comprehensive CI/CD pipeline.",
      image: "/scalable-chat-platform.png",
      liveUrl: "https://scalable-chat-platform.onrender.com/",
      githubUrl: "https://github.com/jeffreyjose07/scalable-chat-platform",
      technologies: ["Spring Boot", "React", "TypeScript", "WebSocket", "Kafka", "Docker", "GitHub Actions", "Java"],
      highlights: [
        "Real-time messaging with WebSocket connections",
        "Microservices architecture with Spring Boot",
        "Comprehensive CI/CD pipeline with GitHub Actions",
        "Automated testing and security scanning",
        "Docker containerization for deployment",
        "Event-driven architecture with Kafka integration",
        "Enterprise-grade development workflow",
        "Automated dependency updates and vulnerability scanning"
      ]
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-20 h-20 bg-primary rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary-glow rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 slide-up">
          <div className="inline-block">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-gradient">
              Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto mb-6"></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Showcasing innovative solutions and technical implementations across various domains
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid gap-12">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className="perspective-card group bg-gradient-card shadow-elegant hover:shadow-glow transition-all duration-500 border border-border/50 hover:border-primary/20 slide-up overflow-hidden"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="card-inner relative">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                
                <div className="grid lg:grid-cols-2 gap-8 p-8">
                  {/* Project Image */}
                  <div className="relative group/image">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary-glow/10 border border-border/30 group-hover:border-primary/30 transition-all duration-500">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-700 cursor-pointer"
                        onClick={() => window.open(project.liveUrl, '_blank')}
                      />
                      {/* Overlay with link icon */}
                      <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-all duration-300 flex items-center justify-center cursor-pointer"
                           onClick={() => window.open(project.liveUrl, '_blank')}>
                        <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                          <ExternalLink className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-6 relative z-10">
                    <CardHeader className="p-0">
                      <div className="relative">
                        <CardTitle className="text-3xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                          {project.title}
                        </CardTitle>
                        <div className="absolute -left-4 top-0 w-1 h-8 bg-gradient-to-b from-primary to-primary-glow rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-0 space-y-6">
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {project.description}
                      </p>
                      
                      {/* Highlights */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Key Features:</h4>
                        <ul className="space-y-2">
                          {project.highlights.map((highlight, i) => (
                            <li key={i} className="text-muted-foreground leading-relaxed flex items-start gap-3 group/item">
                              <div className="w-2 h-2 rounded-full bg-primary/60 mt-2 flex-shrink-0 group-hover/item:bg-primary transition-colors duration-300"></div>
                              <span className="group-hover/item:text-foreground transition-colors duration-300">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, i) => (
                            <Badge 
                              key={i} 
                              variant="secondary" 
                              className="px-3 py-1 bg-accent/50 text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium border border-border/30 hover:border-primary/50 hover:scale-105"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-4">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
                          }}
                          className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-300 shadow-elegant group/btn hover:shadow-lg cursor-pointer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                          Live Demo
                        </button>
                        {project.githubUrl && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
                            }}
                            className="inline-flex items-center justify-center rounded-md border border-border hover:border-primary/50 px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 group/btn hover:bg-accent cursor-pointer"
                          >
                            <Github className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                            View Code
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;