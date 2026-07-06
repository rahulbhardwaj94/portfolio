import { Topbar } from "@/components/site/Topbar";
import { Hero } from "@/components/site/Hero";
import { WorkSection } from "@/components/site/WorkSection";
import { AboutSection } from "@/components/site/AboutSection";
import { ExperienceSection } from "@/components/site/ExperienceSection";
import { ContactSection } from "@/components/site/ContactSection";
import { CursorSpotlight } from "@/components/site/CursorSpotlight";
import { Preloader } from "@/components/site/Preloader";

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-night font-plex text-ink-body antialiased">
      {/* ambient background wash */}
      <div aria-hidden className="home-wash pointer-events-none fixed inset-0 z-0" />
      {/* fine vignette */}
      <div aria-hidden className="home-vignette pointer-events-none fixed inset-0 z-[1]" />

      <CursorSpotlight />
      <Preloader />
      <Topbar />

      <main>
        <Hero />
        <WorkSection />
        <AboutSection />
        <ExperienceSection />
        <ContactSection />
      </main>
    </div>
  );
}
