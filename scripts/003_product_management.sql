-- Product management expansion (run in Supabase SQL editor after 001/002)
-- Adds catalog fields, tags, variants, stock history, and product relations.

-- ---------------------------------------------------------------------------
-- PRODUCTS: new columns
-- ---------------------------------------------------------------------------
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sku TEXT,
  ADD COLUMN IF NOT EXISTS barcode TEXT,
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS cost_price DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS tax_class TEXT DEFAULT 'standard' CHECK (tax_class IN ('standard', 'exempt', 'zero')),
  ADD COLUMN IF NOT EXISTS minimum_price DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5,
  ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock', 'on_backorder')),
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS og_image TEXT,
  ADD COLUMN IF NOT EXISTS canonical_url TEXT,
  ADD COLUMN IF NOT EXISTS featured_image_index INTEGER DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku_unique ON public.products(sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_sort ON public.products(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_sku_search ON public.products(sku);

-- ---------------------------------------------------------------------------
-- TAGS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_tags (
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON public.product_tags(tag_id);

-- ---------------------------------------------------------------------------
-- PRODUCT VARIANTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT,
  title TEXT NOT NULL DEFAULT '',
  attributes JSONB DEFAULT '{}',
  price DECIMAL(12, 2) NOT NULL,
  compare_price DECIMAL(12, 2),
  stock INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_variants_sku_unique ON public.product_variants(sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);

-- ---------------------------------------------------------------------------
-- STOCK MOVEMENTS (audit trail)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  qty_delta INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('adjustment', 'sale', 'return', 'import', 'duplicate', 'initial')),
  ref TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_mov_product ON public.product_stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_mov_created ON public.product_stock_movements(created_at DESC);

-- ---------------------------------------------------------------------------
-- RELATED / UPSELL
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_relations (
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  related_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL CHECK (relation_type IN ('related', 'upsell')),
  PRIMARY KEY (product_id, related_product_id, relation_type),
  CONSTRAINT product_relations_no_self CHECK (product_id <> related_product_id)
);

CREATE INDEX IF NOT EXISTS idx_product_relations_related ON public.product_relations(related_product_id);

-- ---------------------------------------------------------------------------
-- Decrement product stock when an order is placed (one unit per order row)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.trg_orders_decrement_product_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(0, stock - 1), updated_at = NOW()
  WHERE id = NEW.product_id;

  INSERT INTO public.product_stock_movements (product_id, qty_delta, reason, ref)
  VALUES (NEW.product_id, -1, 'sale', NEW.id::text);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_orders_product_stock ON public.orders;
CREATE TRIGGER trg_orders_product_stock
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.trg_orders_decrement_product_stock();
