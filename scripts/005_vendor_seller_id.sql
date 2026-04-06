-- Vendor / seller ownership on catalog (run in Supabase SQL after 001–003)
-- Links products to marketplace sellers (profiles with role = 'vendor').

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products(seller_id);

COMMENT ON COLUMN public.products.seller_id IS 'Marketplace vendor (profile id); NULL = platform-owned listing.';

-- Optional RLS examples (enable RLS on products first if you use it):
-- CREATE POLICY "vendors_select_own_products" ON public.products FOR SELECT TO authenticated
--   USING (seller_id IS NULL OR seller_id = auth.uid() OR EXISTS (
--     SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
--   ));
