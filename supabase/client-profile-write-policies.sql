-- Allow authenticated clients to create and update their own profile row.
-- Run in Supabase SQL editor after client-portal-schema.sql.

drop policy if exists "Clients can insert own profile" on public.client_profiles;
drop policy if exists "Clients can update own profile" on public.client_profiles;

create policy "Clients can insert own profile"
on public.client_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Clients can update own profile"
on public.client_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
