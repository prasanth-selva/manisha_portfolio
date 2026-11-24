import CanvasSequence from "@/components/hero/CanvasSequence";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import AboutSection from "@/components/sections/AboutSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import CertificationsSection from "@/components/sections/CertificationsSection";
import ContactSection from "@/components/sections/ContactSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import WriteupsSection from "@/components/sections/WriteupsSection";
import SectionShell from "@/components/sections/SectionShell";
import { getAchievements, getCertifications, getExperience, getPosts, getProjects, getSettings, getSkills } from "@/lib/data";

export default async function HomePage() {
  const [settings, projects, experience, skills, achievements, certifications, posts] = await Promise.all([
    getSettings(), getProjects(), getExperience(), getSkills(), getAchievements(), getCertifications(), getPosts(),
  ]);
  return (
    <>
      <Navbar displayName={settings.displayName} />
      <main id="top">
        <SectionShell kind="hero"><CanvasSequence settings={settings} /></SectionShell>
        <SectionShell id="about"><AboutSection settings={settings} /></SectionShell>
        <SectionShell id="experience"><ExperienceSection items={experience} /></SectionShell>
        <SectionShell id="projects"><ProjectsSection projects={projects} /></SectionShell>
        <SectionShell id="skills"><SkillsSection skills={skills} /></SectionShell>
        <SectionShell id="achievements"><AchievementsSection items={achievements} /></SectionShell>
        <SectionShell id="certifications"><CertificationsSection items={certifications} /></SectionShell>
        <SectionShell id="writeups"><WriteupsSection posts={posts} /></SectionShell>
        <SectionShell id="contact"><ContactSection settings={settings} /></SectionShell>
      </main>
      <Footer settings={settings} />
    </>
  );
}
