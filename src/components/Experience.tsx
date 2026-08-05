import { Badge } from "@/components/ui/badge";

const experiences = [
  {
    title: "Senior Backend Engineer",
    company: "Jio Platforms Ltd",
    period: "Apr 2022 – Present",
    location: "Bengaluru, India",
    achievements: [
      "Designed scalable batch processing for user group management using Spring Batch with optimized partitioning — 3× speed-up, supports 10× larger datasets.",
      "Led architecture for converting monolithic promotion/coupon system into a generic multi-tenant microservice, enabling integration across all Jio B2B verticals.",
      "Built distributed order management with Spring WebFlux and Project Reactor — 50,000+ concurrent requests, 40% response time reduction, 5× throughput.",
      "Developed multithreaded enterprise migration utility integrating SIP, HSS, BTAS, ESBC — reduced manual processing from 2 hours to 15 minutes per 1,000-number batch (85% efficiency gain).",
      "Established code review processes and mentored 4 junior engineers — 60% improvement in code quality metrics, 45% reduction in production incidents.",
    ],
    skills: ["Spring Batch", "Spring WebFlux", "Project Reactor", "Microservices", "System Architecture", "Technical Leadership"],
  },
  {
    title: "Software Engineer",
    company: "Jio Platforms Ltd",
    period: "Jul 2019 – Apr 2022",
    location: "Bengaluru, India",
    achievements: [
      "Designed REST APIs for Jio Prime Merchant (B2B JioMart) handling 100,000+ daily transactions with comprehensive unit and component testing.",
      "Refactored legacy monolith to clean microservices architecture — 80% test coverage, 0 code smells, 50% faster development velocity.",
      "Architected zero-downtime CI/CD pipelines on Azure DevOps with blue-green deployment — 70% faster deploys, 99.9% uptime.",
      "Integrated Liquibase-based schema management for distributed DB environments with reliable rollback mechanisms.",
      "Mentored 6+ new recruits on clean code principles, agile practices, and legacy system modernization strategies.",
    ],
    skills: ["REST APIs", "Microservices", "Azure DevOps", "Liquibase", "TDD", "Legacy Modernization"],
  },
  {
    title: "Teaching Assistant",
    company: "IIT Kharagpur",
    period: "Jul 2017 – Apr 2019",
    location: "Kharagpur, India",
    achievements: [
      "Assisted in Programming and Data Structures Lab (CS11002) and Theory of Computations (CS41001).",
      "Conducted lab sessions and guided students through algorithmic problem-solving and computer science fundamentals.",
    ],
    skills: ["Data Structures", "Algorithms", "Theory of Computation", "Mentoring"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Work Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Six years at Jio Platforms building batch pipelines, reactive services, and multi-tenant APIs with measurable outcomes.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-0 md:left-[180px] top-2 bottom-2 w-px bg-border hidden md:block" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <TimelineEntry key={index} exp={exp} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineEntry({ exp }: { exp: (typeof experiences)[0] }) {
  return (
    <div className="md:grid md:grid-cols-[180px_1fr] gap-8">
      <div className="hidden md:flex flex-col items-end pr-8 pt-1 relative">
        <span className="text-sm font-medium text-muted-foreground text-right leading-tight">
          {exp.period}
        </span>
        {/* Full opacity: muted-foreground at /60 measured 3.40:1 on the dark
            background and failed WCAG AA. At full strength it is 7.77:1. */}
        <span className="text-xs text-muted-foreground text-right mt-1">{exp.location}</span>
        <div className="absolute -right-[4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
      </div>

      <div className="rounded-lg border border-border bg-secondary/15 p-6 md:p-8">
        <div className="md:hidden mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
          <span className="text-xs text-muted-foreground">
            {exp.period} · {exp.location}
          </span>
        </div>

        <div className="mb-5">
          <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-1">
            {exp.title}
          </h3>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {exp.company}
          </p>
        </div>

        <ul className="space-y-3 mb-6">
          {exp.achievements.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
              <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {exp.skills.map((skill, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="px-2.5 py-0.5 text-xs rounded-md bg-primary/10 text-primary border-primary/20"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
