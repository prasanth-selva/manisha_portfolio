import type { SiteSettings } from "@/lib/data";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <a href="#top" className="flex items-center gap-3 text-sm uppercase tracking-[0.14em] text-white"><span className="grid h-8 w-8 place-items-center border border-accent-metal text-accent-metal">M.</span>{settings.displayName}</a>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/60">
          {settings.email && <a href={`mailto:${settings.email}`} className="hover:text-accent-metal">Email</a>}
          {settings.linkedin && <a href={settings.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent-metal">LinkedIn</a>}
          {settings.github && <a href={settings.github} target="_blank" rel="noreferrer" className="hover:text-accent-metal">GitHub</a>}
          <a href="/admin/login" className="hover:text-accent-metal">Admin</a>
        </div>
        <p className="text-[11px] text-white/40">© {new Date().getFullYear()} {settings.displayName}</p>
      </div>
    </footer>
  );
}
