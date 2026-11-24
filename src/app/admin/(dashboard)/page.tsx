import Link from "next/link";
import { supabaseServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";
const COLLECTIONS = [
  ["Projects", "manisha_projects", "/admin/projects"],
  ["Experience", "manisha_experiences", "/admin/experience"],
  ["Skills", "manisha_skills", "/admin/skills"],
  ["Achievements", "manisha_achievements", "/admin/achievements"],
  ["Certifications", "manisha_certifications", "/admin/certifications"],
  ["Writeups", "manisha_posts", "/admin/writeups"],
  ["Messages", "manisha_messages", "/admin/inbox"],
] as const;

export default async function AdminHomePage() {
  const supabase = await supabaseServer();
  const counts = await Promise.all(COLLECTIONS.map(async ([label, table, href]) => {
    const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
    return { label, href, count: count ?? 0 };
  }));

  return (
    <section>
      <p className="mono-label">PORTFOLIO CONTROL ROOM</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white/90">Dashboard</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/50">Manage the public portfolio from one place. Changes are saved to the Manisha-specific Supabase tables and revalidated for visitors.</p>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {counts.map((item) => (
          <Link key={item.href} href={item.href} className="surface rounded-md p-5 transition-colors hover:border-accent-metal/30">
            <p className="mono-label">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold tabular-nums text-white/90">{item.count}</p>
            <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.16em] text-white/35">Manage {item.label.toLowerCase()} →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
