-- Dark Matter portal role helpers and setup notes.
-- Live Naples/Estate Jewelry project already has these functions installed.
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
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '');
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
