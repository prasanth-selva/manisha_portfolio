"use client";

import { useEffect, useState, useTransition } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function AdminResetPasswordPage() {
  const [hasSession, setHasSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    try {
      const supabase = supabaseBrowser();
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (active && session) setHasSession(true);
      });

      void supabase.auth.getSession().then(({ data, error: sessionError }) => {
        if (!active) return;
        if (sessionError) setError("This recovery link is invalid or has expired.");
        setHasSession(Boolean(data.session));
        setCheckingSession(false);
      }).catch(() => {
        if (!active) return;
        setError("Unable to validate this recovery link. Please request another one.");
        setCheckingSession(false);
      });

      return () => {
        active = false;
        subscription.unsubscribe();
      };
    } catch {
      setError("Supabase is not configured for password recovery.");
      setCheckingSession(false);
      return () => { active = false; };
    }
  }, []);

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      setError(null);
      const password = String(formData.get("password") ?? "");
      const confirmPassword = String(formData.get("confirmPassword") ?? "");
      if (password.length < 8) {
        setError("Use a password with at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("The passwords do not match.");
        return;
      }
      if (!hasSession) {
        setError("This recovery link is invalid or has expired. Request a new one.");
        return;
      }

      try {
        const supabase = supabaseBrowser();
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) {
          setError("Unable to update the password. Request a new recovery link and try again.");
          return;
        }
        await supabase.auth.signOut();
        setComplete(true);
      } catch {
        setError("Unable to update the password right now. Please try again.");
      }
    });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-base px-6 py-12">
      <section className="surface w-full max-w-md rounded-md p-7 sm:p-9">
        <p className="mono-label">MANISHA · PRIVATE AREA</p>
        {complete ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white/90">Password updated</h1>
            <p role="status" className="mt-3 text-sm leading-relaxed text-white/60">Your password has been changed. Sign in with the new password.</p>
            <a href="/admin/login" className="mt-7 block w-full rounded-md bg-accent-metal px-6 py-3 text-center font-sans text-xs font-semibold uppercase tracking-[0.15em] text-black">Go to admin sign in</a>
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white/90">Set a new password</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/50">Choose a password for the allowlisted admin account.</p>
            {checkingSession ? (
              <p role="status" className="mt-8 text-sm text-white/55">Validating recovery link…</p>
            ) : hasSession ? (
              <form action={onSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mono-label mb-2 block" htmlFor="password">New password</label>
                  <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85 outline-none focus:border-accent-metal/50" />
                </div>
                <div>
                  <label className="mono-label mb-2 block" htmlFor="confirmPassword">Confirm new password</label>
                  <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required className="w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85 outline-none focus:border-accent-metal/50" />
                </div>
                {error && <p role="alert" className="rounded-md border border-red-400/25 bg-red-400/[0.06] px-4 py-3 font-sans text-xs text-red-300">{error}</p>}
                <button type="submit" disabled={pending} className="w-full rounded-md bg-accent-metal px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-black disabled:opacity-50">{pending ? "Updating password…" : "Update password"}</button>
              </form>
            ) : (
              <div className="mt-8 space-y-4">
                {error && <p role="alert" className="rounded-md border border-red-400/25 bg-red-400/[0.06] px-4 py-3 font-sans text-xs text-red-300">{error}</p>}
                <a href="/admin/login" className="inline-block font-sans text-xs text-white/70 underline underline-offset-4 hover:text-white">Request another recovery link</a>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
