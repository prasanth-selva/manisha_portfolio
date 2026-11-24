"use client";

import Image from "next/image";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import type { SiteSettings } from "@/lib/data";

export default function AboutSection({ settings }: { settings: SiteSettings }) {
  const paragraphs = settings.aboutBio.split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean);
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionHeading index="01" label="PROFILE" title={<>About.</>} />
      <div className="mt-12 grid gap-10 md:grid-cols-[240px_1fr] md:gap-16">
        <Reveal><div>
          <div className="relative aspect-[4/5] overflow-hidden border border-[#343434] bg-[#101010]">
            {settings.aboutPhoto ? <Image src={settings.aboutPhoto} alt={`${settings.displayName} portrait`} fill sizes="(max-width: 768px) 100vw, 240px" className="object-cover" /> : <div className="grid h-full place-items-center text-6xl font-medium text-accent-metal/50">M.</div>}
          </div>
          {settings.institution && <p className="mt-3 text-xs text-white/55">{settings.institution}</p>}
        </div></Reveal>
        <div>
          <Reveal delay={0.1}><h2 className="text-2xl font-medium leading-tight text-white md:text-4xl">{settings.headline}</h2></Reveal>
          {paragraphs.length ? paragraphs.map((paragraph, index) => <Reveal key={index} delay={0.15 + index * 0.06}><p className="mt-5 max-w-3xl text-base leading-7 text-white/70">{paragraph}</p></Reveal>) : <Reveal delay={0.15}><p className="mt-5 max-w-3xl border-l border-accent-metal px-4 py-3 text-sm leading-6 text-white/55">Add a short introduction in Admin → Settings when you’re ready.</p></Reveal>}
        </div>
      </div>
    </div>
  );
}
