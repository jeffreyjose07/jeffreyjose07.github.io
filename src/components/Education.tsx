import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Calendar, MapPin } from "lucide-react";

const Education = () => {
  const education = [
    {
      degree: "Master of Technology (M.Tech.)",
      field: "Computer Science",
      institution: "Indian Institute of Technology, Kharagpur",
      period: "2017 – 2019",
      location: "Kharagpur, India"
    },
    {
      degree: "Bachelor of Technology (B.Tech.)",
      field: "Computer Science and Engineering",
      institution: "Government College Of Engineering Kannur",
      period: "2012 – 2016",
      location: "Kannur, India"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Education
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Strong academic foundation in computer science and engineering
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {education.map((edu, index) => (
            <Card 
              key={index} 
              className="bg-gradient-card shadow-elegant hover:shadow-glow transition-all duration-300 border-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl md:text-2xl text-primary mb-2">
                        {edu.degree}
                      </CardTitle>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {edu.field}
                      </h3>
                      <p className="text-muted-foreground font-medium">
                        {edu.institution}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {edu.period}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {edu.location}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Academic Highlights */}
        <Card className="bg-gradient-card shadow-elegant max-w-4xl mx-auto mt-12 animate-fade-in">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary mb-4">
                Academic Achievements
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Graduated from premier institutions in India with strong foundation in computer science, 
                algorithms, and software engineering principles. Served as Teaching Assistant during 
                M.Tech., mentoring students in Programming, Data Structures, and Theory of Computations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Education;