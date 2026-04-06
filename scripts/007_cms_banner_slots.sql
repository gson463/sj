-- CMS banner slots (JSON) + Storage bucket for direct uploads
-- Run in Supabase SQL after 004_cms_site_settings.sql

ALTER TABLE public.cms_site_settings
  ADD COLUMN IF NOT EXISTS banner_slots JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.cms_site_settings.banner_slots IS
  'Keyed banner ads: auth_modal, home_hero_wide, home_promo_left, home_promo_right, shop_top, about_top — each { image_url, link_url, alt, enabled }.';

-- ---------------------------------------------------------------------------
-- Storage: public bucket `cms` for CMS images (admin upload only)
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cms',
  'cms',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read
DROP POLICY IF EXISTS "cms objects public read" ON storage.objects;
CREATE POLICY "cms objects public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cms');

-- Admin write
DROP POLICY IF EXISTS "cms objects admin insert" ON storage.objects;
CREATE POLICY "cms objects admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'cms'
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "cms objects admin update" ON storage.objects;
CREATE POLICY "cms objects admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'cms'
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    bucket_id = 'cms'
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "cms objects admin delete" ON storage.objects;
CREATE POLICY "cms objects admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'cms'
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );
