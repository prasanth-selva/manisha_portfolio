import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { supabasePublic } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }
  if (String(form.get("company") ?? "").trim()) return NextResponse.json({ ok: true });
  const parsed = contactSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check your message." }, { status: 400 });
  }
  const supabase = supabasePublic();
  if (!supabase) return NextResponse.json({ error: "The contact form is temporarily unavailable." }, { status: 503 });
  const { error } = await supabase.from("manisha_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject || null,
    body: parsed.data.message,
  });
  if (error) {
    console.error("[contact] Message insert failed:", error.message);
    return NextResponse.json({ error: "Your message could not be saved right now. Please try again later." }, { status: 503 });
  }
  return NextResponse.json({ ok: true }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
