import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { featuredProjects, otherProjects } from "@/data/projects";
import { useInView } from "@/hooks/use-in-view";

const Projects = () => {
  const { ref: headingRef, isInView: headingVisible } = useInView();
  const { ref: otherRef, isInView: otherVisible } = useInView();

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-20 transition-all duration-700 ${headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Featured <span className="text-gradient-premium">Projects</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-cyan-400 rounded-full mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Showcasing innovative solutions and technical implementations across various domains
          </p>
        </div>

        {/* Featured projects — full cards */}
        <div className="max-w-6xl mx-auto grid gap-16 mb-20">
          {featuredProjects.map((project, index) => (
            <div
              key={index}
              className="group relative rounded-3xl glass-card overflow-hidden glow-border animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-full min-h-[300px] lg:min-h-[400px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 lg:hidden"></div>

                  {project.videoUrl ? (
                    <div
                      className="w-full h-full relative"
                      onMouseEnter={(e) => {
                        const video = e.currentTarget.querySelector('video');
                        if (video) video.play().catch(() => { });
                      }}
                      onMouseLeave={(e) => {
                        const video = e.currentTarget.querySelector('video');
                        if (video) {
                          video.pause();
                          video.currentTime = 0;
                        }
                      }}
                    >
                      <video
                        src={project.videoUrl}
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                        poster={project.image}
                      />
                    </div>
                  ) : (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      width={600}
                      height={400}
                    />
                  )}
                </div>

                <div className="p-8 lg:p-10 flex flex-col justify-center relative z-20">
                  <div className="mb-6">
                    <h3 className="text-3xl font-heading font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-6 mb-8">
                    {project.highlights.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Key Features</h4>
                        <ul className="space-y-2">
                          {project.highlights.map((highlight, i) => (
                            <li key={i} className="text-muted-foreground flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0"></span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-foreground border border-white/10 transition-all duration-300"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-auto">
                    {project.liveUrl && (
                      <Button
                        onClick={() => window.open(project.liveUrl, '_blank')}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(project.githubUrl, '_blank')}
                        className="glass border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        View Code
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other projects — compact grid */}
        <div
          ref={otherRef as React.RefObject<HTMLDivElement>}
          className={`max-w-6xl mx-auto transition-all duration-700 ${otherVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h3 className="text-2xl font-heading font-bold mb-8 text-center">
            Academic & <span className="text-gradient-premium">Research</span> Projects
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <div
                key={index}
                className="group rounded-2xl glass-card p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h4 className="text-lg font-heading font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="px-2 py-0.5 text-xs bg-white/5 text-muted-foreground border border-white/10"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;