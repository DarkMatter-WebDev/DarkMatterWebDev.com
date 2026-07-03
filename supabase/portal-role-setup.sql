-- Dark Matter portal role helpers and setup notes.
-- Run these helpers in the dedicated Dark Matter / Surette Data Systems Supabase project.
-- Prefer app_metadata.portal_role (legacy app_metadata.role still supported):
--   Owner:  { "portal_role": "super_admin" }
--   Sean:   { "portal_role": "sean_ads_admin" }

create extension if not exists pgcrypto;

create or replace function public.portal_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    auth.jwt() -> 'app_metadata' ->> 'portal_role',
    auth.jwt() -> 'app_metadata' ->> 'role',
    ''
  );
$$;

create or replace function public.is_portal_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.portal_role() = 'super_admin';
$$;

create or replace function public.is_portal_sean_ads_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.portal_role() in ('super_admin', 'sean_ads_admin');
$$;

grant execute on function public.portal_role() to authenticated;
grant execute on function public.is_portal_super_admin() to authenticated;
grant execute on function public.is_portal_sean_ads_admin() to authenticated;

-- Newsletter subscriber source for the owner-only Subscribers table.
-- Homepage email captures should write here. New portal account signups are
-- mirrored here by handle_new_portal_user() so every new account signup also
-- starts as a newsletter subscriber. Account holders and subscribers remain
-- separate lists: deleting from this table does not delete the portal account,
-- and deleting a portal account does not delete the subscriber row.
create table if not exists public.homepage_email_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  display_name text,
  full_name text,
  name text,
  company_name text,
  company text,
  phone text,
  source text not null default 'homepage_newsletter',
  page text,
  origin text,
  status text not null default 'Newsletter subscriber',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists homepage_email_signups_email_key
on public.homepage_email_signups (lower(email));

alter table public.homepage_email_signups enable row level security;

drop policy if exists "Super admins can read homepage email signups" on public.homepage_email_signups;
create policy "Super admins can read homepage email signups"
on public.homepage_email_signups
for select
to authenticated
using (public.is_portal_super_admin());

drop policy if exists "Anyone can submit homepage email signups" on public.homepage_email_signups;
create policy "Anyone can submit homepage email signups"
on public.homepage_email_signups
for insert
to anon, authenticated
with check (
  email is not null
  and length(trim(email)) between 3 and 320
  and source = 'homepage_newsletter'
);

grant insert on public.homepage_email_signups to anon, authenticated;
grant select on public.homepage_email_signups to authenticated;

alter table public.client_profiles add column if not exists company_name text;
alter table public.client_profiles add column if not exists website text;
alter table public.client_profiles add column if not exists portal_role text;

-- Account request/message center.
-- Client account requests now write to client_messages instead of Netlify Forms.
create table if not exists public.client_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  client_email text,
  sender_name text,
  sender_email text,
  sender_phone text,
  request_type text,
  subject text not null,
  body text,
  details text,
  status text not null default 'New',
  source text,
  page_url text,
  metadata jsonb not null default '{}'::jsonb,
  attachments jsonb not null default '[]'::jsonb,
  direction text not null default 'client_to_admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.client_messages alter column user_id drop not null;
alter table public.client_messages add column if not exists client_email text;
alter table public.client_messages add column if not exists sender_name text;
alter table public.client_messages add column if not exists sender_email text;
alter table public.client_messages add column if not exists sender_phone text;
alter table public.client_messages add column if not exists request_type text;
alter table public.client_messages add column if not exists subject text;
alter table public.client_messages add column if not exists body text;
alter table public.client_messages add column if not exists details text;
alter table public.client_messages add column if not exists status text not null default 'New';
alter table public.client_messages add column if not exists source text;
alter table public.client_messages add column if not exists page_url text;
alter table public.client_messages add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.client_messages add column if not exists attachments jsonb not null default '[]'::jsonb;
alter table public.client_messages add column if not exists direction text not null default 'client_to_admin';
alter table public.client_messages add column if not exists created_at timestamptz not null default now();
alter table public.client_messages add column if not exists updated_at timestamptz not null default now();

create index if not exists client_messages_user_id_created_at_idx
on public.client_messages (user_id, created_at desc);

alter table public.client_messages enable row level security;

drop policy if exists "Clients and super admins can read portal messages" on public.client_messages;
create policy "Clients and super admins can read portal messages"
on public.client_messages
for select
to authenticated
using (auth.uid() = user_id or public.is_portal_super_admin());

drop policy if exists "Clients can create own portal messages" on public.client_messages;
create policy "Clients can create own portal messages"
on public.client_messages
for insert
to authenticated
with check (auth.uid() = user_id);

grant select, insert on public.client_messages to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portal-message-attachments',
  'portal-message-attachments',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can upload portal message attachments" on storage.objects;
create policy "Anyone can upload portal message attachments"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'portal-message-attachments'
  and (storage.foldername(name))[1] = 'public-form-uploads'
);

drop policy if exists "Super admins can read portal message attachments" on storage.objects;
create policy "Super admins can read portal message attachments"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'portal-message-attachments'
  and public.is_portal_super_admin()
);

create or replace function public.submit_portal_message(
  portal_request_type text,
  message_subject text,
  message_details text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_message_id uuid;
  clean_subject text := trim(coalesce(message_subject, ''));
  clean_details text := trim(coalesce(message_details, ''));
begin
  if auth.uid() is null then
    raise exception 'Signed-in session required' using errcode = '42501';
  end if;

  if clean_subject = '' or clean_details = '' then
    raise exception 'Subject and details are required' using errcode = '22023';
  end if;

  insert into public.client_messages (
    user_id,
    client_email,
    request_type,
    subject,
    body,
    details,
    status,
    direction,
    created_at,
    updated_at
  )
  values (
    auth.uid(),
    auth.jwt() ->> 'email',
    nullif(trim(coalesce(portal_request_type, '')), ''),
    clean_subject,
    clean_details,
    clean_details,
    'New',
    'client_to_admin',
    now(),
    now()
  )
  returning id into new_message_id;

  return new_message_id;
end;
$$;

revoke all on function public.submit_portal_message(text, text, text) from public;
grant execute on function public.submit_portal_message(text, text, text) to authenticated;

create or replace function public.submit_site_message(
  form_source text,
  request_type text,
  message_subject text,
  message_body text,
  sender_name text default '',
  sender_email text default '',
  sender_phone text default '',
  page_url text default '',
  metadata jsonb default '{}'::jsonb,
  attachments jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_message_id uuid;
  clean_subject text := trim(coalesce(message_subject, ''));
  clean_body text := trim(coalesce(message_body, ''));
  clean_email text := lower(trim(coalesce(sender_email, '')));
begin
  if clean_subject = '' then
    clean_subject := 'Website message';
  end if;

  if clean_body = '' then
    raise exception 'Message details are required' using errcode = '22023';
  end if;

  insert into public.client_messages (
    user_id,
    client_email,
    sender_name,
    sender_email,
    sender_phone,
    request_type,
    subject,
    body,
    details,
    status,
    source,
    page_url,
    metadata,
    attachments,
    direction,
    created_at,
    updated_at
  )
  values (
    auth.uid(),
    coalesce(nullif(clean_email, ''), auth.jwt() ->> 'email'),
    nullif(trim(coalesce(sender_name, '')), ''),
    nullif(clean_email, ''),
    nullif(trim(coalesce(sender_phone, '')), ''),
    nullif(trim(coalesce(request_type, 'Website message')), ''),
    clean_subject,
    clean_body,
    clean_body,
    'New',
    nullif(trim(coalesce(form_source, 'site-form')), ''),
    nullif(trim(coalesce(page_url, '')), ''),
    coalesce(metadata, '{}'::jsonb),
    coalesce(attachments, '[]'::jsonb),
    case when auth.uid() is null then 'site_to_admin' else 'client_to_admin' end,
    now(),
    now()
  )
  returning id into new_message_id;

  return new_message_id;
end;
$$;

revoke all on function public.submit_site_message(text, text, text, text, text, text, text, text, jsonb, jsonb) from public;
grant execute on function public.submit_site_message(text, text, text, text, text, text, text, text, jsonb, jsonb) to anon, authenticated;

-- Keep public portal profile rows connected to new Supabase Auth signups.
-- The account form writes display_name and phone into auth user metadata; this
-- trigger mirrors those non-secret fields into client_profiles for dashboard use.
create or replace function public.handle_new_portal_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.client_profiles (user_id, display_name, phone, created_at)
  values (
    new.id,
    nullif(coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', ''), ''),
    nullif(coalesce(new.raw_user_meta_data ->> 'phone', ''), ''),
    coalesce(new.created_at, now())
  )
  on conflict (user_id) do update
    set
      display_name = coalesce(public.client_profiles.display_name, excluded.display_name),
      phone = coalesce(public.client_profiles.phone, excluded.phone);

  if new.email is not null then
    insert into public.homepage_email_signups (
      email,
      display_name,
      full_name,
      name,
      phone,
      source,
      origin,
      status,
      submitted_at,
      created_at,
      updated_at
    )
    values (
      new.email::text,
      nullif(coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', ''), ''),
      nullif(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'display_name', ''), ''),
      nullif(coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', ''), ''),
      nullif(coalesce(new.raw_user_meta_data ->> 'phone', ''), ''),
      'portal_account',
      'Client portal account signup',
      'Newsletter subscriber',
      coalesce(new.created_at, now()),
      coalesce(new.created_at, now()),
      now()
    )
    on conflict ((lower(email))) do update
      set
        display_name = coalesce(public.homepage_email_signups.display_name, excluded.display_name),
        full_name = coalesce(public.homepage_email_signups.full_name, excluded.full_name),
        name = coalesce(public.homepage_email_signups.name, excluded.name),
        phone = coalesce(public.homepage_email_signups.phone, excluded.phone),
        source = case
          when public.homepage_email_signups.source = excluded.source then public.homepage_email_signups.source
          else concat_ws(' + ', public.homepage_email_signups.source, excluded.source)
        end,
        origin = coalesce(public.homepage_email_signups.origin, excluded.origin),
        status = 'Newsletter subscriber',
        updated_at = now();
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_portal_profile on auth.users;
create trigger on_auth_user_created_portal_profile
after insert on auth.users
for each row execute function public.handle_new_portal_user();

-- Intentional: no automatic backfill from existing auth.users here.
-- Re-running this setup file should not re-add subscriber rows that an owner
-- deliberately deleted from homepage_email_signups. If a one-time import of
-- existing account emails is needed, do it manually and only for the desired rows.


-- Super-admin dashboard account holder list.
-- This safely exposes auth account metadata to authenticated super admins only.
-- The browser should call `supabase.rpc('list_portal_account_holders')`;
-- never expose a service-role key in frontend code.
create or replace function public.list_portal_account_holders()
returns table (
  user_id uuid,
  email text,
  display_name text,
  phone text,
  company_name text,
  website text,
  portal_role text,
  created_at timestamptz,
  confirmed_at timestamptz,
  last_sign_in_at timestamptz
)
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    u.id as user_id,
    u.email::text as email,
    coalesce(cp.display_name, u.raw_user_meta_data ->> 'display_name', u.raw_user_meta_data ->> 'full_name', '') as display_name,
    coalesce(cp.phone, u.raw_user_meta_data ->> 'phone', '') as phone,
    coalesce(cp.company_name, '') as company_name,
    coalesce(cp.website, '') as website,
    coalesce(
      u.raw_app_meta_data ->> 'portal_role',
      u.raw_app_meta_data ->> 'role',
      cp.portal_role,
      ''
    ) as portal_role,
    u.created_at,
    u.confirmed_at,
    u.last_sign_in_at
  from auth.users u
  left join public.client_profiles cp on cp.user_id = u.id
  where public.is_portal_super_admin()
  order by u.created_at desc;
$$;

revoke all on function public.list_portal_account_holders() from public;
grant execute on function public.list_portal_account_holders() to authenticated;

drop function if exists public.list_portal_messages();

create or replace function public.list_portal_messages()
returns table (
  id uuid,
  user_id uuid,
  email text,
  display_name text,
  phone text,
  request_type text,
  subject text,
  body text,
  status text,
  source text,
  page_url text,
  metadata jsonb,
  attachments jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    m.id,
    m.user_id,
    coalesce(m.sender_email, m.client_email, u.email::text, '') as email,
    coalesce(m.sender_name, cp.display_name, u.raw_user_meta_data ->> 'display_name', u.raw_user_meta_data ->> 'full_name', '') as display_name,
    coalesce(m.sender_phone, cp.phone, u.raw_user_meta_data ->> 'phone', '') as phone,
    coalesce(m.request_type, 'Request') as request_type,
    coalesce(m.subject, 'Message') as subject,
    coalesce(m.body, m.details, '') as body,
    coalesce(m.status, 'New') as status,
    coalesce(m.source, m.direction, '') as source,
    coalesce(m.page_url, '') as page_url,
    coalesce(m.metadata, '{}'::jsonb) as metadata,
    coalesce(m.attachments, '[]'::jsonb) as attachments,
    m.created_at,
    m.updated_at
  from public.client_messages m
  left join auth.users u on u.id = m.user_id
  left join public.client_profiles cp on cp.user_id = m.user_id
  where public.is_portal_super_admin()
  order by m.created_at desc;
$$;

revoke all on function public.list_portal_messages() from public;
grant execute on function public.list_portal_messages() to authenticated;

create or replace function public.delete_portal_message(target_message_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_portal_super_admin() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  if target_message_id is null then
    raise exception 'Message id is required' using errcode = '22023';
  end if;

  delete from public.client_messages
  where id = target_message_id;
end;
$$;

revoke all on function public.delete_portal_message(uuid) from public;
grant execute on function public.delete_portal_message(uuid) to authenticated;

create or replace function public.delete_newsletter_subscriber(target_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_email text := lower(trim(coalesce(target_email, '')));
begin
  if not public.is_portal_super_admin() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  if normalized_email = '' then
    raise exception 'Subscriber email is required' using errcode = '22023';
  end if;

  delete from public.homepage_email_signups
  where lower(email) = normalized_email;
end;
$$;

revoke all on function public.delete_newsletter_subscriber(text) from public;
grant execute on function public.delete_newsletter_subscriber(text) to authenticated;

create or replace function public.delete_portal_account_holder(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_email text;
begin
  if not public.is_portal_super_admin() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  if target_user_id is null then
    raise exception 'Account user id is required' using errcode = '22023';
  end if;

  if auth.uid() = target_user_id then
    raise exception 'Cannot delete the signed-in owner account' using errcode = '42501';
  end if;

  select u.email::text
  into target_email
  from auth.users u
  where u.id = target_user_id;

  if target_email is null then
    raise exception 'Account holder not found' using errcode = '02000';
  end if;

  if to_regclass('public.client_messages') is not null then
    execute 'delete from public.client_messages where user_id = $1' using target_user_id;
  end if;

  if to_regclass('public.client_documents') is not null then
    execute 'delete from public.client_documents where user_id = $1' using target_user_id;
  end if;

  if to_regclass('public.client_invoices') is not null then
    execute 'delete from public.client_invoices where user_id = $1' using target_user_id;
  end if;

  if to_regclass('public.client_services') is not null then
    execute 'delete from public.client_services where user_id = $1' using target_user_id;
  end if;

  if to_regclass('public.client_billing') is not null then
    execute 'delete from public.client_billing where user_id = $1' using target_user_id;
  end if;

  if to_regclass('public.client_website_status') is not null then
    execute 'delete from public.client_website_status where user_id = $1' using target_user_id;
  end if;

  if to_regclass('public.client_website_stats') is not null then
    execute 'delete from public.client_website_stats where user_id = $1' using target_user_id;
  end if;

  if to_regclass('public.client_profiles') is not null then
    execute 'delete from public.client_profiles where user_id = $1' using target_user_id;
  end if;

  delete from auth.users
  where id = target_user_id;
end;
$$;

revoke all on function public.delete_portal_account_holder(uuid) from public;
grant execute on function public.delete_portal_account_holder(uuid) to authenticated;
