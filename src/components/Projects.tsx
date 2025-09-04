import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "Scalable Chat Platform",
      description: "A production-ready real-time chat application built with Spring Boot 3.2 and React 18. Features multi-database architecture, WebSocket messaging, and horizontal scaling design supporting 1000+ concurrent users.",
      image: "/scalable-chat-platform.png",
      liveUrl: "https://scalable-chat-platform.onrender.com/",
      githubUrl: "https://github.com/jeffreyjose07/scalable-chat-platform",
      technologies: ["Spring Boot 3.2", "React 18", "TypeScript", "PostgreSQL", "MongoDB", "Redis", "Docker", "WebSocket"],
      highlights: [
        "Multi-database strategy: PostgreSQL, MongoDB, Redis",
        "Real-time WebSocket messaging with 500+ msg/sec capacity",
        "Role-based access control with JWT authentication",
        "Supports 1000+ concurrent users with horizontal scaling",
        "Private and group conversations with read receipts",
        "Message search and filtering capabilities",
        "Dockerized deployment on Render platform",
        "Event-driven architecture with async processing"
      ]
    },
    {
      title: "VOID BLOCKS",
      description: "A single-file cyberpunk Tetris variant built with vanilla JavaScript and HTML5 Canvas. Features unique virus spreading mechanics, firewall challenges, and terminal-aesthetic design with zero external dependencies.",
      image: "/games/void-blocks/screenshot.png",
      liveUrl: "/games/void-blocks/",
      githubUrl: "https://github.com/jeffreyjose07/void-blocks-game",
      technologies: ["Vanilla JavaScript", "HTML5 Canvas", "CSS3", "Game Development"],
      highlights: [
        "Single HTML file under 50KB with zero dependencies",
        "Virus spreading mechanics with 30% infection chance",
        "Firewall challenges triggered every 10 levels",
        "Time manipulation via data fragments",
        "Optimized 60fps performance with requestAnimationFrame",
        "Terminal-inspired cyberpunk aesthetic with glow effects"
      ]
    },
    {
      title: "Snake Game - Terminal Aesthetic",
      description: "A modern take on the classic Snake game with terminal-inspired cyberpunk aesthetics. Built with vanilla JavaScript and HTML5 Canvas, featuring smooth gameplay, retro glow effects, and responsive controls optimized for both desktop and mobile.",
      image: "/snake-game-screenshot.png",
      liveUrl: "/games/snake/",
      githubUrl: "https://github.com/jeffreyjose07/snake-game",
      technologies: ["Vanilla JavaScript", "HTML5 Canvas", "CSS3", "Game Development", "Responsive Design"],
      highlights: [
        "Classic Snake gameplay with modern enhancements",
        "Terminal-inspired cyberpunk visual design",
        "Smooth 60fps performance with requestAnimationFrame",
        "Responsive controls for desktop and mobile",
        "Retro glow effects and ASCII-style aesthetics",
        "Score tracking and game over animations",
        "Single HTML file with zero dependencies"
      ]
    },
    {
      title: "Detection of Forest Area in SAR Images",
      description: "Computer vision project focused on detecting and classifying forest areas in polarimetric SAR RISAT-1 images using advanced image processing techniques and machine learning algorithms.",
      image: "/generic-project.png",
      technologies: ["Python", "Computer Vision", "Machine Learning", "SAR Image Processing", "Pattern Recognition"],
      highlights: [
        "Implemented advanced SAR image processing algorithms",
        "Developed classification models for forest area detection",
        "Applied polarimetric analysis techniques",
        "Achieved accurate forest boundary identification",
        "Utilized RISAT-1 satellite imagery data"
      ]
    },
    {
      title: "Graph-based Document Summarization",
      description: "Natural language processing system that generates concise summaries of word documents using graph-based approaches including text-rank and degree-centrality algorithms.",
      image: "/generic-project.png",
      technologies: ["Python", "NLP", "Graph Theory", "Text Processing", "Algorithm Design"],
      highlights: [
        "Implemented TextRank algorithm for document summarization",
        "Applied degree-centrality based sentence ranking",
        "Developed graph-based text representation",
        "Automated summary generation pipeline",
        "Evaluated summarization quality metrics"
      ]
    },
    {
      title: "Emotional Intelligence in Social Media",
      description: "Data analytics project analyzing emotional intelligence patterns in Twitter users based on gender differences in tweets posted on sensitive topics, providing insights into social media behavior.",
      image: "/generic-project.png",
      technologies: ["Python", "Data Analytics", "Social Media Mining", "Sentiment Analysis", "Statistical Analysis"],
      highlights: [
        "Analyzed large-scale Twitter dataset",
        "Implemented sentiment analysis algorithms",
        "Studied gender-based emotional patterns",
        "Applied statistical analysis techniques",
        "Generated behavioral insights from social media data"
      ]
    }
  ];

  return (
    <section id="projects" className="py-24 bg-background relative overflow-hidden">
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
            <div key={index} className="space-y-6">
              <div 
                className="perspective-card group bg-gradient-card shadow-elegant hover:shadow-glow transition-all duration-500 border border-border/50 hover:border-primary/20 slide-up overflow-hidden rounded-lg"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
              <div className="card-inner relative">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none"></div>
                
                <div className="grid lg:grid-cols-2 gap-8 p-8">
                  {/* Project Image */}
                  <div className="relative group/image">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary-glow/10 border border-border/30 group-hover:border-primary/30 transition-all duration-500 mobile-image-container">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover md:object-contain lg:object-cover group-hover/image:scale-105 transition-transform duration-700 cursor-pointer bg-white/5 mobile-image-fit"
                        onClick={() => project.liveUrl && window.open(project.liveUrl, '_blank')}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.objectFit = 'contain';
                          e.currentTarget.style.padding = '1rem';
                        }}
                      />
                      {/* Overlay with link icon */}
                      <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-all duration-300 flex items-center justify-center cursor-pointer"
                           onClick={() => project.liveUrl && window.open(project.liveUrl, '_blank')}>
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

                    </CardContent>
                  </div>
                </div>
                </div>
              </div>
              
              {/* Action Buttons - Outside the card structure */}
              <div className="flex gap-4 justify-center mt-6">
              {project.liveUrl && (
                <button 
                  onClick={() => {
                    console.log('Live Demo button clicked!', project.liveUrl);
                    window.open(project.liveUrl, '_blank');
                  }}
                  className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-3 text-sm font-medium text-white transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </button>
              )}
              {project.githubUrl && (
                <button 
                  onClick={() => {
                    console.log('View Code button clicked!', project.githubUrl);
                    window.open(project.githubUrl, '_blank');
                  }}
                  className="inline-flex items-center justify-center rounded-md border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 hover:bg-gray-50 cursor-pointer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  View Code
                </button>
              )}
              {!project.liveUrl && !project.githubUrl && (
                <div className="text-muted-foreground text-sm italic">
                  Academic/Research Project
                </div>
              )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;