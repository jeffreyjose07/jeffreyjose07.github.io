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
    <section className="py-20 bg-gradient-accent">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Skills & Expertise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized in building robust, scalable backend systems and modern web applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {skillCategories.map((category, index) => (
            <Card 
              key={index} 
              className="bg-card shadow-elegant hover:shadow-glow transition-all duration-300 border-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <category.icon className={`h-6 w-6 ${category.color}`} />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certifications Section */}
        <Card className="bg-card shadow-elegant max-w-4xl mx-auto animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {certifications.map((cert, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="justify-center p-3 text-sm bg-gradient-card hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  {cert}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Skills;