import { Topbar } from "@/components/site/Topbar";
import { Hero } from "@/components/site/Hero";
import { WorkSection } from "@/components/site/WorkSection";
import { AboutSection } from "@/components/site/AboutSection";
import { ExperienceSection } from "@/components/site/ExperienceSection";
import { ContactSection } from "@/components/site/ContactSection";
import { CursorSpotlight } from "@/components/site/CursorSpotlight";
import { IncidentsSection } from "@/components/site/IncidentsSection";

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-night font-plex text-paper-body antialiased">
      {/* ambient background wash */}
      <div aria-hidden className="home-wash pointer-events-none fixed inset-0 z-0" />
      {/* fine vignette */}
      <div aria-hidden className="home-vignette pointer-events-none fixed inset-0 z-[1]" />

      {/* film grain over everything, below interactive layers */}
      <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[3]" />

      <CursorSpotlight />
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
