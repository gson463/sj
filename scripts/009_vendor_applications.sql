-- Seller self-service applications (run in Supabase SQL Editor)

CREATE TABLE IF NOT EXISTS public.vendor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS vendor_applications_one_pending_per_user
  ON public.vendor_applications (user_id)
  WHERE status = 'pending';

ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vendor_applications_select" ON public.vendor_applications;
CREATE POLICY "vendor_applications_select"
  ON public.vendor_applications FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "vendor_applications_insert_customer" ON public.vendor_applications;
CREATE POLICY "vendor_applications_insert_customer"
  ON public.vendor_applications FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'customer')
  );

DROP POLICY IF EXISTS "vendor_applications_update_admin" ON public.vendor_applications;
CREATE POLICY "vendor_applications_update_admin"
  ON public.vendor_applications FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Allow admins to promote users to vendor when approving applications
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
