import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import { ThemeToggle } from "@/components/theme-toggle";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <Hero />
      <Experience />
      <Skills />
      <Education />
      <Contact />
    </div>
  );
};

export default Index;
