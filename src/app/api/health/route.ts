import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = supabasePublic();
  if (!supabase) {
    return NextResponse.json({ ok: false, db: "unconfigured" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const started = Date.now();
  const { error } = await supabase.from("manisha_projects").select("id").limit(1);
  if (error) {
    return NextResponse.json({ ok: false, db: "unavailable", latencyMs: Date.now() - started }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ ok: true, db: "up", latencyMs: Date.now() - started }, { headers: { "Cache-Control": "no-store" } });
}
