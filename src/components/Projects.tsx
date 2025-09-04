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
    <section id="projects" className="py-24 bg-gray-50 dark:bg-gray-900 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/20 to-transparent dark:from-blue-900/10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-100/20 to-transparent dark:from-violet-900/10"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Showcasing innovative solutions and technical implementations across various domains
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid gap-12">
          {projects.map((project, index) => (
            <Card key={index} className="group bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-500 border-0 slide-up overflow-hidden" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="relative">
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-violet-50/50 dark:from-blue-950/20 dark:to-violet-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="grid lg:grid-cols-2 gap-8 p-8">
                  {/* Project Image */}
                  <div className="relative group/image">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 group-hover:border-blue-300 dark:group-hover:border-blue-500 transition-all duration-500 mobile-image-container">
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
                      <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-all duration-300 flex items-center justify-center cursor-pointer"
                           onClick={() => project.liveUrl && window.open(project.liveUrl, '_blank')}>
                        <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                          <ExternalLink className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-6 relative z-10">
                    <CardHeader className="p-0">
                      <CardTitle className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-0 space-y-6">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                        {project.description}
                      </p>
                      
                      {/* Highlights */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Features:</h4>
                        <ul className="space-y-2">
                          {project.highlights.map((highlight, i) => (
                            <li key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed flex items-start gap-3 group/item">
                              <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0 group-hover/item:bg-blue-600 transition-colors duration-300"></div>
                              <span className="group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors duration-300">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, i) => (
                            <Badge 
                              key={i} 
                              variant="secondary" 
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 font-medium border-0 hover:scale-105"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                    </CardContent>
                  </div>
                </div>
                
                {/* Action Buttons - Inside the card */}
                <div className="flex flex-col sm:flex-row gap-3 justify-start px-8 pb-8">
                  {project.liveUrl && (
                    <Button 
                      onClick={() => window.open(project.liveUrl, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button 
                      variant="outline"
                      onClick={() => window.open(project.githubUrl, '_blank')}
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </Button>
                  )}
                  {!project.liveUrl && !project.githubUrl && (
                    <div className="text-gray-500 dark:text-gray-400 text-sm italic flex items-center">
                      Academic/Research Project
                    </div>
                  )}
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