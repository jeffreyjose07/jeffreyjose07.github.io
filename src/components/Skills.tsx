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
  return (
    <section id="skills" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Skills & Expertise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Distributed systems and performance engineering — tools I use to keep services correct under load.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">
            Signature Expertise
          </p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 border-t border-border pt-6">
            {expertSkills.map((skill, i) => (
              <div
                key={i}
                className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-3"
              >
                <dt className="font-heading font-semibold text-foreground">{skill.name}</dt>
                <dd className="text-[11px] uppercase tracking-wider text-muted-foreground shrink-0">
                  {skill.tag}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="max-w-5xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
            Full Toolkit
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((cat, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
                  {cat.title}
                </h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {cat.skills.map((skill, j) => (
                    <li key={j}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
            Certifications
          </p>
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 text-sm text-muted-foreground">
            {certifications.map((cert, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                {cert}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
