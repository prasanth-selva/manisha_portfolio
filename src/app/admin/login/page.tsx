"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [recoveryPending, setRecoveryPending] = useState(false);

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      setError(null);
      setRecoveryMessage(null);
      try {
        const supabase = supabaseBrowser();
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: String(formData.get("email") ?? "").trim(),
          password: String(formData.get("password") ?? ""),
        });
        if (signInError) {
          setError("Sign-in failed. Check your email and password.");
          return;
        }
        const { data, error: adminError } = await supabase.rpc("manisha_is_admin");
        if (adminError || data !== true) {
          await supabase.auth.signOut();
          setError("This account is not authorized to access the portfolio admin.");
          return;
        }
        router.replace("/admin");
        router.refresh();
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Unable to sign in right now.");
      }
    });
  };

  const sendRecoveryEmail = async () => {
    const normalizedEmail = email.trim();
    setError(null);
    setRecoveryMessage(null);
    if (!normalizedEmail) {
      setError("Enter your email address to request a recovery link.");
      return;
    }

    setRecoveryPending(true);
    try {
      const supabase = supabaseBrowser();
      const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (recoveryError) {
        setError("Unable to send a recovery link right now. Please try again.");
      } else {
        setRecoveryMessage("If an account exists for that email, a recovery link has been sent.");
      }
    } catch {
      setError("Unable to send a recovery link right now. Please try again.");
    } finally {
      setRecoveryPending(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-base px-6 py-12">
      <section className="surface w-full max-w-md rounded-md p-7 sm:p-9">
        <p className="mono-label">MANISHA · PRIVATE AREA</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white/90">Admin sign in</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/50">Use an email/password account that has been added to the portfolio admin allowlist.</p>
        <form action={onSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mono-label mb-2 block" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85 outline-none focus:border-accent-metal/50" />
          </div>
          <div>
            <label className="mono-label mb-2 block" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85 outline-none focus:border-accent-metal/50" />
          </div>
          {error && <p role="alert" className="rounded-md border border-red-400/25 bg-red-400/[0.06] px-4 py-3 font-sans text-xs text-red-300">{error}</p>}
          {recoveryMessage && <p role="status" className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 font-sans text-xs text-white/65">{recoveryMessage}</p>}
          <button type="submit" disabled={pending} className="w-full rounded-md bg-accent-metal px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-black disabled:opacity-50">{pending ? "Signing in…" : "Sign in"}</button>
          <button type="button" onClick={sendRecoveryEmail} disabled={recoveryPending} className="w-full text-center font-sans text-xs text-white/55 underline underline-offset-4 transition hover:text-white/85 disabled:opacity-50">
            {recoveryPending ? "Sending recovery link…" : "Forgot password?"}
          </button>
        </form>
      </section>
    </main>
  );
}
