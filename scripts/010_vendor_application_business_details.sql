-- Extended business data for seller verification (run after 009_vendor_applications.sql)

ALTER TABLE public.vendor_applications
ADD COLUMN IF NOT EXISTS business_details JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.vendor_applications.business_details IS
  'Structured business verification fields: type, TIN, address, email, categories, etc.';
