import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import { ThemeToggle } from "@/components/theme-toggle";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <ThemeToggle />
      <Hero />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <Contact />
    </div>
  );
};

export default Index;
