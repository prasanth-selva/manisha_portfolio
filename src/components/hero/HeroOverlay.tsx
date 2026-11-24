"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

export function HeroOverlay({
  scrollYProgress,
  displayName,
  headline,
  resumeUrl,
}: {
  scrollYProgress: MotionValue<number>;
  displayName: string;
  headline: string;
  resumeUrl: string | null;
}) {
  const intro = useTransform(scrollYProgress, [0, 0.02, 0.16, 0.22], [1, 1, 0, 0]);
  const second = useTransform(scrollYProgress, [0.25, 0.31, 0.42, 0.48], [0, 1, 1, 0]);
  const third = useTransform(scrollYProgress, [0.53, 0.59, 0.70, 0.76], [0, 1, 1, 0]);
  const outro = useTransform(scrollYProgress, [0.83, 0.89, 0.98, 1], [0, 1, 1, 0]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute left-5 top-24 border-l border-accent-metal bg-black/80 px-4 py-3 md:left-12 md:top-28">
        <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-accent-metal">{displayName}</p>
        <p className="mt-1 max-w-[14rem] text-xs text-white/75">{headline}</p>
      </div>

      <motion.div style={{ opacity: intro }} className="absolute inset-0 flex items-center px-5 md:px-12">
        <div className="max-w-2xl bg-black/80 p-5 md:p-8">
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-accent-metal">Portfolio</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl">{displayName}.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/75 md:text-xl">Selected work, experience, and notes.</p>
        </div>
      </motion.div>

      <motion.div style={{ opacity: second }} className="absolute inset-0 flex items-center px-5 md:px-12">
        <div className="max-w-lg border-l border-accent-metal bg-black/80 p-5 md:p-7">
          <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-accent-metal">01 — Work</p>
          <p className="mt-3 text-3xl font-medium leading-tight tracking-tight text-white md:text-5xl">A few projects.</p>
          <a className="pointer-events-auto mt-5 inline-flex min-h-11 items-center border-b border-accent-metal/70 text-sm text-white hover:text-accent-metal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-metal" href="#projects">Explore the work <span className="ml-3" aria-hidden="true">↓</span></a>
        </div>
      </motion.div>

      <motion.div style={{ opacity: third }} className="absolute inset-0 flex items-center justify-end px-5 text-right md:px-12">
        <div className="max-w-lg border-r border-accent-metal bg-black/80 p-5 md:p-7">
          <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-accent-metal">02 — Practice</p>
          <p className="mt-3 text-3xl font-medium leading-tight tracking-tight text-white md:text-5xl">Work with purpose. Details that matter.</p>
          <a className="pointer-events-auto mt-5 inline-flex min-h-11 items-center border-b border-accent-metal/70 text-sm text-white hover:text-accent-metal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-metal" href="#experience">See the experience <span className="ml-3" aria-hidden="true">↓</span></a>
        </div>
      </motion.div>

      <motion.div style={{ opacity: outro }} className="absolute inset-0 flex items-center justify-center px-5 text-center">
        <div className="max-w-xl bg-black/85 p-6 md:p-9">
          <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-accent-metal">03 — Next</p>
          <p className="mt-3 text-3xl font-medium tracking-tight text-white md:text-5xl">Have a project in mind?</p>
          <div className="pointer-events-auto mt-6 flex flex-wrap justify-center gap-3">
            <a className="inline-flex min-h-11 items-center bg-accent-metal px-5 text-sm font-medium text-black hover:bg-[#e4cc9c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="#contact">Get in touch</a>
            {resumeUrl ? <a className="inline-flex min-h-11 items-center border border-white/30 px-5 text-sm text-white hover:border-accent-metal hover:text-accent-metal" href={resumeUrl} target="_blank" rel="noreferrer">View résumé</a> : null}
          </div>
        </div>
      </motion.div>

      <motion.div style={{ opacity: intro }} className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center" aria-hidden="true">
        <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-white/55">Scroll</span>
        <span className="mx-auto mt-2 block h-6 w-px bg-accent-metal" />
      </motion.div>
    </div>
  );
}
