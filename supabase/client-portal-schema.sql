-- Dark Matter client portal starter schema.
-- Run in the Supabase SQL editor after creating the project.
-- This creates read-only client-facing tables protected by Row Level Security.

create extension if not exists pgcrypto;

create table if not exists public.client_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text,
  company_name text,
  phone text,
  website text,
  created_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.client_services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'Active',
  support_level text,
  created_at timestamptz not null default now()
);

create table if not exists public.client_billing (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_name text not null,
  billing_period text,
  status text not null default 'Active',
  next_invoice_label text,
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.client_website_status (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  site_name text not null,
  site_url text,
  health_score integer,
  uptime_status text not null default 'Monitoring',
  ssl_status text not null default 'Monitoring',
  backup_status text not null default 'Monitoring',
  update_status text not null default 'Monitoring',
  last_checked_label text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.client_website_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  site_name text not null,
  site_url text,
  period_label text not null default 'Last 30 days',
  visitors integer,
  page_views integer,
  top_page text,
  top_referrer text,
  conversion_notes text,
  source text not null default 'Manual',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.client_profiles enable row level security;
alter table public.client_services enable row level security;
alter table public.client_billing enable row level security;
alter table public.client_website_status enable row level security;
alter table public.client_website_stats enable row level security;

drop policy if exists "Clients can read own profile" on public.client_profiles;
drop policy if exists "Clients can read own services" on public.client_services;
drop policy if exists "Clients can read own billing" on public.client_billing;
drop policy if exists "Clients can read own website status" on public.client_website_status;
drop policy if exists "Clients can read own website stats" on public.client_website_stats;

create policy "Clients can read own profile"
on public.client_profiles
for select
to authenticated
using (auth.uid() = user_id);

create policy "Clients can read own services"
on public.client_services
for select
to authenticated
using (auth.uid() = user_id);

create policy "Clients can read own billing"
on public.client_billing
for select
to authenticated
using (auth.uid() = user_id);

create policy "Clients can read own website status"
on public.client_website_status
for select
to authenticated
using (auth.uid() = user_id);

create policy "Clients can read own website stats"
on public.client_website_stats
for select
to authenticated
using (auth.uid() = user_id);

create index if not exists client_services_user_id_created_at_idx
on public.client_services (user_id, created_at desc);

create index if not exists client_billing_user_id_created_at_idx
on public.client_billing (user_id, created_at desc);

create index if not exists client_website_status_user_id_created_at_idx
on public.client_website_status (user_id, created_at desc);

create index if not exists client_website_stats_user_id_updated_at_idx
on public.client_website_stats (user_id, updated_at desc);
