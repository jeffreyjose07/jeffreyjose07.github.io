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
    <section id="education" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Education</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            M.Tech. from IIT Kharagpur and GATE AIR 170 — algorithms, systems, and SAR research.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6 mb-14">
          {education.map((edu, index) => (
            <article
              key={index}
              className="rounded-lg border border-border bg-secondary/15 p-6 md:p-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-md bg-primary/10 text-primary shrink-0">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-heading font-bold text-foreground">
                      {edu.degree}
                    </h3>
                    <p className="text-lg font-medium text-foreground/90">{edu.field}</p>
                    <p className="text-muted-foreground font-medium">{edu.institution}</p>
                    {edu.thesis && (
                      <div className="mt-3 space-y-1.5 text-sm">
                        <p className="font-semibold text-foreground">M.Tech Thesis</p>
                        <p className="text-muted-foreground italic">{edu.thesis}</p>
                        <p className="text-xs text-muted-foreground">Guided by: {edu.advisor}</p>
                        <p className="text-muted-foreground">{edu.description}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground lg:text-right shrink-0">
                  <div className="flex items-center gap-2 lg:justify-end">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{edu.period}</span>
                  </div>
                  <div className="flex items-center gap-2 lg:justify-end">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{edu.location}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="max-w-5xl mx-auto rounded-lg border border-border bg-secondary/15 p-6 md:p-8">
          <h3 className="text-xl font-heading font-bold mb-2">Key Achievements</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-3xl">
            Teaching Assistant during M.Tech., mentoring students in Programming, Data Structures,
            and Theory of Computations.
          </p>
          <dl className="grid sm:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="border-t border-border pt-4">
                <dt className="font-heading font-semibold text-foreground mb-1">
                  {achievement.title}
                </dt>
                <dd className="text-sm text-muted-foreground">{achievement.subtitle}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default Education;
