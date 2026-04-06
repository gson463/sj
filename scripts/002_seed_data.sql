-- SIMU JIJI Seed Data
-- ====================

-- Insert Categories
INSERT INTO public.categories (id, name, slug, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Smartphones', 'smartphones', 'Latest smartphones from top brands'),
  ('22222222-2222-2222-2222-222222222222', 'Feature Phones', 'feature-phones', 'Affordable basic phones'),
  ('33333333-3333-3333-3333-333333333333', 'Tablets', 'tablets', 'Tablets and iPads'),
  ('44444444-4444-4444-4444-444444444444', 'Accessories', 'accessories', 'Phone cases, chargers, and more')
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Products
INSERT INTO public.products (name, slug, description, price, compare_price, category_id, brand, stock, specs, images, featured) VALUES
  (
    'Samsung Galaxy A54 5G',
    'samsung-galaxy-a54-5g',
    'Experience next-level connectivity with Samsung Galaxy A54 5G. Featuring a stunning 6.4" Super AMOLED display, powerful Exynos 1380 processor, and impressive 50MP triple camera system.',
    850000,
    950000,
    '11111111-1111-1111-1111-111111111111',
    'Samsung',
    15,
    '{"ram": "8GB", "storage": "256GB", "battery": "5000mAh", "display": "6.4 inch Super AMOLED", "camera": "50MP + 12MP + 5MP"}',
    ARRAY['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'],
    true
  ),
  (
    'iPhone 15',
    'iphone-15',
    'The iPhone 15 features the powerful A16 Bionic chip, Dynamic Island, and a 48MP main camera. Experience iOS at its finest with all-day battery life.',
    2200000,
    2400000,
    '11111111-1111-1111-1111-111111111111',
    'Apple',
    10,
    '{"ram": "6GB", "storage": "128GB", "battery": "3349mAh", "display": "6.1 inch Super Retina XDR", "camera": "48MP + 12MP"}',
    ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500'],
    true
  ),
  (
    'Tecno Spark 20 Pro+',
    'tecno-spark-20-pro-plus',
    'Tecno Spark 20 Pro+ combines style with performance. Features a 6.78" display, 108MP camera, and long-lasting 5000mAh battery.',
    380000,
    420000,
    '11111111-1111-1111-1111-111111111111',
    'Tecno',
    25,
    '{"ram": "8GB", "storage": "256GB", "battery": "5000mAh", "display": "6.78 inch IPS LCD", "camera": "108MP + 2MP"}',
    ARRAY['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'],
    true
  ),
  (
    'Infinix Hot 40 Pro',
    'infinix-hot-40-pro',
    'The Infinix Hot 40 Pro delivers premium features at an affordable price. 108MP camera, 6.78" FHD+ display, and MediaTek Helio G99.',
    320000,
    350000,
    '11111111-1111-1111-1111-111111111111',
    'Infinix',
    30,
    '{"ram": "8GB", "storage": "256GB", "battery": "5000mAh", "display": "6.78 inch IPS LCD", "camera": "108MP"}',
    ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'],
    true
  ),
  (
    'Xiaomi Redmi Note 13',
    'xiaomi-redmi-note-13',
    'Redmi Note 13 offers incredible value with its 6.67" AMOLED display, 108MP camera, and Snapdragon processor.',
    420000,
    480000,
    '11111111-1111-1111-1111-111111111111',
    'Xiaomi',
    20,
    '{"ram": "8GB", "storage": "128GB", "battery": "5000mAh", "display": "6.67 inch AMOLED", "camera": "108MP + 8MP + 2MP"}',
    ARRAY['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'],
    true
  ),
  (
    'Samsung Galaxy S24 Ultra',
    'samsung-galaxy-s24-ultra',
    'The ultimate Samsung flagship. Galaxy AI, 200MP camera, S Pen included, titanium frame, and stunning 6.8" Dynamic AMOLED display.',
    3500000,
    3800000,
    '11111111-1111-1111-1111-111111111111',
    'Samsung',
    5,
    '{"ram": "12GB", "storage": "512GB", "battery": "5000mAh", "display": "6.8 inch Dynamic AMOLED 2X", "camera": "200MP + 50MP + 12MP + 10MP"}',
    ARRAY['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'],
    true
  ),
  (
    'Nokia 105',
    'nokia-105',
    'Reliable Nokia 105 feature phone. Long battery life, FM radio, flashlight, and Snake game included.',
    35000,
    40000,
    '22222222-2222-2222-2222-222222222222',
    'Nokia',
    100,
    '{"battery": "800mAh", "display": "1.77 inch", "sim": "Dual SIM"}',
    ARRAY['https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=500'],
    false
  ),
  (
    'Itel it2163',
    'itel-it2163',
    'Budget-friendly Itel feature phone with dual SIM, big battery, and essential features for everyday use.',
    25000,
    30000,
    '22222222-2222-2222-2222-222222222222',
    'Itel',
    80,
    '{"battery": "1000mAh", "display": "1.77 inch", "sim": "Dual SIM"}',
    ARRAY['https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=500'],
    false
  ),
  (
    'iPad 10th Generation',
    'ipad-10th-gen',
    'The all-new iPad with A14 Bionic chip, 10.9" Liquid Retina display, and support for Apple Pencil.',
    1200000,
    1350000,
    '33333333-3333-3333-3333-333333333333',
    'Apple',
    8,
    '{"ram": "4GB", "storage": "64GB", "battery": "28.6Wh", "display": "10.9 inch Liquid Retina"}',
    ARRAY['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'],
    true
  ),
  (
    'Samsung Galaxy Tab A9+',
    'samsung-galaxy-tab-a9-plus',
    'Samsung Galaxy Tab A9+ offers a large 11" display, powerful processor, and great value for entertainment and productivity.',
    550000,
    620000,
    '33333333-3333-3333-3333-333333333333',
    'Samsung',
    12,
    '{"ram": "4GB", "storage": "64GB", "battery": "7040mAh", "display": "11 inch TFT LCD"}',
    ARRAY['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500'],
    false
  ),
  (
    'Phone Case - Universal',
    'phone-case-universal',
    'Premium quality universal phone case. Shock-proof design with stylish look.',
    15000,
    20000,
    '44444444-4444-4444-4444-444444444444',
    'Generic',
    200,
    '{"material": "TPU + PC", "compatible": "Most smartphones"}',
    ARRAY['https://images.unsplash.com/photo-1601593346740-925612772716?w=500'],
    false
  ),
  (
    'Fast Charger 65W',
    'fast-charger-65w',
    '65W fast charger compatible with most smartphones and tablets. Quick charge your device in minutes.',
    45000,
    55000,
    '44444444-4444-4444-4444-444444444444',
    'Generic',
    50,
    '{"power": "65W", "ports": "USB-C + USB-A", "compatible": "Universal"}',
    ARRAY['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500'],
    false
  )
ON CONFLICT (slug) DO NOTHING;
