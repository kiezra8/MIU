-- ============================================================================
-- MIU — MADE IN UGANDA MARKETPLACE
-- DATABASE SEED DATA (AUTHENTIC UGANDAN COMMERCE)
-- ============================================================================

-- 1. Platform Settings
INSERT INTO public.platform_settings (key, value, description)
VALUES 
  ('default_commission_rate', '0.08'::jsonb, 'Default platform commission on completed sales (8%)'),
  ('support_phone', '"+256 700 123 456"'::jsonb, 'Customer support phone line in Kampala'),
  ('support_email', '"support@miu.ug"'::jsonb, 'Official support email address'),
  ('delivery_fees', '{"Kampala": 5000, "Wakiso": 7000, "Mukono": 10000, "Jinja": 15000, "Entebbe": 8000, "Mbarara": 20000, "Gulu": 25000, "Mbale": 18000, "Other": 25000}'::jsonb, 'Delivery fees by Ugandan district in UGX')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Hero Carousel Banners (Exactly 5 Slides)
INSERT INTO public.banners (title, subtitle, image_url, cta_text, cta_link, badge_text, slide_order)
VALUES
  (
    'Discover Made In Uganda',
    'Everything Ugandan, in one marketplace. Authentic products directly from local farmers, artisans, and manufacturers.',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=80',
    'Shop Marketplace',
    '/products',
    '100% Authentic Ugandan',
    1
  ),
  (
    'Ugandan Fashion & Style',
    'Explore bold Kitenge, contemporary tailoring, handcrafted accessories and footwear designed by Ugandan creators.',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
    'Explore Fashion',
    '/categories/fashion-clothing',
    'Kampala Designer Spotlight',
    2
  ),
  (
    'Local Manufacturing & Crafts',
    'Support Ugandan industrial innovation, handmade pottery, leather craftsmanship, and sustainable furniture.',
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1600&q=80',
    'View Made in Uganda',
    '/categories/home-living',
    'Built in Uganda',
    3
  ),
  (
    'Finest Food & Agriculture',
    'Direct from the Pearl of Africa: award-winning Mt. Elgon Arabica coffee, raw Rwenzori honey, premium teas and organic harvest.',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=80',
    'Taste Uganda',
    '/categories/food-beverages',
    'Farm to Table',
    4
  ),
  (
    'Sell on MIU Marketplace',
    'Expand your reach nationwide. Connect your Ugandan manufacturing, farming, or artisan business to thousands of ready buyers.',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
    'Register As Seller',
    '/seller/register',
    'Empowering Local Businesses',
    5
  );

-- 3. 10 Main Categories & 50 Subcategories
INSERT INTO public.categories (id, name, slug, description, image_url, icon_name, display_order)
VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Fashion & Clothing', 'fashion-clothing', 'Authentic Ugandan kitenge, contemporary fashion, traditional attire, and activewear.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80', 'Shirt', 1),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Bags & Accessories', 'bags-accessories', 'Handcrafted Ugandan leather bags, beaded jewelry, belts, and timepieces.', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80', 'ShoppingBag', 2),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Arts & Crafts', 'arts-crafts', 'Handwoven raffia baskets, original oil paintings, pottery, and cultural treasures.', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80', 'Palette', 3),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Food & Beverages', 'food-beverages', 'Direct-from-source Ugandan coffee, organic Rwenzori honey, spices, and dried fruits.', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', 'Coffee', 4),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'Beauty & Personal Care', 'beauty-personal-care', 'Nilotica shea butter from Northern Uganda, organic soaps, oils, and herbal cosmetics.', 'https://images.unsplash.com/photo-1608248597359-5f284e3d30ea?auto=format&fit=crop&w=600&q=80', 'Sparkles', 5),
  ('a1b2c3d4-0006-4000-8000-000000000006', 'Home & Living', 'home-living', 'Solid hardwood mahogany furniture, kitchenware, handwoven rugs, and bedding.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80', 'Home', 6),
  ('a1b2c3d4-0007-4000-8000-000000000007', 'Electronics & Technology', 'electronics-technology', 'Locally assembled solar systems, phone accessories, power banks, and computer gadgets.', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', 'Cpu', 7),
  ('a1b2c3d4-0008-4000-8000-000000000008', 'Agriculture & Farm Products', 'agriculture-farm-products', 'Fresh Ugandan produce, certified seeds, organic fertilizers, and farm equipment.', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80', 'Sprout', 8),
  ('a1b2c3d4-0009-4000-8000-000000000009', 'Footwear', 'footwear', 'Handcrafted Ugandan leather boots, sandals, formal shoes, and school shoes.', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80', 'Footprints', 9),
  ('a1b2c3d4-0010-4000-8000-000000000010', 'Books & Stationery', 'books-stationery', 'Ugandan authors, school textbooks, handcrafted journals, and art supplies.', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80', 'BookOpen', 10)
ON CONFLICT (slug) DO NOTHING;
