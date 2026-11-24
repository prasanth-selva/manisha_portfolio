import "server-only";

import {
  SEED_ACHIEVEMENTS,
  SEED_CERTIFICATIONS,
  SEED_EXPERIENCE,
  SEED_POSTS,
  SEED_PROJECTS,
  SEED_SETTINGS,
  SEED_SKILLS,
} from "@/lib/seed-data";
import { SUPABASE_MISSING_MSG, supabasePublic } from "@/lib/supabase";
import type { Achievement, Certification, Experience, Post, Project, Skill } from "@/lib/types";

async function withFallback<T>(table: string, seed: T[], order: string): Promise<T[]> {
  const sb = supabasePublic();
  if (!sb) return seed;
  try {
    const { data, error } = await sb.from(table).select("*").eq("published", true).order(order);
    if (error) throw error;
    return (data ?? []) as T[];
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[data] ${table}: using safe empty defaults (${(err as Error).message})`);
    }
    return seed;
  }
}

export const getProjects = () => withFallback<Project>("manisha_projects", SEED_PROJECTS, "sort_order");
export const getExperience = () => withFallback<Experience>("manisha_experiences", SEED_EXPERIENCE, "sort_order");
export const getCertifications = () => withFallback<Certification>("manisha_certifications", SEED_CERTIFICATIONS, "sort_order");
export const getAchievements = () => withFallback<Achievement>("manisha_achievements", SEED_ACHIEVEMENTS, "sort_order");
export const getSkills = () => withFallback<Skill>("manisha_skills", SEED_SKILLS, "sort_order");

export async function getPosts(): Promise<Post[]> {
  const posts = await withFallback<Post>("manisha_posts", SEED_POSTS, "published_at");
  return [...posts].sort((a, b) =>
    new Date(b.published_at ?? b.created_at).getTime() - new Date(a.published_at ?? a.created_at).getTime()
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return (await getProjects()).find((project) => project.slug === slug) ?? null;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return (await getPosts()).find((post) => post.slug === slug) ?? null;
}

export type SiteSettings = {
  displayName: string;
  headline: string;
  aboutBio: string;
  institution: string;
  heroBadge: string;
  resumeUrl: string | null;
  aboutPhoto: string | null;
  email: string;
  linkedin: string;
  github: string;
  phone: string | null;
  seoTitle: string;
  seoDescription: string;
};

const FALLBACK_SETTINGS: SiteSettings = { ...SEED_SETTINGS };

export async function getSettings(): Promise<SiteSettings> {
  const sb = supabasePublic();
  if (!sb) return FALLBACK_SETTINGS;
  try {
    const { data, error } = await sb.from("manisha_settings").select("key,value");
    if (error) throw error;
    const values = new Map((data ?? []).map((row) => [row.key as string, row.value]));
    const text = (key: keyof SiteSettings, fallback: string) => {
      const value = values.get(key);
      return typeof value === "string" ? value : fallback;
    };
    const optional = (key: keyof SiteSettings, fallback: string | null) => {
      const value = values.get(key);
      return typeof value === "string" && value.length > 0 ? value : fallback;
    };
    return {
      displayName: text("displayName", FALLBACK_SETTINGS.displayName),
      headline: text("headline", FALLBACK_SETTINGS.headline),
      aboutBio: text("aboutBio", FALLBACK_SETTINGS.aboutBio),
      institution: text("institution", FALLBACK_SETTINGS.institution),
      heroBadge: text("heroBadge", FALLBACK_SETTINGS.heroBadge),
      resumeUrl: optional("resumeUrl", FALLBACK_SETTINGS.resumeUrl),
      aboutPhoto: optional("aboutPhoto", FALLBACK_SETTINGS.aboutPhoto),
      email: text("email", FALLBACK_SETTINGS.email),
      linkedin: text("linkedin", FALLBACK_SETTINGS.linkedin),
      github: text("github", FALLBACK_SETTINGS.github),
      phone: optional("phone", FALLBACK_SETTINGS.phone),
      seoTitle: text("seoTitle", FALLBACK_SETTINGS.seoTitle),
      seoDescription: text("seoDescription", FALLBACK_SETTINGS.seoDescription),
    };
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[data] settings: using neutral defaults (${(err as Error).message})`);
    }
    return FALLBACK_SETTINGS;
  }
}

export { SUPABASE_MISSING_MSG };
