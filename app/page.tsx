import { Topbar } from "@/components/site/Topbar";
import { Hero } from "@/components/site/Hero";
import { WorkSection } from "@/components/site/WorkSection";
import { AboutSection } from "@/components/site/AboutSection";
import { ExperienceSection } from "@/components/site/ExperienceSection";
import { ContactSection } from "@/components/site/ContactSection";
import { IncidentsSection } from "@/components/site/IncidentsSection";

export default function HomePage() {
  return (
    <div
      data-theme="monograph"
      className="relative min-h-screen w-full overflow-x-hidden bg-night font-body text-fg-body antialiased">
      {/* ambient background wash */}
      <div aria-hidden className="home-wash pointer-events-none fixed inset-0 z-0" />
      {/* fine vignette */}
      <div aria-hidden className="home-vignette pointer-events-none fixed inset-0 z-[1]" />

      <Topbar />

      <main>
        <Hero />
        <WorkSection />
        <IncidentsSection />
        <AboutSection />
        <ExperienceSection />
        <ContactSection />
      </main>
    </div>
  );
}
