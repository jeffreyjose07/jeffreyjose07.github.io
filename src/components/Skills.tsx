import { useInView } from "@/hooks/use-in-view";

const expertSkills = [
  { name: "Spring Boot & WebFlux", tag: "Core" },
  { name: "Apache Kafka", tag: "Messaging" },
  { name: "Microservices Architecture", tag: "Design" },
  { name: "Kubernetes & GCP", tag: "Cloud" },
  { name: "PostgreSQL & MongoDB", tag: "Data" },
  { name: "Reactive Programming", tag: "Pattern" },
];

const skillCategories = [
  {
    title: "Languages & Frameworks",
    skills: ["Java", "SQL", "Spring Batch", "Hibernate", "Project Reactor", "RESTful APIs"],
  },
  {
    title: "Data & Storage",
    skills: ["Redis", "Elasticsearch", "Database Design", "Data Processing", "Performance Optimization"],
  },
  {
    title: "DevOps & Reliability",
    skills: ["Docker", "Azure DevOps", "CI/CD Pipelines", "Zero-downtime Deployments", "Blue-green Deployments"],
  },
  {
    title: "Architecture & Design",
    skills: ["Event-Driven Systems", "Multi-tenant Services", "Scalable Systems", "Legacy Modernization", "Distributed Systems"],
  },
  {
    title: "Quality & Leadership",
    skills: ["JUnit & Mockito", "TDD", "Code Review", "Technical Mentoring", "System Design Docs"],
  },
];

const certifications = [
  "Functional Programming with Java",
  "Java (Basic) Certificate",
  "Introduction to Generative AI",
  "Spring Code Challenges",
  "Spring: Spring Batch",
];

export default function Skills() {
  const { ref: headingRef, isInView: headingVisible } = useInView();
  const { ref: expertRef, isInView: expertVisible } = useInView();
  const { ref: categoryRef, isInView: categoryVisible } = useInView();
  const { ref: certRef, isInView: certVisible } = useInView();

  return (
    <section id="skills" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6">
        {/* Heading */}
        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${
            headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Skills & <span className="text-gradient-premium">Expertise</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-cyan-400 rounded-full mx-auto mb-8" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Deep expertise in distributed systems and performance engineering, with a focus on systems that scale.
          </p>
        </div>

        {/* Expert / Signature Skills */}
        <div
          ref={expertRef as React.RefObject<HTMLDivElement>}
          className={`max-w-5xl mx-auto mb-16 transition-all duration-700 delay-100 ${
            expertVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-6 text-center">
            Signature Expertise
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {expertSkills.map((skill, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl px-5 py-4 flex items-center justify-between group hover:border-primary/40 transition-all duration-300"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="font-heading font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors duration-300">
                  {skill.name}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70 border border-primary/20 rounded-full px-2 py-0.5 ml-2 flex-shrink-0">
                  {skill.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Categories */}
        <div
          ref={categoryRef as React.RefObject<HTMLDivElement>}
          className={`max-w-5xl mx-auto mb-16 transition-all duration-700 delay-150 ${
            categoryVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6 text-center">
            Full Toolkit
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((cat, i) => (
              <div key={i} className="glass-card rounded-2xl p-5">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
                  {cat.title}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, j) => (
                    <span
                      key={j}
                      className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div
          ref={certRef as React.RefObject<HTMLDivElement>}
          className={`max-w-5xl mx-auto transition-all duration-700 delay-200 ${
            certVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6 text-center">
            Certifications
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <div
                key={i}
                className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 group hover:border-primary/30 transition-all duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {cert}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
