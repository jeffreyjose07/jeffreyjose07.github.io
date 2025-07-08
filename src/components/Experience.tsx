import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      title: "Senior Software Engineer",
      company: "Jio Platforms Limited (JPL)",
      period: "Apr 2022 – Present",
      location: "India",
      achievements: [
        "Upgraded Batch Jobs for user group management using Spring Batch, achieving 3x speed-up in program execution and enabling the service to handle larger data-sets more robustly.",
        "Converted existing promotion/coupon management system in Ajio B2B to a generic multi-tenant service for all Jio-related B2B verticals."
      ],
      skills: ["Spring Batch", "Java", "System Architecture", "Multi-tenant Services"]
    },
    {
      title: "Software Engineer",
      company: "Jio Platforms Limited (JPL)",
      period: "Jul 2019 – Mar 2022",
      location: "India",
      achievements: [
        "Delivered unit-tested backend APIs for Jio Prime Merchant (B2B side of JioMart) and collaborated with testing teams to set up component tests for functionality, scalability, and performance.",
        "Refactored and modularized legacy codebase to improve code quality and enhance product development.",
        "Partnered with infrastructure team to configure zero downtime deployments, significantly reducing product downtime."
      ],
      skills: ["Backend APIs", "Testing", "DevOps", "Code Refactoring"]
    },
    {
      title: "Teaching Assistant",
      company: "Indian Institute of Technology, Kharagpur",
      period: "Jul 2017 – Apr 2019",
      location: "Kharagpur, India",
      achievements: [
        "Assisted in Programming and Data Structures Lab (CS11002)",
        "Assisted in Theory of Computations (CS41001)"
      ],
      skills: ["Teaching", "Data Structures", "Algorithms", "Theory of Computation"]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Building scalable solutions and driving innovation in software engineering
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {experiences.map((exp, index) => (
            <Card 
              key={index} 
              className="bg-gradient-card shadow-elegant hover:shadow-glow transition-all duration-300 border-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl md:text-2xl text-primary mb-2">
                      {exp.title}
                    </CardTitle>
                    <h3 className="text-lg font-semibold text-foreground">
                      {exp.company}
                    </h3>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {exp.period}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {exp.location}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="text-muted-foreground leading-relaxed">
                      • {achievement}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary" 
                      className="bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;