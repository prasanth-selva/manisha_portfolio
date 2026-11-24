"use client";

import { useEffect, useState } from "react";

const LINKS = [
  ["#about", "About"], ["#experience", "Experience"], ["#projects", "Projects"],
  ["#skills", "Skills"], ["#achievements", "Achievements"], ["#certifications", "Credentials"],
  ["#writeups", "Notes"], ["#contact", "Contact"],
] as const;

export default function Navbar({ displayName }: { displayName: string }) {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(`#${entry.target.id}`); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    LINKS.forEach(([href]) => { const element = document.getElementById(href.slice(1)); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050505]/95">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-5 md:px-8" aria-label="Primary">
        <a href="#top" className="flex items-center gap-3 text-sm font-medium tracking-[0.12em] text-white" aria-label={`${displayName}, home`}>
          <span className="grid h-8 w-8 place-items-center border border-accent-metal text-base font-semibold text-accent-metal">M.</span>
          <span className="hidden uppercase sm:inline">{displayName}</span>
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map(([href, label]) => <li key={href}><a href={href} aria-current={active === href ? "location" : undefined} className={`inline-flex min-h-11 items-center border-b px-2.5 text-[10px] uppercase tracking-[0.13em] transition-colors ${active === href ? "border-accent-metal text-accent-metal" : "border-transparent text-white/65 hover:text-white"}`}>{label}</a></li>)}
        </ul>
        <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"} className="grid h-11 w-11 place-items-center border border-white/15 text-white lg:hidden">
          <span className="text-lg" aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
      </nav>
      {open && <nav id="mobile-menu" className="border-t border-white/10 bg-[#050505] px-5 py-3 lg:hidden" aria-label="Mobile primary"><ul className="grid grid-cols-2 gap-x-4">{LINKS.map(([href, label]) => <li key={href}><a href={href} onClick={() => setOpen(false)} aria-current={active === href ? "location" : undefined} className={`flex min-h-11 items-center border-b border-white/10 text-xs uppercase tracking-[0.12em] ${active === href ? "text-accent-metal" : "text-white/70"}`}>{label}</a></li>)}</ul></nav>}
    </header>
  );
}
