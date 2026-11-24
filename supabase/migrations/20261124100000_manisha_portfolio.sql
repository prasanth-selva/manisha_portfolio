-- Manisha portfolio objects are intentionally isolated from the existing public
-- tables used by the reference portfolio in this Supabase project. This migration
-- creates only new prefixed tables, policies, a helper function, and a bucket.

create table if not exists public.manisha_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text,
  description text not null default '',
  tech text[] not null default '{}',
  cover_image text,
  gallery text[] not null default '{}',
  live_url text,
  github_url text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.manisha_experiences (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  org text not null,
  location text,
  start_date text not null,
  end_date text,
  current boolean not null default false,
  description text not null default '',
  tech text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.manisha_certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issued_on text not null default '',
  credential_url text,
  image text,
  description text,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.manisha_achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  detail text,
  occurred_on text,
  image text,
  placement text,
  organizer text,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.manisha_skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  level integer not null default 50 check (level between 1 and 100),
  description text,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.manisha_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null default '',
  tags text[] not null default '{}',
  cover_image text,
  reading_minutes integer not null default 4,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.manisha_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.manisha_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.manisha_admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists manisha_projects_public_order_idx on public.manisha_projects (published, sort_order);
create index if not exists manisha_experiences_public_order_idx on public.manisha_experiences (published, sort_order);
create index if not exists manisha_certifications_public_order_idx on public.manisha_certifications (published, sort_order);
create index if not exists manisha_achievements_public_order_idx on public.manisha_achievements (published, sort_order);
create index if not exists manisha_skills_public_order_idx on public.manisha_skills (published, sort_order);
create index if not exists manisha_posts_public_date_idx on public.manisha_posts (published, published_at desc);
create index if not exists manisha_messages_created_idx on public.manisha_messages (created_at desc);

create or replace function public.manisha_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.manisha_admin_users a
    where a.user_id = auth.uid()
  );
$$;

revoke all on function public.manisha_is_admin() from public;
grant execute on function public.manisha_is_admin() to anon, authenticated;

alter table public.manisha_projects enable row level security;
alter table public.manisha_experiences enable row level security;
alter table public.manisha_certifications enable row level security;
alter table public.manisha_achievements enable row level security;
alter table public.manisha_skills enable row level security;
alter table public.manisha_posts enable row level security;
alter table public.manisha_messages enable row level security;
alter table public.manisha_settings enable row level security;
alter table public.manisha_admin_users enable row level security;

grant select on public.manisha_projects, public.manisha_experiences,
  public.manisha_certifications, public.manisha_achievements,
  public.manisha_skills, public.manisha_posts, public.manisha_settings to anon;
grant select, insert, update, delete on public.manisha_projects, public.manisha_experiences,
  public.manisha_certifications, public.manisha_achievements,
  public.manisha_skills, public.manisha_posts, public.manisha_settings to authenticated;
grant insert on public.manisha_messages to anon, authenticated;
grant select, update, delete on public.manisha_messages to authenticated;
grant select on public.manisha_admin_users to authenticated;

-- Public readers see published rows only; an allowlisted admin can manage all rows.
drop policy if exists manisha_public_projects on public.manisha_projects;
create policy manisha_public_projects on public.manisha_projects for select to anon, authenticated using (published or public.manisha_is_admin());
drop policy if exists manisha_admin_projects on public.manisha_projects;
create policy manisha_admin_projects on public.manisha_projects for all to authenticated using (public.manisha_is_admin()) with check (public.manisha_is_admin());

drop policy if exists manisha_public_experiences on public.manisha_experiences;
create policy manisha_public_experiences on public.manisha_experiences for select to anon, authenticated using (published or public.manisha_is_admin());
drop policy if exists manisha_admin_experiences on public.manisha_experiences;
create policy manisha_admin_experiences on public.manisha_experiences for all to authenticated using (public.manisha_is_admin()) with check (public.manisha_is_admin());

drop policy if exists manisha_public_certifications on public.manisha_certifications;
create policy manisha_public_certifications on public.manisha_certifications for select to anon, authenticated using (published or public.manisha_is_admin());
drop policy if exists manisha_admin_certifications on public.manisha_certifications;
create policy manisha_admin_certifications on public.manisha_certifications for all to authenticated using (public.manisha_is_admin()) with check (public.manisha_is_admin());

drop policy if exists manisha_public_achievements on public.manisha_achievements;
create policy manisha_public_achievements on public.manisha_achievements for select to anon, authenticated using (published or public.manisha_is_admin());
drop policy if exists manisha_admin_achievements on public.manisha_achievements;
create policy manisha_admin_achievements on public.manisha_achievements for all to authenticated using (public.manisha_is_admin()) with check (public.manisha_is_admin());

drop policy if exists manisha_public_skills on public.manisha_skills;
create policy manisha_public_skills on public.manisha_skills for select to anon, authenticated using (published or public.manisha_is_admin());
drop policy if exists manisha_admin_skills on public.manisha_skills;
create policy manisha_admin_skills on public.manisha_skills for all to authenticated using (public.manisha_is_admin()) with check (public.manisha_is_admin());

drop policy if exists manisha_public_posts on public.manisha_posts;
create policy manisha_public_posts on public.manisha_posts for select to anon, authenticated using (published or public.manisha_is_admin());
drop policy if exists manisha_admin_posts on public.manisha_posts;
create policy manisha_admin_posts on public.manisha_posts for all to authenticated using (public.manisha_is_admin()) with check (public.manisha_is_admin());

drop policy if exists manisha_public_settings on public.manisha_settings;
create policy manisha_public_settings on public.manisha_settings for select to anon, authenticated using (true);
drop policy if exists manisha_admin_settings on public.manisha_settings;
create policy manisha_admin_settings on public.manisha_settings for all to authenticated using (public.manisha_is_admin()) with check (public.manisha_is_admin());

drop policy if exists manisha_public_message_insert on public.manisha_messages;
create policy manisha_public_message_insert on public.manisha_messages for insert to anon, authenticated with check (
  char_length(name) between 1 and 120 and
  char_length(email) between 3 and 254 and
  char_length(body) between 1 and 5000
);
drop policy if exists manisha_admin_messages on public.manisha_messages;
create policy manisha_admin_messages on public.manisha_messages for all to authenticated using (public.manisha_is_admin()) with check (public.manisha_is_admin());

drop policy if exists manisha_admin_allowlist_read on public.manisha_admin_users;
create policy manisha_admin_allowlist_read on public.manisha_admin_users for select to authenticated using (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('manisha-media', 'manisha-media', true)
on conflict (id) do nothing;

drop policy if exists manisha_media_public_read on storage.objects;
create policy manisha_media_public_read on storage.objects for select to anon, authenticated using (bucket_id = 'manisha-media');
drop policy if exists manisha_media_admin_upload on storage.objects;
create policy manisha_media_admin_upload on storage.objects for insert to authenticated with check (bucket_id = 'manisha-media' and public.manisha_is_admin());
drop policy if exists manisha_media_admin_update on storage.objects;
create policy manisha_media_admin_update on storage.objects for update to authenticated using (bucket_id = 'manisha-media' and public.manisha_is_admin()) with check (bucket_id = 'manisha-media' and public.manisha_is_admin());
drop policy if exists manisha_media_admin_delete on storage.objects;
create policy manisha_media_admin_delete on storage.objects for delete to authenticated using (bucket_id = 'manisha-media' and public.manisha_is_admin());
