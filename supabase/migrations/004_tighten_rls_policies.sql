-- ============================================================
-- ICO — Aangescherpte RLS Policies
-- Vervangt de te permissieve 'authenticated' checks
-- met een admin whitelist tabel
-- ============================================================

-- Admin whitelist tabel
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Alleen admins kunnen deze tabel lezen (voor self-check)
CREATE POLICY "Admins can read admin_users"
    ON admin_users FOR SELECT
    USING (auth.uid() = id);

-- Helper functie: is de huidige user een actieve admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid() AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Drop oude te permissieve policies ──────────────────────

-- Services
DROP POLICY IF EXISTS "Admin full access services" ON services;
CREATE POLICY "Admins can manage services"
    ON services FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Bookings
DROP POLICY IF EXISTS "Admin full access bookings" ON bookings;
CREATE POLICY "Admins can manage bookings"
    ON bookings FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Availability
DROP POLICY IF EXISTS "Public can create availability" ON availability;
DROP POLICY IF EXISTS "Admin full access availability" ON availability;
CREATE POLICY "Admins can manage availability"
    ON availability FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());
-- Availability wordt automatisch aangemaakt bij bookings via trigger, niet public insert
CREATE POLICY "Public can read availability"
    ON availability FOR SELECT
    USING (true);

-- Products
DROP POLICY IF EXISTS "Admin full access products" ON products;
CREATE POLICY "Admins can manage products"
    ON products FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Orders
DROP POLICY IF EXISTS "Admin full access orders" ON orders;
CREATE POLICY "Admins can manage orders"
    ON orders FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Blog posts
DROP POLICY IF EXISTS "Admin full access blog_posts" ON blog_posts;
CREATE POLICY "Admins can manage blog_posts"
    ON blog_posts FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- FAQ items
DROP POLICY IF EXISTS "Admin full access faq_items" ON faq_items;
CREATE POLICY "Admins can manage faq_items"
    ON faq_items FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Site settings
DROP POLICY IF EXISTS "Admin full access site_settings" ON site_settings;
CREATE POLICY "Admins can manage site_settings"
    ON site_settings FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Testimonials
DROP POLICY IF EXISTS "Admin full access testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials"
    ON testimonials FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Quote requests
DROP POLICY IF EXISTS "Authenticated full access quote_requests" ON quote_requests;
CREATE POLICY "Admins can manage quote_requests"
    ON quote_requests FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- ── Storage policies aanscherpen ───────────────────────────

DROP POLICY IF EXISTS "Blog: authenticated can upload" ON storage.objects;
DROP POLICY IF EXISTS "Blog: authenticated can update" ON storage.objects;
DROP POLICY IF EXISTS "Blog: authenticated can delete" ON storage.objects;

CREATE POLICY "Blog: admins can upload"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'blog' AND is_admin());

CREATE POLICY "Blog: admins can update"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'blog' AND is_admin());

CREATE POLICY "Blog: admins can delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'blog' AND is_admin());

-- ── Seed admin users (voer dit uit na migratie) ────────────
-- INSERT INTO admin_users (id, email) VALUES
--   ('uuid-van-rico', 'rico@ico-detailing.be'),
--   ('uuid-van-nico', 'nico@ico-detailing.be');
