-- Run this whole file once in the Supabase SQL editor for a fresh project.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user, created automatically on signup
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are viewable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles are editable by their owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- projects: the catalog of things for sale
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  thumbnail_url text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'usd',
  summary text not null default '',
  marketing_plan_preview text not null default '',
  marketing_plan_full text not null default '',
  deliverable_path text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe to re-run: adds the column to a projects table that already existed
-- before deliverable_path was introduced.
alter table public.projects add column if not exists deliverable_path text;

alter table public.projects enable row level security;

create policy "published projects are viewable by everyone"
  on public.projects for select
  using (is_published = true or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.is_admin
  ));

create policy "admins can insert projects"
  on public.projects for insert
  with check (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.is_admin
  ));

create policy "admins can update projects"
  on public.projects for update
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.is_admin
  ));

create policy "admins can delete projects"
  on public.projects for delete
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.is_admin
  ));

create index if not exists projects_search_idx
  on public.projects using gin (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(summary, ''))
  );

-- ---------------------------------------------------------------------------
-- purchases: one row per completed Stripe checkout
-- ---------------------------------------------------------------------------
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  stripe_session_id text unique,
  amount_cents integer not null,
  status text not null default 'completed',
  created_at timestamptz not null default now(),
  unique (user_id, project_id)
);

alter table public.purchases enable row level security;

create policy "users can view their own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

-- No insert/update/delete policies for regular users: purchases are only
-- ever written by the Stripe webhook handler, which uses the service-role
-- key and therefore bypasses RLS entirely.

-- ---------------------------------------------------------------------------
-- Storage bucket for project thumbnails
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

create policy "thumbnails are publicly readable"
  on storage.objects for select
  using (bucket_id = 'thumbnails');

create policy "admins can upload thumbnails"
  on storage.objects for insert
  with check (
    bucket_id = 'thumbnails'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

create policy "admins can update thumbnails"
  on storage.objects for update
  using (
    bucket_id = 'thumbnails'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- ---------------------------------------------------------------------------
-- Private storage bucket for the actual project deliverables (zips).
-- Not public: buyers only ever get a short-lived signed URL, generated
-- server-side after the download route confirms they have a purchase row
-- for that project. There is deliberately no public/authenticated select
-- policy here — the download route uses the service-role key, which
-- bypasses RLS entirely, so no client-facing read path exists.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('deliverables', 'deliverables', false)
on conflict (id) do nothing;

create policy "admins can upload deliverables"
  on storage.objects for insert
  with check (
    bucket_id = 'deliverables'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

create policy "admins can update deliverables"
  on storage.objects for update
  using (
    bucket_id = 'deliverables'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- ---------------------------------------------------------------------------
-- Make yourself an admin after signing up once, e.g.:
--   update public.profiles set is_admin = true where email = 'you@example.com';
-- ---------------------------------------------------------------------------
