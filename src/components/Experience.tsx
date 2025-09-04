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
    <section id="experience" className="py-24 bg-gray-50 dark:bg-gray-900 relative">
      {/* Clean geometric background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-100/40 to-transparent dark:from-green-900/20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-100/40 to-transparent dark:from-blue-900/20"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Experience
          </h2>
          <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Building scalable solutions and driving innovation in software engineering across diverse domains
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {experiences.map((exp, index) => (
            <Card 
              key={index} 
              className="group bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 slide-up border-0"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-blue-50/30 dark:from-green-950/10 dark:to-blue-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                
                <CardHeader className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <CardTitle className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {exp.title}
                      </CardTitle>
                      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {exp.company}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400 lg:text-right">
                      <div className="flex items-center gap-2 lg:justify-end">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium">{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-2 lg:justify-end">
                        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium">{exp.location}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-4 mb-8">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed flex items-start gap-3 group/item">
                        <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0 group-hover/item:bg-blue-600 transition-colors duration-300"></div>
                        <span className="group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors duration-300">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 font-medium border-0 hover:scale-105"
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