-- Rename legacy role `agent` to `vendor` (run once in Supabase SQL editor)
-- After this, application code expects profiles.role = 'vendor' for marketplace sellers.

UPDATE public.profiles SET role = 'vendor' WHERE role = 'agent';

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('customer', 'admin', 'vendor'));
