import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();
  let unread = 0;
  try {
    const supabase = await supabaseServer();
    const { count } = await supabase.from("manisha_messages").select("id", { count: "exact", head: true }).eq("read", false);
    unread = count ?? 0;
  } catch {
    // Keep the editor usable when Supabase is temporarily unavailable.
  }

  return (
    <div className="min-h-screen bg-base text-white/80">
      <header className="border-b border-white/10 px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/admin" className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Manisha <span className="text-white/30">/ Admin</span></Link>
          <Link href="/" className="font-sans text-[11px] uppercase tracking-[0.16em] text-white/40 hover:text-white">View portfolio ↗</Link>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:grid-cols-[220px_minmax(0,1fr)] md:px-8">
        <aside className="surface h-fit rounded-md p-4">
          <p className="mono-label px-4">CONTENT</p>
          <AdminNav unread={unread} />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
