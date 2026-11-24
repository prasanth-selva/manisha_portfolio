"use client";

import { useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HeroOverlay } from "@/components/hero/HeroOverlay";
import type { SiteSettings } from "@/lib/data";

type Manifest = { width: number; height: number; desktop: string[]; mobile: string[] };

export default function CanvasSequence({ settings }: { settings: SiteSettings }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function preload() {
      try {
        const response = await fetch("/hero-frames/manifest.json", { cache: "force-cache" });
        if (!response.ok) throw new Error("Frame manifest unavailable");
        const manifest = (await response.json()) as Manifest;
        const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
        const mobile = window.matchMedia("(max-width: 768px)").matches || Boolean(saveData);
        let urls = mobile ? manifest.mobile : manifest.desktop;
        if (!Array.isArray(urls) || urls.length === 0) throw new Error("No hero frames listed");
        if (reducedMotion) urls = [urls[Math.floor(urls.length / 2)]!];
        let loaded = 0;
        const images = await Promise.all(urls.map((url) => new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.decoding = "async";
          image.onload = () => {
            loaded += 1;
            setProgress(loaded / urls.length);
            resolve(image);
          };
          image.onerror = () => reject(new Error(`Unable to load ${url}`));
          image.src = url;
        })));
        if (cancelled) return;
        framesRef.current = images;
        setReady(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    }
    void preload();
    return () => { cancelled = true; framesRef.current = []; };
  }, [reducedMotion]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;
    const frames = framesRef.current;
    const mobileViewport = window.matchMedia("(max-width: 768px)");
    let lastIndex = -1;
    let raf = 0;

    const paint = (rawIndex: number) => {
      if (!frames.length) return;
      const index = Math.max(0, Math.min(frames.length - 1, rawIndex));
      if (index === lastIndex && canvas.width > 0) return;
      const image = frames[index];
      if (!image) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, width, height);
      const scale = mobileViewport.matches
        ? Math.min(width / image.naturalWidth, height / image.naturalHeight)
        : Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      lastIndex = index;
    };

    if (reducedMotion) paint(Math.floor(frames.length / 2));
    else {
      const animate = () => {
        paint(Math.round(scrollYProgress.get() * (frames.length - 1)));
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
    }
    const observer = new ResizeObserver(() => { lastIndex = -1; paint(Math.round(scrollYProgress.get() * (frames.length - 1))); });
    observer.observe(canvas);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); };
  }, [ready, reducedMotion, scrollYProgress]);

  return (
    <section ref={sectionRef} className={`relative ${reducedMotion ? "h-svh" : "h-[400svh]"}`} aria-label="Portfolio introduction">
      <div className="sticky top-0 h-svh overflow-hidden bg-[#030303]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" role="img" aria-label="A coastal bicycle ride at dusk" />
        <HeroOverlay scrollYProgress={scrollYProgress} displayName={settings.displayName} headline={settings.headline} resumeUrl={settings.resumeUrl} />
        {!ready && !failed && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-[#030303]" role="status" aria-live="polite">
            <div className="w-56">
              <div className="mb-3 flex justify-between font-sans text-[10px] uppercase tracking-[0.18em] text-white/75"><span>Preparing the frames</span><span>{Math.round(progress * 100)}%</span></div>
              <div className="h-px w-full bg-white/20" role="progressbar" aria-label="Loading hero frames" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
                <div className="h-full bg-accent-metal transition-[width] duration-100" style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
            </div>
          </div>
        )}
        {failed && <div className="hero-copy absolute bottom-5 right-5 px-3 py-2 text-xs text-white/70" role="status">The motion sequence could not load. Use the links to explore the portfolio.</div>}
      </div>
    </section>
  );
}
