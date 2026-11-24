import type { Achievement, Certification, Experience, Post, Project, Skill } from "@/lib/types";

/**
 * Profile defaults use the details supplied by Manisha. Work history and
 * credentials remain empty until verified records are added in admin.
 */
export const SEED_SETTINGS = {
  displayName: "Manisha Nithya",
  headline: "Second-year B.E. CSE & Cybersecurity student",
  aboutBio: "I’m Manisha Nithya, a second-year B.E. CSE & Cybersecurity student at KGISL Institute of Technology.",
  institution: "KGISL Institute of Technology",
  heroBadge: "B.E. CSE & Cybersecurity",
  resumeUrl: null as string | null,
  aboutPhoto: null as string | null,
  email: "",
  linkedin: "https://www.linkedin.com/in/manisha-d-73308b377/",
  github: "https://github.com/manishanithya7",
  phone: null as string | null,
  seoTitle: "Manisha Nithya — Portfolio",
  seoDescription: "Portfolio of Manisha Nithya, a second-year B.E. CSE & Cybersecurity student at KGISL Institute of Technology.",
};

export const SEED_PROJECTS: Project[] = [];
export const SEED_EXPERIENCE: Experience[] = [];
export const SEED_SKILLS: Skill[] = [];
export const SEED_CERTIFICATIONS: Certification[] = [];
export const SEED_ACHIEVEMENTS: Achievement[] = [];
export const SEED_POSTS: Post[] = [];
