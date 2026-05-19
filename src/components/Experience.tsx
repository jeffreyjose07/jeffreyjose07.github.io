import { Badge } from "@/components/ui/badge";
import { useInView } from "@/hooks/use-in-view";

const experiences = [
  {
    title: "Senior Software Engineer",
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
  const { ref: headingRef, isInView: headingVisible } = useInView();

  return (
    <section id="experience" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6">
        {/* Heading */}
        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-20 transition-all duration-700 ${
            headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Work <span className="text-gradient-premium">Experience</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-cyan-400 rounded-full mx-auto mb-8" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Building scalable systems and driving technical excellence across 6+ years at Jio Platforms.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical connector line */}
          <div className="absolute left-0 md:left-[180px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent hidden md:block" />

          <div className="space-y-16">
            {experiences.map((exp, index) => (
              <TimelineEntry key={index} exp={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineEntry({ exp, index }: { exp: typeof experiences[0]; index: number }) {
  const { ref, isInView } = useInView(0.1);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`md:grid md:grid-cols-[180px_1fr] gap-8 transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Date column (desktop) */}
      <div className="hidden md:flex flex-col items-end pr-8 pt-1 relative">
        <span className="text-sm font-medium text-muted-foreground text-right leading-tight">
          {exp.period}
        </span>
        <span className="text-xs text-muted-foreground/60 text-right mt-1">{exp.location}</span>
        {/* Timeline dot */}
        <div className="absolute -right-[4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
      </div>

      {/* Content */}
      <div className="glass-card rounded-2xl p-6 md:p-8 group hover:border-primary/30 transition-all duration-300">
        {/* Mobile date */}
        <div className="md:hidden mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
          <span className="text-xs text-muted-foreground">{exp.period} · {exp.location}</span>
        </div>

        <div className="mb-5">
          <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
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
              className="px-3 py-1 text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-200"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
