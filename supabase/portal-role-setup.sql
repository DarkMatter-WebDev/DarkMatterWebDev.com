-- Dark Matter portal role helpers and setup notes.
-- Run these helpers in the dedicated Dark Matter / Surette Data Systems Supabase project.
-- Prefer app_metadata.portal_role (legacy app_metadata.role still supported):
--   Owner:  { "portal_role": "super_admin" }
--   Sean:   { "portal_role": "sean_ads_admin" }

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
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_portal_profile on auth.users;
create trigger on_auth_user_created_portal_profile
after insert on auth.users
for each row execute function public.handle_new_portal_user();

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
