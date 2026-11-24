import "server-only";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase";

export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const supabase = await supabaseServer();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return false;
    const { data, error } = await supabase.rpc("manisha_is_admin");
    return !error && data === true;
  } catch {
    return false;
  }
}

export async function requireAdmin(): Promise<void> {
  if (!(await isCurrentUserAdmin())) redirect("/admin/login");
}
