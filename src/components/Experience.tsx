import { Briefcase, Building2 } from "lucide-react";

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  location: string;
  metrics?: string[];
  achievements: string[];
  skills: string[];
}

const experiences: ExperienceItem[] = [
  {
    title: "Senior Backend Engineer",
    company: "Jio Platforms Ltd",
    period: "Apr 2022 – Present",
    location: "Bengaluru, India",
    metrics: ["3× Batch Speed-up", "50k+ Concurrent Reqs", "85% Manual Reduction", "45% Incident Drop"],
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
    metrics: ["100k+ Daily Txns", "80% Test Coverage", "99.9% Uptime", "70% Faster Deploys"],
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
    metrics: ["CS11002 Lab", "CS41001 Theory"],
    achievements: [
      "Assisted in Programming and Data Structures Lab (CS11002) and Theory of Computations (CS41001).",
      "Conducted lab sessions and guided students through algorithmic problem-solving and computer science fundamentals.",
    ],
    skills: ["Data Structures", "Algorithms", "Theory of Computation", "Mentoring"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 bg-background relative border-t border-border/50">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-primary mb-3">
            // 02. WORK EXPERIENCE
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">
            Work Experience
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mt-2 leading-relaxed">
            Six years at Jio Platforms building batch pipelines, reactive services, and multi-tenant APIs with measurable outcomes.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Continuous vertical gradient line on desktop */}
          <div className="absolute left-0 md:left-[190px] top-3 bottom-6 w-px bg-gradient-to-b from-primary via-primary/40 to-border/40 hidden md:block" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <TimelineEntry key={index} exp={exp} isLatest={index === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineEntry({ exp, isLatest }: { exp: ExperienceItem; isLatest: boolean }) {
  return (
    <div className="md:grid md:grid-cols-[190px_1fr] gap-8 relative">
      {/* Desktop timeline label & node */}
      <div className="hidden md:flex flex-col items-end pr-8 pt-1 relative">
        <span className="text-xs font-mono font-medium text-foreground text-right leading-tight">
          {exp.period}
        </span>
        <span className="text-xs text-muted-foreground text-right mt-1">{exp.location}</span>
        <div
          className={`absolute -right-[6px] top-2 w-3 h-3 rounded-full ring-4 ring-background transition-all ${
            isLatest
              ? "bg-primary shadow-[0_0_12px_rgba(20,184,166,0.6)]"
              : "bg-muted-foreground/60"
          }`}
        />
      </div>

      {/* Main card */}
      <div className="dev-card dev-card-highlight p-6 md:p-8 relative">
        {/* Mobile period & location tag */}
        <div className="md:hidden mb-4 flex items-center justify-between gap-2 border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLatest ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
            <span className="text-xs font-mono font-medium text-foreground">
              {exp.period}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{exp.location}</span>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
              {exp.title}
            </h3>
            {isLatest && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-primary/10 text-primary border border-primary/25">
                Current Role
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span>{exp.company}</span>
          </div>
        </div>

        {/* Standout metrics strip */}
        {exp.metrics && exp.metrics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5 pb-4 border-b border-border/50">
            {exp.metrics.map((metric, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {metric}
              </span>
            ))}
          </div>
        )}

        {/* Detailed achievements */}
        <ul className="space-y-2.5 mb-6">
          {exp.achievements.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/80 mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Technology tags */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/40">
          {exp.skills.map((skill, i) => (
            <span
              key={i}
              className="px-2.5 py-1 text-xs font-mono rounded-md bg-secondary/60 border border-border/70 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
