import {
  Cpu,
  Database,
  Server,
  Network,
  ShieldCheck,
  Award,
  CheckCircle2,
  Terminal,
} from "lucide-react";

interface SkillCategory {
  title: string;
  tag: string;
  icon: typeof Cpu;
  description: string;
  skills: string[];
  featured?: boolean;
}

const skillCategories: SkillCategory[] = [
  {
    title: "Core Architecture & Reactive Systems",
    tag: "PRIMARY FOCUS",
    icon: Cpu,
    description: "High-throughput asynchronous services and event-driven distributed architectures built for resilience.",
    skills: [
      "Java 21",
      "Spring Boot 3",
      "Spring WebFlux",
      "Project Reactor",
      "Apache Kafka",
      "Spring Batch",
      "Microservices",
      "RESTful APIs",
      "Reactive Streams",
    ],
    featured: true,
  },
  {
    title: "Data & Distributed Storage",
    tag: "DATA LAYER",
    icon: Database,
    description: "High-scale relational, document, and in-memory datastores configured for low latency and high consistency.",
    skills: [
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Elasticsearch",
      "Liquibase",
      "Hibernate/JPA",
      "Distributed Caching",
      "Partitioning",
    ],
  },
  {
    title: "Cloud, DevOps & Reliability",
    tag: "INFRASTRUCTURE",
    icon: Server,
    description: "Containerized environments and zero-downtime deployment pipelines for mission-critical enterprise services.",
    skills: [
      "Docker",
      "Kubernetes",
      "Google Cloud (GCP)",
      "Azure DevOps",
      "CI/CD Pipelines",
      "Zero-Downtime Deploys",
      "Blue-Green Releases",
    ],
  },
  {
    title: "Architecture & Systems Design",
    tag: "METHODOLOGY",
    icon: Network,
    description: "Scalable enterprise patterns, domain isolation, and modernizing legacy monolithic architectures.",
    skills: [
      "Event-Driven Architecture",
      "Multi-Tenant Services",
      "Legacy Modernization",
      "Concurrency & Threading",
      "Distributed Tracing",
      "Failure Mode Analysis",
    ],
  },
  {
    title: "Quality, Testing & Mentorship",
    tag: "EXCELLENCE",
    icon: ShieldCheck,
    description: "Driving clean code standards, comprehensive automated testing, and technical team mentorship.",
    skills: [
      "JUnit & Mockito",
      "Test-Driven Development (TDD)",
      "Technical Mentorship",
      "Code Review Standards",
      "System Architecture Docs",
      "Zero Code Smells",
    ],
  },
];

const certifications = [
  "Functional Programming with Java",
  "Spring: Spring Batch",
  "Introduction to Generative AI",
  "Java (Basic) Certificate",
  "Spring Code Challenges",
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-4 sm:px-6 bg-background relative border-t border-border/50">
      <div className="container mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-14">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-primary mb-3">
            // 03. SYSTEM CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">
            Technical Arsenal
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mt-2 leading-relaxed">
            Technologies and architectural patterns battle-tested in high-throughput enterprise production.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {skillCategories.map((cat, i) => {
            const Icon = cat.icon;
            const isFeatured = cat.featured;
            return (
              <div
                key={i}
                className={`dev-card dev-card-highlight p-6 flex flex-col justify-between ${
                  isFeatured ? "md:col-span-2 lg:col-span-2 bg-gradient-to-br from-card/80 to-secondary/30" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded bg-secondary/80 text-muted-foreground border border-border/70">
                      {cat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground mb-2">
                    {cat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">
                    {cat.description}
                  </p>
                </div>

                {/* Skill Chips */}
                <div>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/50">
                    {cat.skills.map((skill, j) => (
                      <span
                        key={j}
                        className="px-2.5 py-1 text-xs font-mono rounded-md bg-secondary/70 border border-border/70 text-foreground/90 hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {isFeatured && (
                    <div className="mt-4 p-3 rounded-lg border border-primary/20 bg-primary/5 flex items-center gap-2.5 text-xs font-mono text-primary/90">
                      <Terminal className="w-4 h-4 shrink-0 text-primary" />
                      <span>Specialization: WebFlux + Kafka pipelines handling 50,000+ concurrent requests.</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Certifications Card in the Bento Grid */}
          <div className="dev-card dev-card-highlight p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded bg-secondary/80 text-muted-foreground border border-border/70">
                  VERIFIED
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground mb-2">
                Certifications
              </h3>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                Formal credentials and continuous engineering mastery.
              </p>
            </div>

            <ul className="space-y-2 pt-3 border-t border-border/50">
              {certifications.map((cert, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
