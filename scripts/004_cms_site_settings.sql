-- CMS: site-wide content editable by admin (auth modal promo image, etc.)
-- Run in Supabase SQL editor after previous migrations.

CREATE TABLE IF NOT EXISTS public.cms_site_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  auth_modal_ad_image_url TEXT,
  auth_modal_ad_link_url TEXT,
  auth_modal_ad_alt TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.cms_site_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.cms_site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read (for storefront auth modal)
CREATE POLICY "cms_site_settings_select_public"
  ON public.cms_site_settings
  FOR SELECT
  USING (true);

-- Only admins can update
CREATE POLICY "cms_site_settings_update_admin"
  ON public.cms_site_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "cms_site_settings_insert_admin"
  ON public.cms_site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

COMMENT ON TABLE public.cms_site_settings IS 'Singleton (id=1) site CMS fields; auth modal ad shown beside login/signup.';
