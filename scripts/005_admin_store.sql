-- Admin: coupons + singleton store configuration (shipping, tax, gateways, email templates)
-- Run in Supabase SQL editor after 004_cms_site_settings.sql

-- ---------------------------------------------------------------------------
-- COUPONS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value DECIMAL(12, 2) NOT NULL CHECK (discount_value >= 0),
  min_order_amount DECIMAL(12, 2) DEFAULT 0,
  max_uses INTEGER CHECK (max_uses IS NULL OR max_uses >= 0),
  uses_count INTEGER NOT NULL DEFAULT 0 CHECK (uses_count >= 0),
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons (active) WHERE active = TRUE;

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coupons_select_admin"
  ON public.coupons FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "coupons_insert_admin"
  ON public.coupons FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "coupons_update_admin"
  ON public.coupons FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "coupons_delete_admin"
  ON public.coupons FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ---------------------------------------------------------------------------
-- STORE SETTINGS (singleton id = 1)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_store_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  shipping_zones JSONB NOT NULL DEFAULT '[]'::jsonb,
  shipping_methods JSONB NOT NULL DEFAULT '[]'::jsonb,
  tax_rates JSONB NOT NULL DEFAULT '[]'::jsonb,
  payment_gateways JSONB NOT NULL DEFAULT '{}'::jsonb,
  email_templates JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.admin_store_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.admin_store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_store_settings_select_admin"
  ON public.admin_store_settings FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "admin_store_settings_insert_admin"
  ON public.admin_store_settings FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "admin_store_settings_update_admin"
  ON public.admin_store_settings FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

COMMENT ON TABLE public.admin_store_settings IS 'Singleton (id=1): shipping, tax, gateways, email template JSON.';
