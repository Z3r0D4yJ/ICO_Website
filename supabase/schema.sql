-- =============================================
-- ICO Website — Volledig Database Schema
-- Eén bestand — bevat alles (migrations 001-006)
-- Voer dit uit op een lege Supabase database
-- =============================================

-- UUID extensie
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABELLEN
-- ============================================================

-- -------------------------------------------
-- ADMIN USERS (whitelist)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
    id         UUID    PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email      TEXT    NOT NULL,
    is_active  BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- -------------------------------------------
-- DIENSTEN
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS services (
    id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                 TEXT         UNIQUE NOT NULL,
    title_nl             TEXT         NOT NULL,
    title_en             TEXT,
    description_nl       TEXT         NOT NULL,
    description_en       TEXT,
    short_description_nl TEXT,
    short_description_en TEXT,
    price_from           DECIMAL(10,2),
    price_to             DECIMAL(10,2),
    price_note_nl        TEXT,
    price_note_en        TEXT,
    duration_minutes     INTEGER,
    image_url            TEXT,
    icon                 TEXT,
    is_active            BOOLEAN      DEFAULT true,
    sort_order           INTEGER      DEFAULT 0,
    pricing_tiers        JSONB,
    service_category     TEXT         DEFAULT 'wash',
    created_at           TIMESTAMPTZ  DEFAULT now(),
    updated_at           TIMESTAMPTZ  DEFAULT now()
);

-- -------------------------------------------
-- BOEKINGEN
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number        TEXT         UNIQUE NOT NULL,
    booking_type          TEXT         DEFAULT 'mobiel' CHECK (booking_type IN ('mobiel', 'garage')),
    tracking_token        UUID         DEFAULT gen_random_uuid() NOT NULL,
    service_id            UUID         REFERENCES services(id) ON DELETE SET NULL,
    customer_name         TEXT         NOT NULL,
    customer_email        TEXT         NOT NULL,
    customer_phone        TEXT         NOT NULL,
    customer_address      TEXT,
    customer_city         TEXT,
    customer_postal_code  TEXT,
    preferred_date        DATE         NOT NULL,
    preferred_time_slot   TEXT         NOT NULL,
    drop_off_date         DATE,
    drop_off_time         TEXT,
    estimated_ready_date  DATE,
    vehicle_type          TEXT,
    vehicle_brand         TEXT,
    notes                 TEXT,
    status                TEXT         DEFAULT 'pending'
                          CHECK (status IN (
                              'pending', 'confirmed', 'dropped_off',
                              'in_progress', 'curing', 'ready_for_pickup',
                              'picked_up', 'completed', 'cancelled'
                          )),
    total_price           DECIMAL(10,2),
    created_at            TIMESTAMPTZ  DEFAULT now(),
    updated_at            TIMESTAMPTZ  DEFAULT now()
);

-- -------------------------------------------
-- VOORTGANG UPDATES (per boeking)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS booking_updates (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id    UUID        NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    message       TEXT,
    photos        TEXT[]      DEFAULT '{}',
    status_change TEXT,
    created_at    TIMESTAMPTZ DEFAULT now()
);

-- -------------------------------------------
-- BESCHIKBAARHEID / TIJDSLOTS
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS availability (
    id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    date       DATE    NOT NULL,
    time_slot  TEXT    NOT NULL,
    is_blocked BOOLEAN DEFAULT false,
    booking_id UUID    REFERENCES bookings(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(date, time_slot)
);

-- -------------------------------------------
-- PRODUCTEN (CleanTech webshop)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    slug             TEXT         UNIQUE NOT NULL,
    name             TEXT         NOT NULL,
    description_nl   TEXT,
    description_en   TEXT,
    price            DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    image_url        TEXT,
    images           TEXT[],
    category         TEXT,
    stock_quantity   INTEGER      DEFAULT 0,
    is_active        BOOLEAN      DEFAULT true,
    sort_order       INTEGER      DEFAULT 0,
    created_at       TIMESTAMPTZ  DEFAULT now(),
    updated_at       TIMESTAMPTZ  DEFAULT now()
);

-- -------------------------------------------
-- BESTELLINGEN
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number         TEXT         UNIQUE NOT NULL,
    customer_name        TEXT         NOT NULL,
    customer_email       TEXT         NOT NULL,
    customer_phone       TEXT,
    shipping_address     TEXT         NOT NULL,
    shipping_city        TEXT         NOT NULL,
    shipping_postal_code TEXT         NOT NULL,
    shipping_country     TEXT         DEFAULT 'BE',
    items                JSONB        NOT NULL,
    subtotal             DECIMAL(10,2) NOT NULL,
    shipping_cost        DECIMAL(10,2) DEFAULT 0,
    total                DECIMAL(10,2) NOT NULL,
    status               TEXT         DEFAULT 'pending'
                         CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded')),
    mollie_payment_id    TEXT,
    created_at           TIMESTAMPTZ  DEFAULT now(),
    updated_at           TIMESTAMPTZ  DEFAULT now()
);

-- -------------------------------------------
-- BLOG POSTS
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            TEXT        UNIQUE NOT NULL,
    title_nl        TEXT        NOT NULL,
    title_en        TEXT,
    content_nl      TEXT        NOT NULL,
    content_en      TEXT,
    excerpt_nl      TEXT,
    excerpt_en      TEXT,
    cover_image_url TEXT,
    author          TEXT        DEFAULT 'Team ICO',
    is_published    BOOLEAN     DEFAULT false,
    published_at    TIMESTAMPTZ,
    tags            TEXT[],
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- -------------------------------------------
-- PROJECTEN (voor/na foto's)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            TEXT        UNIQUE NOT NULL,
    title_nl        TEXT        NOT NULL,
    title_en        TEXT,
    description_nl  TEXT,
    description_en  TEXT,
    cover_image_url TEXT,
    images          TEXT[]      DEFAULT '{}',
    vehicle_type    TEXT,
    vehicle_brand   TEXT,
    service_type    TEXT,
    tags            TEXT[]      DEFAULT '{}',
    is_published    BOOLEAN     DEFAULT false,
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- -------------------------------------------
-- FAQ
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS faq_items (
    id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    question_nl TEXT    NOT NULL,
    question_en TEXT,
    answer_nl   TEXT    NOT NULL,
    answer_en   TEXT,
    category    TEXT,
    sort_order  INTEGER DEFAULT 0,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- -------------------------------------------
-- SITE INSTELLINGEN
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
    key        TEXT  PRIMARY KEY,
    value      JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- -------------------------------------------
-- TESTIMONIALS
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
    id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT    NOT NULL,
    content_nl    TEXT    NOT NULL,
    content_en    TEXT,
    rating        INTEGER CHECK (rating >= 1 AND rating <= 5),
    vehicle       TEXT,
    is_featured   BOOLEAN DEFAULT false,
    is_active     BOOLEAN DEFAULT true,
    sort_order    INTEGER DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT now()
);

-- -------------------------------------------
-- OFFERTE AANVRAGEN
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS quote_requests (
    id               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    name             TEXT    NOT NULL,
    email            TEXT    NOT NULL,
    phone            TEXT,
    service_interest TEXT,
    vehicle_type     TEXT,
    vehicle_brand    TEXT,
    message          TEXT,
    status           TEXT    DEFAULT 'new'
                     CHECK (status IN ('new', 'contacted', 'quoted', 'accepted', 'declined')),
    admin_notes      TEXT,
    created_at       TIMESTAMPTZ DEFAULT now(),
    updated_at       TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS bookings_tracking_token_idx ON bookings(tracking_token);
CREATE INDEX IF NOT EXISTS idx_bookings_date        ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status      ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created     ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_availability_date    ON availability(date);
CREATE INDEX IF NOT EXISTS idx_products_category    ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active      ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_blog_published       ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status        ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created       ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS services_category_idx    ON services(service_category);
CREATE INDEX IF NOT EXISTS projects_slug_idx        ON projects(slug);
CREATE INDEX IF NOT EXISTS projects_published_idx   ON projects(published_at DESC) WHERE is_published = true;

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_services_updated_at      BEFORE UPDATE ON services      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at      BEFORE UPDATE ON bookings      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at      BEFORE UPDATE ON products      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at        BEFORE UPDATE ON orders        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at    BEFORE UPDATE ON blog_posts    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at      BEFORE UPDATE ON projects      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quote_requests_updated_at BEFORE UPDATE ON quote_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- HELPER FUNCTIES
-- ============================================================

-- is_admin(): controleert of de huidige gebruiker een actieve admin is
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid() AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- get_booking_by_token(): publieke tracking via UUID token
-- Returnt alleen niet-gevoelige velden (geen email / telefoon / adres)
CREATE OR REPLACE FUNCTION get_booking_by_token(p_token UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'id',                   b.id,
        'booking_number',       b.booking_number,
        'status',               b.status,
        'booking_type',         b.booking_type,
        'customer_name',        split_part(b.customer_name, ' ', 1),
        'vehicle_type',         b.vehicle_type,
        'vehicle_brand',        b.vehicle_brand,
        'preferred_date',       b.preferred_date,
        'preferred_time_slot',  b.preferred_time_slot,
        'drop_off_date',        b.drop_off_date,
        'drop_off_time',        b.drop_off_time,
        'estimated_ready_date', b.estimated_ready_date,
        'service_title',        s.title_nl,
        'created_at',           b.created_at,
        'updates', COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id',            u.id,
                        'message',       u.message,
                        'photos',        u.photos,
                        'status_change', u.status_change,
                        'created_at',    u.created_at
                    ) ORDER BY u.created_at ASC
                )
                FROM booking_updates u
                WHERE u.booking_id = b.id
            ),
            '[]'::jsonb
        )
    ) INTO v_result
    FROM bookings b
    LEFT JOIN services s ON s.id = b.service_id
    WHERE b.tracking_token = p_token;

    RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_booking_by_token(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_booking_by_token(UUID) TO authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE admin_users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE services       ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability   ENABLE ROW LEVEL SECURITY;
ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- admin_users: enkel de eigen rij leesbaar
CREATE POLICY "Admins can read admin_users"
    ON admin_users FOR SELECT
    USING (auth.uid() = id);

-- Services
CREATE POLICY "Public can read active services"  ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage services"        ON services FOR ALL   USING (is_admin()) WITH CHECK (is_admin());

-- Bookings: publiek aanmaken, admin alles
CREATE POLICY "Public can create bookings"  ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage bookings"  ON bookings FOR ALL    USING (is_admin()) WITH CHECK (is_admin());

-- Booking updates: iedereen lezen (tracking page), admin aanmaken/wijzigen
CREATE POLICY "Public read booking_updates" ON booking_updates FOR SELECT USING (true);
CREATE POLICY "Admin all booking_updates"   ON booking_updates FOR ALL    USING (is_admin());

-- Availability: publiek lezen, admin alles
CREATE POLICY "Public can read availability"   ON availability FOR SELECT USING (true);
CREATE POLICY "Admins can manage availability" ON availability FOR ALL    USING (is_admin()) WITH CHECK (is_admin());

-- Products
CREATE POLICY "Public can read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products"       ON products FOR ALL    USING (is_admin()) WITH CHECK (is_admin());

-- Orders: publiek aanmaken, admin alles
CREATE POLICY "Public can create orders"  ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage orders"  ON orders FOR ALL    USING (is_admin()) WITH CHECK (is_admin());

-- Blog posts
CREATE POLICY "Public can read published blog posts" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage blog_posts"          ON blog_posts FOR ALL    USING (is_admin()) WITH CHECK (is_admin());

-- Projecten
CREATE POLICY "projects_public_read" ON projects FOR SELECT USING (is_published = true);
CREATE POLICY "projects_admin_all"   ON projects FOR ALL    USING (is_admin()) WITH CHECK (is_admin());

-- FAQ
CREATE POLICY "Public can read active FAQ items" ON faq_items FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage faq_items"       ON faq_items FOR ALL    USING (is_admin()) WITH CHECK (is_admin());

-- Site settings
CREATE POLICY "Public can read site settings"  ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site_settings" ON site_settings FOR ALL    USING (is_admin()) WITH CHECK (is_admin());

-- Testimonials
CREATE POLICY "Public can read active testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage testimonials"       ON testimonials FOR ALL    USING (is_admin()) WITH CHECK (is_admin());

-- Quote requests: publiek aanmaken, admin alles
CREATE POLICY "Public can create quote requests"   ON quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage quote_requests"   ON quote_requests FOR ALL    USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- TABLE-LEVEL GRANTS
-- RLS policies bepalen WIE wat mag, maar zonder GRANT mag
-- de anon/authenticated role de tabel niet eens benaderen.
-- Beide zijn nodig in Supabase.
-- ============================================================

-- anon: publiek leesbare tabellen
GRANT SELECT ON services        TO anon;
GRANT SELECT ON products        TO anon;
GRANT SELECT ON blog_posts      TO anon;
GRANT SELECT ON projects        TO anon;
GRANT SELECT ON faq_items       TO anon;
GRANT SELECT ON site_settings   TO anon;
GRANT SELECT ON testimonials    TO anon;
GRANT SELECT ON availability    TO anon;
GRANT SELECT ON booking_updates TO anon;

-- anon: publiek aanmaken
GRANT INSERT ON bookings        TO anon;
GRANT INSERT ON orders          TO anon;
GRANT INSERT ON quote_requests  TO anon;

-- authenticated: volledige toegang (admin via RLS beperkt)
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_users     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON services        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON bookings        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON booking_updates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON availability    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON products        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders          TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON blog_posts      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON projects        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON faq_items       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON site_settings   TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON testimonials    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON quote_requests  TO authenticated;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Blog foto's
INSERT INTO storage.buckets (id, name, public) VALUES ('blog', 'blog', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Blog: public can read"    ON storage.objects FOR SELECT USING (bucket_id = 'blog');
CREATE POLICY "Blog: admins can upload"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog' AND is_admin());
CREATE POLICY "Blog: admins can update"  ON storage.objects FOR UPDATE USING (bucket_id = 'blog' AND is_admin());
CREATE POLICY "Blog: admins can delete"  ON storage.objects FOR DELETE USING (bucket_id = 'blog' AND is_admin());

-- Project foto's
INSERT INTO storage.buckets (id, name, public) VALUES ('projects', 'projects', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "projects_storage_public_read"   ON storage.objects FOR SELECT USING (bucket_id = 'projects');
CREATE POLICY "projects_storage_admin_upload"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'projects' AND is_admin());
CREATE POLICY "projects_storage_admin_delete"  ON storage.objects FOR DELETE USING (bucket_id = 'projects' AND is_admin());

-- Voortgang foto's (booking updates)
INSERT INTO storage.buckets (id, name, public) VALUES ('booking-updates', 'booking-updates', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read booking-updates storage"  ON storage.objects FOR SELECT USING (bucket_id = 'booking-updates');
CREATE POLICY "Admin upload booking-updates storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'booking-updates' AND is_admin());
CREATE POLICY "Admin delete booking-updates storage" ON storage.objects FOR DELETE USING (bucket_id = 'booking-updates' AND is_admin());

-- ============================================================
-- ADMIN USERS SEED
-- Vul in na aanmaken van de gebruikers in Supabase Auth
-- ============================================================
-- INSERT INTO admin_users (id, email) VALUES
--   ('<uuid-van-rico>', 'rico@ico-detailing.be'),
--   ('<uuid-van-nico>', 'nico@ico-detailing.be');
