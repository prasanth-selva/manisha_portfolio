import "server-only";

import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function supabaseConfigured(): boolean {
  return Boolean(url && publishableKey);
}

/** Cookie-bound server client; every query remains constrained by Supabase RLS. */
export async function supabaseServer() {
  if (!url || !publishableKey) {
    throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }
  const cookieStore = await cookies();
  return createServerClient(url, publishableKey, {
    cookieOptions: { sameSite: "none", secure: true },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, { ...options, sameSite: "none", secure: true }));
        } catch {
          // Server Components cannot write cookies; middleware/server actions refresh them.
        }
      },
    },
  });
}

/** Anonymous client used only for reads available under public RLS policies. */
export function supabasePublic(): SupabaseClient | null {
  if (!url || !publishableKey) return null;
  return createClient(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const SUPABASE_MISSING_MSG =
  "Supabase is not configured. Copy .env.example to .env.local and add the project URL and publishable key.";
