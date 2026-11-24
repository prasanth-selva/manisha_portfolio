import { NextResponse } from "next/server";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { isCurrentUserAdmin } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";
const previewSchema = z.object({ mdx: z.string().max(100_000) });

export async function POST(request: Request) {
  if (!(await isCurrentUserAdmin())) {
    return NextResponse.json({ error: "Admin access required." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid preview request." }, { status: 400 });
  }
  const parsed = previewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Preview content is too large or invalid." }, { status: 400 });
  }
  // Raw HTML is not enabled in remark-rehype; admin-authored markup stays inert.
  const rendered = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeStringify)
    .process(parsed.data.mdx);
  return NextResponse.json({ html: [String(rendered)] }, { headers: { "Cache-Control": "no-store" } });
}
