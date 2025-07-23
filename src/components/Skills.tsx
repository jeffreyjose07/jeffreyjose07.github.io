import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Server, Layers } from "lucide-react";

const Skills = () => {
  const skillCategories = [
    {
      title: "Backend Development",
      icon: Server,
      skills: ["Java", "Spring Boot", "Spring Batch", "RESTful APIs", "Microservices"],
      color: "text-blue-500"
    },
    {
      title: "System Architecture",
      icon: Layers,
      skills: ["Multi-tenant Services", "Scalable Systems", "Legacy Modernization", "DevOps"],
      color: "text-green-500"
    },
    {
      title: "Programming Languages",
      icon: Code,
      skills: ["Java", "Spring Framework", "Functional Programming", "Object-Oriented Design"],
      color: "text-purple-500"
    },
    {
      title: "Database & Tools",
      icon: Database,
      skills: ["SQL", "Database Design", "Performance Optimization", "Data Processing"],
      color: "text-orange-500"
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
    <section id="skills" className="py-24 bg-gradient-accent relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-primary rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-primary-glow rounded-full blur-3xl floating-delayed"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 slide-up">
          <div className="inline-block">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-gradient">
              Skills & Expertise
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto mb-6"></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Specialized in building robust, scalable backend systems and modern web applications with cutting-edge technologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-7xl mx-auto mb-20">
          {skillCategories.map((category, index) => (
            <Card 
              key={index} 
              className="perspective-card group bg-card/80 backdrop-blur-sm shadow-elegant hover:shadow-glow transition-all duration-500 border border-border/50 hover:border-primary/30 slide-up glow-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-inner relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-4 text-2xl group-hover:text-primary transition-colors duration-300">
                    <div className="p-3 rounded-full bg-gradient-to-br from-primary/10 to-primary-glow/10 group-hover:from-primary/20 group-hover:to-primary-glow/20 transition-all duration-300">
                      <category.icon className={`h-7 w-7 ${category.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex flex-wrap gap-3">
                    {category.skills.map((skill, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium border-border/50 hover:border-primary hover:scale-105 hover:shadow-lg"
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
        <Card className="bg-card/80 backdrop-blur-sm shadow-elegant max-w-6xl mx-auto slide-up border border-border/50 glow-hover group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
          <CardHeader className="relative z-10 text-center">
            <div className="inline-block">
              <CardTitle className="text-3xl md:text-4xl font-bold text-gradient mb-4">
                Certifications
              </CardTitle>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto"></div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="group/cert relative p-4 rounded-lg bg-gradient-to-r from-accent/30 to-accent/50 hover:from-primary/20 hover:to-primary-glow/20 transition-all duration-300 border border-border/30 hover:border-primary/50 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-shimmer opacity-0 group-hover/cert:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                  <span className="relative z-10 text-sm font-medium text-foreground group-hover/cert:text-primary transition-colors duration-300">
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