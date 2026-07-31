import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { featuredProjects, otherProjects } from "@/data/projects";

const Projects = () => {
  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Production systems and side builds — chat platforms, truth-checking tools, and games with measurable constraints.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid gap-12 mb-20">
          {featuredProjects.map((project, index) => (
            <div
              key={index}
              className="group relative rounded-xl border border-border bg-secondary/20 overflow-hidden"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-full min-h-[280px] lg:min-h-[380px] overflow-hidden bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 lg:hidden" />

                  {project.videoUrl ? (
                    <div
                      className="w-full h-full relative"
                      onMouseEnter={(e) => {
                        const video = e.currentTarget.querySelector("video");
                        if (video) video.play().catch(() => {});
                      }}
                      onMouseLeave={(e) => {
                        const video = e.currentTarget.querySelector("video");
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
                        className="w-full h-full object-cover absolute inset-0"
                        poster={project.image}
                      />
                    </div>
                  ) : (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={600}
                      height={400}
                    />
                  )}
                </div>

                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="mb-6">
                    <h3 className="text-3xl font-heading font-bold mb-4 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-6 mb-8">
                    {project.highlights.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
                          Key Features
                        </h4>
                        <ul className="space-y-2">
                          {project.highlights.map((highlight, i) => (
                            <li key={i} className="text-muted-foreground flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="px-2.5 py-0.5 rounded-md bg-muted text-foreground border border-border"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-auto">
                    {project.liveUrl && (
                      <Button
                        onClick={() => window.open(project.liveUrl, "_blank")}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(project.githubUrl, "_blank")}
                        className="border-border rounded-md"
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

        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-heading font-bold mb-8 text-center">
            Academic & Research Projects
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-secondary/15 p-6"
              >
                <h4 className="text-lg font-heading font-bold mb-2">{project.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground border border-border"
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
