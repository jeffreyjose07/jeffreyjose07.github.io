import { GraduationCap, Calendar, MapPin, Trophy, BookOpen } from "lucide-react";

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
      description:
        "Cluster hybrid polarized SAR image in an unsupervised way into physically meaningful classes.",
    },
    {
      degree: "Bachelor of Technology (B.Tech.)",
      field: "Computer Science & Engineering",
      institution: "Government College Of Engineering Kannur",
      period: "Jun 2012 – May 2016",
      location: "Kannur, India",
    },
  ];

  const achievements = [
    { title: "IIT Kharagpur", subtitle: "M.Tech. Computer Science" },
    { title: "GATE 2017", subtitle: "All India Rank 170 among 200,000+ candidates" },
    { title: "Teaching Assistant", subtitle: "2+ years at IIT Kharagpur" },
  ];

  return (
    <section id="education" className="py-24 px-4 sm:px-6 bg-background relative border-t border-border/50">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-14">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-primary mb-3">
            // 05. EDUCATION
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">
            Education
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mt-2 leading-relaxed">
            M.Tech. from IIT Kharagpur and GATE AIR 170 — algorithms, systems, and SAR research.
          </p>
        </div>

        {/* Premier Achievement Callout */}
        <div className="dev-card dev-card-highlight p-5 sm:p-6 mb-8 bg-gradient-to-r from-primary/10 via-card/60 to-secondary/40 border-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary/15 text-primary border border-primary/25 shrink-0">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">
                  GATE 2017 Computer Science
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary text-primary-foreground">
                  AIR 170
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                All India Rank 170 among 200,000+ candidates
              </p>
            </div>
          </div>
          <div className="text-xs font-mono text-primary font-semibold px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 shrink-0">
            Top 0.08%
          </div>
        </div>

        {/* Education Timeline Cards */}
        <div className="space-y-6 mb-12">
          {education.map((edu, index) => (
            <article
              key={index}
              className="dev-card dev-card-highlight p-6 sm:p-8 relative"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                      {edu.degree}
                    </h3>
                    <p className="text-base font-semibold text-primary">{edu.field}</p>
                    <p className="text-muted-foreground font-medium text-sm">{edu.institution}</p>

                    {edu.thesis && (
                      <div className="mt-4 p-4 rounded-lg bg-secondary/40 border border-border/60 text-xs sm:text-sm space-y-1.5">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground">
                          <BookOpen className="w-3.5 h-3.5 text-primary" />
                          <span>M.Tech Thesis</span>
                        </div>
                        <p className="text-muted-foreground italic font-medium">"{edu.thesis}"</p>
                        <p className="text-[11px] font-mono text-muted-foreground">Guided by: {edu.advisor}</p>
                        <p className="text-muted-foreground text-xs leading-relaxed pt-1">{edu.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-xs font-mono text-muted-foreground lg:text-right shrink-0">
                  <div className="flex items-center gap-1.5 lg:justify-end">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>{edu.period}</span>
                  </div>
                  <div className="flex items-center gap-1.5 lg:justify-end">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{edu.location}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Key Achievements Summary */}
        <div className="dev-card p-6 md:p-8">
          <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground mb-2">
            Key Achievements
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-6 max-w-3xl">
            Teaching Assistant during M.Tech., mentoring students in Programming, Data Structures,
            and Theory of Computations.
          </p>
          <dl className="grid sm:grid-cols-3 gap-5">
            {achievements.map((achievement, index) => (
              <div key={index} className="border-t border-border/60 pt-4">
                <dt className="font-heading font-semibold text-foreground text-sm mb-1">
                  {achievement.title}
                </dt>
                <dd className="text-xs font-mono text-muted-foreground">{achievement.subtitle}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default Education;
