-- ============================================================
-- ICO — Fix boekingen RLS (403 Forbidden oplossing)
-- Eenmalig uitvoeren in Supabase SQL Editor
-- Geen data-verlies — enkel policies en grants aanpassen
-- ============================================================

-- ── 1. Grants voor anon rol ─────────────────────────────────
-- Zeker stellen dat anon INSERT-rechten heeft op tabel-niveau.
-- RLS-policy alleen is niet genoeg als de grant ontbreekt.

GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT ON bookings      TO anon;
GRANT SELECT, INSERT ON availability  TO anon;
GRANT SELECT          ON services     TO anon;
GRANT SELECT          ON products     TO anon;
GRANT SELECT          ON blog_posts   TO anon;
GRANT SELECT          ON faq_items    TO anon;
GRANT SELECT          ON site_settings TO anon;
GRANT SELECT          ON testimonials TO anon;
GRANT SELECT, INSERT  ON orders       TO anon;

-- ── 2. Opruimen — drop ALLE bestaande policies op bookings ──
-- Zo vermijden we conflicten tussen oude en nieuwe policies.

DROP POLICY IF EXISTS "Public can create bookings"   ON bookings;
DROP POLICY IF EXISTS "Public can read bookings"     ON bookings;
DROP POLICY IF EXISTS "Admin full access bookings"   ON bookings;
DROP POLICY IF EXISTS "Admins can manage bookings"   ON bookings;
DROP POLICY IF EXISTS "anon can insert bookings"     ON bookings;

-- ── 3. Opruimen — drop ALLE bestaande policies op availability

DROP POLICY IF EXISTS "Public can read availability"   ON availability;
DROP POLICY IF EXISTS "Public can create availability" ON availability;
DROP POLICY IF EXISTS "Admin full access availability" ON availability;
DROP POLICY IF EXISTS "Admins can manage availability" ON availability;
DROP POLICY IF EXISTS "anon can insert availability"   ON availability;

-- ── 4. Nieuwe, correcte policies voor bookings ─────────────

-- Anonieme klanten mogen een boeking aanmaken
CREATE POLICY "anon can insert bookings"
    ON bookings FOR INSERT
    TO anon
    WITH CHECK (true);

-- Anonieme klanten mogen boekingen lezen (nodig voor .select() na insert
-- én voor het tellen van boekingsnummers via getNextBookingNumber)
CREATE POLICY "anon can read bookings"
    ON bookings FOR SELECT
    TO anon
    USING (true);

-- Admins (ingelogd via auth) mogen alles doen met boekingen
CREATE POLICY "admins can manage bookings"
    ON bookings FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- ── 5. Nieuwe, correcte policies voor availability ─────────

-- Iedereen mag beschikbaarheid lezen (publieke kalender)
CREATE POLICY "public can read availability"
    ON availability FOR SELECT
    USING (true);

-- Anonieme klanten mogen een tijdslot registreren bij boeking
CREATE POLICY "anon can insert availability"
    ON availability FOR INSERT
    TO anon
    WITH CHECK (true);

-- Admins mogen alles doen met beschikbaarheid
CREATE POLICY "admins can manage availability"
    ON availability FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- ── 6. Controleer of is_admin() functie bestaat ────────────
-- Als 004_tighten_rls_policies.sql niet volledig gelopen heeft,
-- kan is_admin() ontbreken. We maken hem aan als hij er niet is.

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read admin_users" ON admin_users;
CREATE POLICY "Admins can read admin_users"
    ON admin_users FOR SELECT
    USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid() AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 7. Verifieer resultaat ──────────────────────────────────
-- Na uitvoer kun je dit controleren:
-- SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'bookings';
-- SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'availability';
