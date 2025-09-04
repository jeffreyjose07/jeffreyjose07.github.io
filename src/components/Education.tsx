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

  const achievements = [
    { title: "IIT Kharagpur", subtitle: "M.Tech. Computer Science", icon: GraduationCap },
    { title: "GATE 2017", subtitle: "All India Rank 170 among 200,000+ candidates", icon: Calendar },
    { title: "Teaching Assistant", subtitle: "2+ Years Experience at IIT Kharagpur", icon: GraduationCap }
  ];

  return (
    <section id="education" className="py-24 bg-white dark:bg-gray-900 relative">
      {/* Clean geometric background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-100/40 to-transparent dark:from-indigo-900/20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-100/40 to-transparent dark:from-purple-900/20"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Education
          </h2>
          <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Strong academic foundation in computer science and engineering from prestigious institutions
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8 mb-16">
          {education.map((edu, index) => (
            <Card 
              key={index} 
              className="group bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 slide-up border-0"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 dark:from-indigo-950/10 dark:to-purple-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                
                <CardHeader className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex items-start gap-6">
                      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-all duration-300">
                        <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="space-y-3">
                        <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {edu.degree}
                        </CardTitle>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                          {edu.field}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                          {edu.institution}
                        </p>
                        {edu.thesis && (
                          <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">M.Tech Thesis:</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 italic">{edu.thesis}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Guided by: {edu.advisor}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{edu.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400 lg:text-right">
                      <div className="flex items-center gap-2 lg:justify-end">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium">{edu.period}</span>
                      </div>
                      <div className="flex items-center gap-2 lg:justify-end">
                        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium">{edu.location}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </div>
            </Card>
          ))}
        </div>

        {/* Key Achievements Section */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 max-w-6xl mx-auto slide-up border-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 dark:from-indigo-950/10 dark:to-purple-950/10 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
          <CardContent className="p-8 relative z-10">
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Key Achievements
                </h3>
                <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
                Graduated from premier institutions in India with a strong foundation in computer science, 
                algorithms, and software engineering principles. Served as Teaching Assistant during 
                M.Tech., mentoring students in Programming, Data Structures, and Theory of Computations.
              </p>
              
              <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {achievements.map((achievement, index) => (
                  <div key={index} className="group/item text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-900/50 transition-all duration-300">
                      <achievement.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-transform duration-300" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors duration-300">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Education;