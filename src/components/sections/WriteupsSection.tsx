import Link from "next/link";
import { SectionHeading } from "@/components/ui/Reveal";
import type { Post } from "@/lib/types";

export default function WriteupsSection({ posts }: { posts: Post[] }) {
  const published = posts.filter((post) => post.published).slice(0, 3);
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <SectionHeading index="07" label="NOTES" title={<>Writing.</>} />
        {published.length > 0 && <Link href="/writeups" className="min-h-11 border-b border-accent-metal px-1 py-3 text-sm text-white hover:text-accent-metal">All notes <span aria-hidden="true">→</span></Link>}
      </div>
      {published.length ? <ul className="mt-10 divide-y divide-white/15 border-y border-white/15">{published.map((post) => <li key={post.id}><Link href={`/writeups/${post.slug}`} className="group flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"><span><span className="block text-lg font-medium text-white group-hover:text-accent-metal">{post.title}</span>{post.excerpt && <span className="mt-1 block max-w-2xl text-sm leading-6 text-white/60">{post.excerpt}</span>}</span><span className="shrink-0 text-xs text-white/45">{post.reading_minutes} min <span aria-hidden="true">→</span></span></Link></li>)}</ul> : <p className="mt-8 border-l border-accent-metal px-4 py-3 text-sm leading-6 text-white/55">No notes published yet.</p>}
    </div>
  );
}
