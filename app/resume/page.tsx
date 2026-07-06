import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { skills, about } from "@/data/skills";
import { PrintButton } from "@/components/site/PrintButton";

export const metadata: Metadata = {
  title: `Résumé — ${profile.name}`,
  description: `${profile.positioning}. Experience, projects, and skills.`,
};

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-night px-4 py-10 font-plex antialiased print:bg-white print:p-0 md:px-6 md:py-14">
      <div className="mx-auto mb-6 flex max-w-[820px] items-center justify-between print:hidden">
        <Link
          href="/"
          className="text-[13.5px] text-[#9b9fa4] transition-colors hover:text-[#f0f1f2]"
        >
          ← Back to portfolio
        </Link>
        <PrintButton />
      </div>

      {/* Paper sheet — stays light so it prints cleanly */}
      <div className="mx-auto max-w-[820px] rounded-2xl bg-white p-8 text-neutral-900 shadow-2xl print:max-w-none print:rounded-none print:p-0 print:shadow-none md:p-12">
        <header className="border-b border-neutral-200 pb-6">
          <h1 className="font-grotesk text-[32px] font-bold tracking-tight">
            {profile.name}
          </h1>
          <p className="mt-1 text-[15px] text-neutral-600">{profile.positioning}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-plexmono text-[12px] text-neutral-500">
            <a href={`mailto:${profile.email}`} className="hover:text-neutral-900">
              {profile.email}
            </a>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900"
            >
              github.com/rahulbhardwaj94
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900"
            >
              linkedin.com/in/rahul-bhardwaj-sde
            </a>
            <span>{profile.location}</span>
          </div>
        </header>

        <Section title="Summary">
          {about.paragraphs.map((p, i) => (
            <p key={i} className={`text-[13.5px] leading-relaxed text-neutral-700 ${i > 0 ? "mt-2" : ""}`}>
              {p}
            </p>
          ))}
        </Section>

        <Section title="Experience">
          {experience.map((e) => (
            <div key={e.title} className="mb-5 last:mb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-[15px] font-semibold">{e.title}</h3>
                <span className="font-plexmono text-[12px] text-neutral-500">
                  {e.period}
                </span>
              </div>
              <p className="mt-1 text-[13.5px] leading-relaxed text-neutral-700">
                {e.description}
              </p>
              <div className="mt-1.5 font-plexmono text-[11.5px] text-neutral-500">
                {e.tags.join(" · ")}
              </div>
            </div>
          ))}
        </Section>

        <Section title="Open-Source Projects">
          {projects.map((p) => (
            <div key={p.slug} className="mb-3 last:mb-0">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-[14px] font-semibold">{p.name}</h3>
                <span className="font-plexmono text-[11.5px] text-neutral-500">
                  {p.tags.join(" · ")}
                </span>
              </div>
              <p className="mt-0.5 text-[13px] leading-relaxed text-neutral-700">
                {p.blurb}
              </p>
            </div>
          ))}
        </Section>

        <Section title="Skills">
          <p className="font-plexmono text-[12.5px] leading-relaxed text-neutral-700">
            {skills.map((s) => s.label).join("  ·  ")}
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-neutral-200 py-5 last:border-b-0 last:pb-0">
      <h2 className="mb-3 font-plexmono text-[11px] font-medium uppercase tracking-[2.5px] text-neutral-400">
        {title}
      </h2>
      {children}
    </section>
  );
}
