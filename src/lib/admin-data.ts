import "server-only";
import { requireAdmin } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase";
import { SEED_SETTINGS } from "@/lib/seed-data";
import type { SiteSettings } from "@/lib/data";

export async function getAdminRows<T>(table: string, orderBy: string): Promise<T[]> {
  await requireAdmin();
  const supabase = await supabaseServer();
  const { data, error } = await supabase.from(table).select("*").order(orderBy, { ascending: true });
  if (error) throw new Error(`Unable to load ${table}: ${error.message}`);
  return (data ?? []) as T[];
}

export async function getAdminSettings(): Promise<SiteSettings> {
  await requireAdmin();
  const supabase = await supabaseServer();
  const { data, error } = await supabase.from("manisha_settings").select("key,value");
  if (error) throw new Error(`Unable to load manisha_settings: ${error.message}`);
  const stored = new Map((data ?? []).map((row) => [String(row.key), row.value]));
  const text = (key: keyof SiteSettings, fallback: string) => {
    const value = stored.get(key);
    return typeof value === "string" ? value : fallback;
  };
  const optional = (key: keyof SiteSettings, fallback: string | null) => {
    const value = stored.get(key);
    return typeof value === "string" && value.length > 0 ? value : fallback;
  };
  return {
    displayName: text("displayName", SEED_SETTINGS.displayName),
    headline: text("headline", SEED_SETTINGS.headline),
    aboutBio: text("aboutBio", SEED_SETTINGS.aboutBio),
    institution: text("institution", SEED_SETTINGS.institution),
    heroBadge: text("heroBadge", SEED_SETTINGS.heroBadge),
    resumeUrl: optional("resumeUrl", SEED_SETTINGS.resumeUrl),
    aboutPhoto: optional("aboutPhoto", SEED_SETTINGS.aboutPhoto),
    email: text("email", SEED_SETTINGS.email),
    linkedin: text("linkedin", SEED_SETTINGS.linkedin),
    github: text("github", SEED_SETTINGS.github),
    phone: optional("phone", SEED_SETTINGS.phone),
    seoTitle: text("seoTitle", SEED_SETTINGS.seoTitle),
    seoDescription: text("seoDescription", SEED_SETTINGS.seoDescription),
  };
}
