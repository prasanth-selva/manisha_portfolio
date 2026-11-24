# Manisha Portfolio

A responsive Next.js portfolio with a canvas-based frame-sequence hero, Supabase-backed public content, and an allowlisted admin area.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS, and Framer Motion
- Supabase Auth, Postgres with row-level security, and Supabase Storage
- 300 desktop WebP hero frames and a 48-frame mobile sequence in `public/hero-frames/`

## Local development

1. Use Node.js 20.9 or newer and install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local`, then set the project URL and browser-safe publishable key from Supabase.
3. Start the app with `npm run dev` and open `http://localhost:3000`.
4. Use `npm run typecheck`, `npm run lint`, and `npm run build` for checks.

Never put a Supabase service-role key in this project or in a browser-exposed environment variable. The app deliberately uses session-bound/publishable clients and relies on database RLS.

## Supabase setup

The migration at `supabase/migrations/20261124100000_manisha_portfolio.sql` creates only `manisha_*` tables, the `manisha_is_admin()` helper, and the `manisha-media` storage bucket. It is intentionally separate from any unprefixed tables in the project. Apply the migration before expecting database-backed pages or uploads to work.

### Create the first admin

There is no public sign-up page. In the Supabase Dashboard, invite/create the intended admin user under **Authentication → Users**. After that user exists, run a one-time SQL insert, replacing the email with the exact authenticated account email:

```sql
insert into public.manisha_admin_users (user_id, email)
select id, lower(email)
from auth.users
where lower(email) = lower('admin@example.com')
on conflict (user_id) do nothing;
```

Only users in `manisha_admin_users` can access the admin area or mutate portfolio content. For the strongest setup, disable public self-signup in Supabase Auth settings and invite admins explicitly.

## Admin area

Sign in at `/admin/login`. The dashboard manages projects, experience, certifications, achievements, skills, writeups, resume/profile settings, uploaded media, and contact inbox messages. Public visitors can submit the contact form; reading or deleting messages requires admin authorization.

The **Admin → Settings** form includes the display name, student headline, college/institution, About biography, profile photo, GitHub and LinkedIn URLs, and optional contact/SEO fields. The prefilled identity values in this repository are the details supplied for Manisha Nithya and can all be edited there.

Settings, contact messages, media assets, and admin access are stored in the separate Manisha namespace. Do not store credentials or other secrets in public portfolio settings.

## Hero frames

The source PNGs were converted to WebP without changing their 1280×720 dimensions. The 300-frame desktop set is approximately 28.2 MiB, compared with approximately 281.4 MiB of PNGs. A 48-frame subset is provided for mobile. `scripts/convert-hero-frames.py` describes the repeatable conversion, including manifest generation; original PNGs are not required at runtime.

## Deployment

This repository is configured for a Next.js server runtime. Add the two public Supabase environment values in the hosting provider, apply the SQL migration, and configure at least one admin account using the procedure above. Deployment is intentionally not performed as part of this handoff.
