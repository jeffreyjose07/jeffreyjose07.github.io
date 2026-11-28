import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowRight, Code2 } from "lucide-react";
import { featuredProjects, otherProjects } from "@/data/projects";

const Projects = () => {
  return (
    <section id="projects" className="py-24 px-4 sm:px-6 bg-background relative border-t border-border/50">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-12">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-primary mb-3">
            // 04. PROJECTS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">
            Featured Projects
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mt-2 leading-relaxed">
            Production systems and side builds — chat platforms, truth-checking tools, and games with measurable constraints.
          </p>
        </div>

        {/* Featured Projects List */}
        <div className="grid gap-8 mb-16">
          {featuredProjects.map((project, index) => (
            <div
              key={index}
              className="dev-card dev-card-highlight group overflow-hidden"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Media Container with Window Chrome */}
                <div className="flex flex-col bg-muted/20 border-b lg:border-b-0 lg:border-r border-border/60 min-w-0">
                  {/* Simulated Terminal / Browser Top Bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/70 border-b border-border/70 text-xs font-mono text-muted-foreground">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    </div>
                    <span className="text-[11px] opacity-70 truncate px-2">
                      {project.title}
                    </span>
                    <span className="w-8 shrink-0" aria-hidden="true" />
                  </div>

                  <div className="p-3 sm:p-4 flex-1 flex items-center justify-center bg-background/50">
                    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg border border-border/60 bg-muted/30">
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
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                          loading="lazy"
                          width={600}
                          height={375}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-5 sm:p-7 lg:p-8 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base mb-6">
                      {project.description}
                    </p>

                    {/* Key Highlights */}
                    {project.highlights.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-2.5">
                          Key Features
                        </h4>
                        <ul className="space-y-2">
                          {project.highlights.map((highlight, i) => (
                            <li key={i} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies */}
                    <div className="mb-6">
                      <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-2.5">
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 text-xs font-mono rounded-md bg-secondary/60 border border-border/70 text-foreground/90"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Written About Link */}
                    {project.writeups && project.writeups.length > 0 && (
                      <div className="mb-6 pt-3 border-t border-border/50">
                        <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-2">
                          Written About
                        </h4>
                        <ul className="space-y-1.5">
                          {project.writeups.map((writeup, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                              <a
                                href={writeup.href}
                                className="text-xs sm:text-sm text-muted-foreground underline decoration-border hover:text-primary hover:decoration-primary transition-colors font-medium"
                              >
                                {writeup.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-border/50">
                    {project.liveUrl && (
                      <Button
                        size="sm"
                        onClick={() => window.open(project.liveUrl, "_blank")}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-xs font-mono h-9 px-4 gap-1.5"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Live Demo
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(project.githubUrl, "_blank")}
                        className="border-border/80 hover:bg-secondary rounded-lg text-xs font-mono h-9 px-4 gap-1.5"
                      >
                        <Github className="h-3.5 w-3.5" />
                        View Code
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Academic & Research Projects */}
        <div>
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-2">
              Academic & Research Projects
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Coursework and research from M.Tech. studies at IIT Kharagpur.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {otherProjects.map((project, index) => (
              <div
                key={index}
                className="dev-card dev-card-highlight p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="p-2 w-fit rounded-lg bg-primary/10 text-primary border border-primary/20 mb-3">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-base sm:text-lg font-heading font-bold text-foreground mb-2">
                    {project.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/50">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[11px] font-mono rounded bg-secondary/60 text-muted-foreground border border-border/60"
                    >
                      {tech}
                    </span>
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
