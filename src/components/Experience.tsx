import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      title: "Senior Software Engineer",
      company: "Jio Platforms Ltd",
      period: "Apr 2022 – Present",
      location: "Bengaluru, Karnataka",
      achievements: [
        "Designed and architected scalable batch processing system for user group management using Spring Batch with optimized data partitioning, achieving 3x speed-up in program execution and enabling the service to handle 10x larger datasets while maintaining system reliability and performance.",
        "Led system design and architecture for converting monolithic promotion/coupon management system into a generic multi-tenant microservice, enabling seamless integration across all Jio B2B verticals and supporting distributed deployment patterns.",
        "Designed and implemented distributed order management system architecture in collaboration with central platform team and Fynd, utilizing reactive programming with Spring WebFlux and Project Reactor to handle 50,000+ concurrent requests, achieving 40% reduction in response time and supporting 5x higher throughput.",
        "Architected and developed multithreaded enterprise migration utility with distributed system design, integrating multiple telecommunication systems (SIP, HSS, BTAS, and ESBC) to automate mobility-to-enterprise number migration, reducing manual processing time from 2 hours to 15 minutes per 1000-number batch and improving business processing efficiency by 85%.",
        "Established technical leadership practices including code review processes, system design documentation, and mentored team of 4 junior developers, improving code quality metrics by 60% and reducing production incidents by 45%."
      ],
      skills: ["Spring Batch", "Spring WebFlux", "Project Reactor", "Microservices", "System Architecture", "Technical Leadership", "Performance Optimization"]
    },
    {
      title: "Software Engineer",
      company: "Jio Platforms Ltd",
      period: "Jul 2019 – Apr 2022",
      location: "Bengaluru, Karnataka",
      achievements: [
        "Designed and delivered scalable REST APIs for Jio Prime Merchant (B2B side of JioMart) handling 100,000+ daily transactions, implementing comprehensive unit and component testing strategies to meet business requirements for functionality, scalability and performance optimization.",
        "Led technical modernization through systematic revision, modularization, and refactoring of legacy monolithic codebase into clean, maintainable microservices architecture with 80% test coverage and zero code smells, significantly enhancing product development velocity by 50% and code quality.",
        "Collaborated with infrastructure team to architect and configure zero-downtime CI/CD deployment pipelines using Azure DevOps, implementing blue-green deployment strategies that improved deployment speed by 70% and system stability with 99.9% uptime.",
        "Designed and integrated Liquibase-based database schema management system for distributed environments, ensuring consistency across multiple database instances and enabling reliable rollback mechanisms with automated migration scripts.",
        "Provided technical leadership through mentoring 6+ new recruits with structured sessions on clean code principles, legacy system refactoring strategies, and agile development best practices."
      ],
      skills: ["REST APIs", "Microservices", "Azure DevOps", "Liquibase", "Testing", "Technical Mentoring", "Legacy Modernization"]
    },
    {
      title: "Teaching Assistant",
      company: "Indian Institute of Technology, Kharagpur",
      period: "Jul 2017 – Apr 2019",
      location: "Kharagpur, India",
      achievements: [
        "Assisted in Programming and Data Structures Lab (CS11002)",
        "Assisted in Theory of Computations (CS41001)",
        "Mentored students in fundamental computer science concepts and programming techniques",
        "Conducted lab sessions and provided guidance on algorithmic problem-solving"
      ],
      skills: ["Teaching", "Data Structures", "Algorithms", "Theory of Computation", "Mentoring", "Academic Leadership"]
    }
  ];

  return (
    <section id="experience" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary-glow rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 slide-up">
          <div className="inline-block">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-gradient">
              Experience
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto mb-6"></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Building scalable solutions and driving innovation in software engineering across diverse domains
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-12">
          {experiences.map((exp, index) => (
            <Card 
              key={index} 
              className="perspective-card group bg-gradient-card shadow-elegant hover:shadow-glow transition-all duration-500 border border-border/50 hover:border-primary/20 slide-up overflow-hidden"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="card-inner relative">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                
                <CardHeader className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="relative">
                        <CardTitle className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                          {exp.title}
                        </CardTitle>
                        <div className="absolute -left-4 top-0 w-1 h-8 bg-gradient-to-b from-primary to-primary-glow rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground/80 mb-2">
                        {exp.company}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-3 text-sm text-muted-foreground lg:text-right">
                      <div className="flex items-center gap-2 lg:justify-end">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-2 lg:justify-end">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">{exp.location}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-4 mb-8">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-muted-foreground leading-relaxed text-lg flex items-start gap-3 group/item">
                        <div className="w-2 h-2 rounded-full bg-primary/60 mt-2 flex-shrink-0 group-hover/item:bg-primary transition-colors duration-300"></div>
                        <span className="group-hover/item:text-foreground transition-colors duration-300">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    {exp.skills.map((skill, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="px-4 py-2 bg-accent/50 text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium border border-border/30 hover:border-primary/50 hover:scale-105"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;