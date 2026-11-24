"use client";
import { useState, useTransition } from "react";
import type { SiteSettings } from "@/lib/data";

export default function ContactSection({ settings }: { settings: SiteSettings }) {
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const submit = (formData: FormData) => {
    startTransition(async () => {
      setMessage(null);
      try {
        const response = await fetch("/api/contact", { method: "POST", body: formData });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Your message could not be sent.");
        setMessage({ ok: true, text: "Thanks for reaching out. Your message has been sent." });
        (document.getElementById("contact-form") as HTMLFormElement | null)?.reset();
      } catch (cause) {
        setMessage({ ok: false, text: cause instanceof Error ? cause.message : "Your message could not be sent." });
      }
    });
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <p className="mono-label">CONTACT</p>
      <div className="mt-3 grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="display-title text-4xl text-white/90 md:text-5xl">Let’s connect.</h2>
          <p className="mt-4 max-w-md leading-relaxed text-white/50">Have a question or an opportunity to discuss? Send a note and I’ll get back to you.</p>
          {settings.email && <a href={`mailto:${settings.email}`} className="mt-5 inline-block font-sans text-sm text-accent-metal hover:underline">{settings.email}</a>}
        </div>
        <form id="contact-form" action={submit} className="surface grid gap-4 rounded-md p-6 sm:grid-cols-2">
          <div>
            <label className="mono-label mb-2 block" htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" required minLength={2} maxLength={120} autoComplete="name" className="w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85 outline-none focus:border-accent-metal/50" />
          </div>
          <div>
            <label className="mono-label mb-2 block" htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" required maxLength={200} autoComplete="email" className="w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85 outline-none focus:border-accent-metal/50" />
          </div>
          <div className="sm:col-span-2">
            <label className="mono-label mb-2 block" htmlFor="contact-subject">Subject <span className="normal-case tracking-normal text-white/30">(optional)</span></label>
            <input id="contact-subject" name="subject" maxLength={200} className="w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85 outline-none focus:border-accent-metal/50" />
          </div>
          <div className="sm:col-span-2">
            <label className="mono-label mb-2 block" htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={5} className="w-full resize-y rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85 outline-none focus:border-accent-metal/50" />
          </div>
          <div className="sr-only" aria-hidden="true"><label htmlFor="contact-company">Company</label><input id="contact-company" name="company" tabIndex={-1} autoComplete="off" /></div>
          {message && <p role={message.ok ? "status" : "alert"} className={`sm:col-span-2 rounded-md border px-4 py-3 font-sans text-xs ${message.ok ? "border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-300" : "border-red-400/25 bg-red-400/[0.06] text-red-300"}`}>{message.text}</p>}
          <div className="sm:col-span-2"><button type="submit" disabled={pending} className="metal-button rounded-md px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.15em] disabled:opacity-50">{pending ? "Sending…" : "Send message"}</button></div>
        </form>
      </div>
    </section>
  );
}
