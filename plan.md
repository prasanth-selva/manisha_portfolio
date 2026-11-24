# Manisha Portfolio — Implementation Plan

## Product and implementation
Build a responsive Next.js App Router portfolio in TypeScript, using Tailwind CSS for layout and a restrained Framer Motion layer for section reveals. The hero is a sticky HTML canvas driven by the 300 supplied 1280×720 frames, converted into WebP without changing the original visual content; use an explicit manifest and a smaller mobile sequence so the 4-viewport scroll story remains smooth on phones. Keep a black matte behind the image to match its dark edge pixels, and use contain-fit on narrow screens so the supplied 16:9 sequence is not cropped.

The public site will have an editable profile/about section, projects, experience, skills, achievements, certifications, writeups, and contact. Do not carry over personal claims, sample metrics, testimonials, certificates, or projects from the reference site. Start without invented biographical data; keep site details editable in the admin. Project and writeup detail pages use real content and uploaded evidence when available, with honest empty states rather than fake image grids.

Use the owner's existing Supabase Postgres and Storage project for persistence. Inspection shows it already contains the reference portfolio's public tables and migrations; do not alter those objects. Isolate Manisha's data in new `manisha_*` tables and a dedicated `manisha-media` bucket, with uniquely named helper functions and RLS policies. Public reads use the publishable client and fall back safely when the service is unavailable. Admins authenticate with Supabase Auth email/password; a private `manisha_admin_users` allowlist and RLS policies gate all database writes. Public contact submissions can insert only messages, and only allowlisted admins can read/manage them. Keep keys browser-safe; do not use or expose a service-role key. Add a repeatable, additive SQL migration and setup instructions.

The app is being developed in the initialized Webdev workspace and delivered separately to the requested private GitHub repository `prasanth-selva/manisha_portfolio` on `main`. The reference repository `prasanth-selva/Port_folio` and its `prasanth-oct18-new-frames` branch remain read-only. Do not publish a website because the user asked for a GitHub push, not hosting.

## Design direction
- **Design movement:** premium editorial portfolio with the clean, technical restraint of the supplied reference, balanced by a cinematic coastal bicycle sequence.
- **Core principles:** plain English; proof before claims; generous readable spacing; flat surfaces and crisp rules; responsive motion that never blocks access.
- **Color philosophy:** near-black `#050505` and graphite provide a quiet frame for the supplied sunset footage. Bone white carries the main type; one warm sand/amber accent `#D9B780` echoes the light in the footage. Avoid gradients, glass effects, purple/blue UI accents, floating ornaments, and fake UI evidence; natural color in the supplied photograph stays intact.
- **Layout paradigm:** long-form, left-aligned editorial sections with a persistent slim navigation, offset media/text pairings, and strong section numbering; use grids only where comparing actual project or work records helps.
- **Signature elements:** a compact `M.` monogram paired with a precise wordmark; thin warm-metal section rules; a small fixed scroll-progress cue that echoes the hero sequence without distracting from it.
- **Interaction philosophy:** interactions expose useful work, controls, or contact paths; keyboard focus and touch targets stay obvious. Admin forms show clear save, validation, upload, and error states.
- **Animation:** the 300-frame canvas follows scroll progress after preloading; use small opacity/position reveals for sections and avoid ambient or looping effects. Respect `prefers-reduced-motion` with a static key frame and reduced transitions.
- **Typography system:** one Poppins family (local package), using weight, size, line length, and tracking for hierarchy. Keep body copy readable with relaxed line height; reserve uppercase tracking for short labels.
- **Brand essence:** Manisha's editable home for selected work and professional background; candid, composed, capable.
- **Brand voice:** short, concrete, uninflated. Example: “A few things I’ve made.” / “Have a project in mind? Let’s talk.”
- **Wordmark & logo:** a custom inline `M.` mark with a single cut/line detail, paired with a spaced MANISHA wordmark; use the same mark for favicon and app icon.
- **Signature brand color:** warm sand `#D9B780`, used sparingly for active states and small labels.

## Project structure
- `src/app`: public home, projects/writeups detail routes, admin sign-in/dashboard routes, contact and analytics APIs, metadata, sitemap, and robots routes.
- `src/components/hero`: canvas sequence, text story overlays, and frame-loading state.
- `src/components/sections`: editable public profile, work, skills, evidence, and contact sections.
- `src/components/admin`: dashboard navigation, forms, content editors, inbox, and upload controls.
- `src/components/ui` and `src/components/layout`: shared responsive links, buttons, reveal primitives, navigation, footer, and media.
- `src/lib`: typed Supabase clients, Auth/RLS checks, seed fallback, data reads, validations, and guarded server actions.
- `public/hero-frames`: desktop WebP frames and optimized mobile WebP subset with a manifest.
- `public/manus-routes.json`: complete public/admin route inventory, excluding API routes.
- `supabase/migrations`: versioned, additive `manisha_*` schema, RLS policies, contact data, and isolated Storage configuration.
- `scripts`: repeatable frame conversion/manifest tooling and optional seed setup.
