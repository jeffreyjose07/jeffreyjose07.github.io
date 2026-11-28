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
    title: "Languages & Frameworks",
    tag: "CORE",
    icon: Cpu,
    description: "Java, Spring Boot, and reactive services built to stay predictable under load.",
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
    title: "Data & Storage",
    tag: "DATA",
    icon: Database,
    description: "Relational, document, and in-memory stores tuned for throughput and safe schema migrations.",
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
    title: "DevOps & Reliability",
    tag: "INFRA",
    icon: Server,
    description: "Containers, CI/CD pipelines, and blue-green releases for zero-downtime deploys.",
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
    title: "Architecture & Design",
    tag: "DESIGN",
    icon: Network,
    description: "Event-driven services, multi-tenant APIs, and breaking legacy monoliths into smaller services.",
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
    title: "Quality & Leadership",
    tag: "PRACTICE",
    icon: ShieldCheck,
    description: "Unit and component testing, code reviews, system design docs, and mentoring engineers.",
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
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-14">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-primary mb-3">
            // 03. SKILLS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">
            Skills & Expertise
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mt-2 leading-relaxed">
            Distributed systems and performance engineering — tools I use to keep services correct under load.
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
                      <span>WebFlux + Kafka pipelines handling 50,000+ concurrent requests.</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Certifications Card in the Bento Grid */}
          <div className="dev-card dev-card-highlight p-6 md:col-span-2 lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                    Certifications
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Courses and certificates in Java, Spring, and backend fundamentals.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded bg-secondary/80 text-muted-foreground border border-border/70 self-start sm:self-center shrink-0">
                COURSES
              </span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5 pt-4 border-t border-border/50">
              {certifications.map((cert, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-mono text-muted-foreground min-w-0">
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
