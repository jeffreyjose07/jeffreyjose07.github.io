import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Server, Layers } from "lucide-react";

const Skills = () => {
  const skillCategories = [
    {
      title: "Programming Languages",
      icon: Code,
      skills: ["Java", "SQL", "Functional Programming", "Object-Oriented Design"],
      color: "text-purple-500"
    },
    {
      title: "Backend Development",
      icon: Server,
      skills: ["Spring", "Spring Boot", "Spring Batch", "Spring WebFlux", "Project Reactor", "Hibernate", "RESTful APIs"],
      color: "text-blue-500"
    },
    {
      title: "Database & Storage",
      icon: Database,
      skills: ["MongoDB", "PostgreSQL", "Redis", "Elasticsearch", "Database Design", "Performance Optimization", "Data Processing"],
      color: "text-orange-500"
    },
    {
      title: "System Architecture",
      icon: Layers,
      skills: ["Microservices", "Apache Kafka", "Event-Driven Systems", "Multi-tenant Services", "Scalable Systems", "Legacy Modernization", "Distributed Architecture"],
      color: "text-green-500"
    },
    {
      title: "DevOps & Cloud",
      icon: Server,
      skills: ["Kubernetes", "GCP", "Azure DevOps", "CI/CD Pipelines", "Docker", "Zero-downtime Deployments"],
      color: "text-cyan-500"
    },
    {
      title: "Testing & Quality",
      icon: Code,
      skills: ["JUnit-Mockito", "Test-Driven Development", "Code Review Processes", "Unit Testing", "Component Testing"],
      color: "text-indigo-500"
    }
  ];

  const certifications = [
    "Functional Programming with Java",
    "Java (Basic) Certificate",
    "Introduction to Generative AI",
    "Spring Code Challenges",
    "Spring: Spring Batch"
  ];

  return (
    <section id="skills" className="py-24 bg-white dark:bg-gray-900 relative">
      {/* Clean geometric background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-100/40 to-transparent dark:from-violet-900/20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-100/40 to-transparent dark:from-blue-900/20"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Skills & Expertise
          </h2>
          <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Expertise in distributed systems, microservices architecture, and performance engineering with proven track record in technical leadership
          </p>
        </div>

        {/* Core Competencies Section */}
        <div className="max-w-6xl mx-auto mb-16 slide-up">
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-violet-50/50 dark:from-blue-950/20 dark:to-violet-950/20 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
            <CardHeader className="relative z-10 text-center">
              <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Core Competencies
              </CardTitle>
              <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto"></div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center group/comp">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover/comp:text-blue-600 dark:group-hover/comp:text-blue-400 transition-colors duration-300">Technical Leadership</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">System design, distributed architecture, cross-functional team collaboration, technical mentoring</p>
                </div>
                <div className="text-center group/comp">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover/comp:text-blue-600 dark:group-hover/comp:text-blue-400 transition-colors duration-300">System Architecture</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Microservices design, scalable backend systems, reactive programming, event-driven architecture</p>
                </div>
                <div className="text-center group/comp">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover/comp:text-blue-600 dark:group-hover/comp:text-blue-400 transition-colors duration-300">Performance Engineering</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Database optimization, caching strategies, load balancing, concurrent processing</p>
                </div>
                <div className="text-center group/comp">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover/comp:text-blue-600 dark:group-hover/comp:text-blue-400 transition-colors duration-300">DevOps & Reliability</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">CI/CD pipelines, zero-downtime deployments, monitoring, incident response, SLA management</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
          {skillCategories.map((category, index) => (
            <Card 
              key={index} 
              className="group bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 slide-up border-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-violet-50/30 dark:from-blue-950/10 dark:to-violet-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-4 text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-all duration-300">
                      <category.icon className={`h-6 w-6 ${category.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, i) => (
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

        {/* Enhanced Certifications Section */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 max-w-6xl mx-auto slide-up border-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-violet-50/30 dark:from-blue-950/10 dark:to-violet-950/10 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
          <CardHeader className="relative z-10 text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Certifications
            </CardTitle>
            <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto"></div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="group/cert relative p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:scale-105"
                >
                  <span className="relative z-10 text-sm font-medium text-gray-800 dark:text-gray-200 group-hover/cert:text-blue-600 dark:group-hover/cert:text-blue-400 transition-colors duration-300">
                    {cert}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Skills;