import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Calendar, MapPin } from "lucide-react";

const Education = () => {
  const education = [
    {
      degree: "Master of Technology (M.Tech.)",
      field: "Computer Science & Engineering",
      institution: "Indian Institute of Technology, Kharagpur",
      period: "Jun 2017 – May 2019",
      location: "Kharagpur, India",
      thesis: "Unsupervised Iterative Clustering of Hybrid Polarimetric SAR Images",
      advisor: "Dr. Jayanta Mukhopadhyay (CSE Dept, IIT Kharagpur)",
      description: "Cluster hybrid polarized SAR image in an unsupervised way into physically meaningful classes."
    },
    {
      degree: "Bachelor of Technology (B.Tech.)",
      field: "Computer Science & Engineering",
      institution: "Government College Of Engineering Kannur",
      period: "Jun 2012 – May 2016",
      location: "Kannur, India"
    }
  ];

  return (
    <section id="education" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary rounded-full blur-xl floating"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-primary-glow rounded-full blur-2xl floating-delayed"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 slide-up">
          <div className="inline-block">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-gradient">
              Education
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto mb-6"></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Strong academic foundation in computer science and engineering from prestigious institutions
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-10">
          {education.map((edu, index) => (
            <Card 
              key={index} 
              className="perspective-card group bg-gradient-card shadow-elegant hover:shadow-glow transition-all duration-500 border border-border/50 hover:border-primary/20 slide-up glow-hover"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="card-inner relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                
                <CardHeader className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <div className="p-4 bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-xl group-hover:from-primary/20 group-hover:to-primary-glow/20 transition-all duration-300">
                          <GraduationCap className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-glow rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="relative">
                          <CardTitle className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                            {edu.degree}
                          </CardTitle>
                          <div className="absolute -left-4 top-0 w-1 h-8 bg-gradient-to-b from-primary to-primary-glow rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground/80 mb-2">
                          {edu.field}
                        </h3>
                        <p className="text-muted-foreground font-medium text-lg">
                          {edu.institution}
                        </p>
                        {edu.thesis && (
                          <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-semibold text-foreground/90">M.Tech Thesis:</h4>
                            <p className="text-sm text-muted-foreground italic">{edu.thesis}</p>
                            <p className="text-xs text-muted-foreground">Guided by: {edu.advisor}</p>
                            <p className="text-sm text-muted-foreground">{edu.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 text-sm text-muted-foreground lg:text-right">
                      <div className="flex items-center gap-2 lg:justify-end">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">{edu.period}</span>
                      </div>
                      <div className="flex items-center gap-2 lg:justify-end">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">{edu.location}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced Academic Highlights */}
        <Card className="bg-gradient-card shadow-elegant max-w-6xl mx-auto mt-16 slide-up border border-border/50 group glow-hover">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
          <CardContent className="p-10 relative z-10">
            <div className="text-center space-y-6">
              <div className="inline-block">
                <h3 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
                  Key Achievements
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto"></div>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg font-light max-w-4xl mx-auto">
                Graduated from premier institutions in India with a strong foundation in computer science, 
                algorithms, and software engineering principles. Served as Teaching Assistant during 
                M.Tech., mentoring students in Programming, Data Structures, and Theory of Computations.
              </p>
              
              {/* Key Achievements */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                <div className="group/item text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-full flex items-center justify-center group-hover/item:from-primary/20 group-hover/item:to-primary-glow/20 transition-all duration-300">
                    <GraduationCap className="h-8 w-8 text-primary group-hover/item:scale-110 transition-transform duration-300" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2 group-hover/item:text-primary transition-colors duration-300">IIT Kharagpur</h4>
                  <p className="text-sm text-muted-foreground">M.Tech. Computer Science</p>
                </div>
                <div className="group/item text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-full flex items-center justify-center group-hover/item:from-primary/20 group-hover/item:to-primary-glow/20 transition-all duration-300">
                    <Calendar className="h-8 w-8 text-primary group-hover/item:scale-110 transition-transform duration-300" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2 group-hover/item:text-primary transition-colors duration-300">GATE 2017</h4>
                  <p className="text-sm text-muted-foreground">All India Rank 170 among 200,000+ candidates</p>
                </div>
                <div className="group/item text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-full flex items-center justify-center group-hover/item:from-primary/20 group-hover/item:to-primary-glow/20 transition-all duration-300">
                    <MapPin className="h-8 w-8 text-primary group-hover/item:scale-110 transition-transform duration-300" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2 group-hover/item:text-primary transition-colors duration-300">Spotlight Award</h4>
                  <p className="text-sm text-muted-foreground">Q1 2022 for technical excellence in system architecture</p>
                </div>
                <div className="group/item text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-full flex items-center justify-center group-hover/item:from-primary/20 group-hover/item:to-primary-glow/20 transition-all duration-300">
                    <Calendar className="h-8 w-8 text-primary group-hover/item:scale-110 transition-transform duration-300" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2 group-hover/item:text-primary transition-colors duration-300">Teaching Assistant</h4>
                  <p className="text-sm text-muted-foreground">2+ Years Experience at IIT Kharagpur</p>
                </div>
                <div className="group/item text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-full flex items-center justify-center group-hover/item:from-primary/20 group-hover/item:to-primary-glow/20 transition-all duration-300">
                    <GraduationCap className="h-8 w-8 text-primary group-hover/item:scale-110 transition-transform duration-300" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2 group-hover/item:text-primary transition-colors duration-300">Association Secretary</h4>
                  <p className="text-sm text-muted-foreground">Coordinated Tech Fest, CSE Department 2016</p>
                </div>
                <div className="group/item text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-full flex items-center justify-center group-hover/item:from-primary/20 group-hover/item:to-primary-glow/20 transition-all duration-300">
                    <MapPin className="h-8 w-8 text-primary group-hover/item:scale-110 transition-transform duration-300" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2 group-hover/item:text-primary transition-colors duration-300">50,000+ Requests</h4>
                  <p className="text-sm text-muted-foreground">Distributed systems with 99.9% uptime</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Education;