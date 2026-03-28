-- ============================================================
-- 006_booking_tracking.sql
-- Tracking token, garage-boeking velden + voortgang tabel
-- ============================================================

-- 1. Extend bookings
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS tracking_token UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS booking_type   TEXT    DEFAULT 'mobiel',
  ADD COLUMN IF NOT EXISTS drop_off_date  DATE,
  ADD COLUMN IF NOT EXISTS drop_off_time  TEXT,
  ADD COLUMN IF NOT EXISTS estimated_ready_date DATE;

-- Constraint op booking_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_booking_type_check'
  ) THEN
    ALTER TABLE bookings
      ADD CONSTRAINT bookings_booking_type_check
      CHECK (booking_type IN ('mobiel', 'garage'));
  END IF;
END $$;

-- Genereer tokens voor bestaande rijen
UPDATE bookings SET tracking_token = gen_random_uuid() WHERE tracking_token IS NULL;

-- Verplicht + uniek
ALTER TABLE bookings ALTER COLUMN tracking_token SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS bookings_tracking_token_idx ON bookings(tracking_token);

-- Adres optioneel voor garage-boekingen
ALTER TABLE bookings ALTER COLUMN customer_address DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN customer_city    DROP NOT NULL;

-- 2. Booking updates (voortgang + foto's per boeking)
CREATE TABLE IF NOT EXISTS booking_updates (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID        NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  message     TEXT,
  photos      TEXT[]      DEFAULT '{}',
  status_change TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE booking_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read booking_updates"  ON booking_updates;
DROP POLICY IF EXISTS "Admin all booking_updates"    ON booking_updates;

CREATE POLICY "Public read booking_updates" ON booking_updates
  FOR SELECT USING (true);

CREATE POLICY "Admin all booking_updates" ON booking_updates
  FOR ALL USING (is_admin());

-- 3. RPC: publieke tracking — returnt alleen niet-gevoelige velden
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

-- 4. Storage bucket voor voortgang-foto's
INSERT INTO storage.buckets (id, name, public)
VALUES ('booking-updates', 'booking-updates', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read booking-updates storage"  ON storage.objects;
DROP POLICY IF EXISTS "Admin upload booking-updates storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete booking-updates storage" ON storage.objects;

CREATE POLICY "Public read booking-updates storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'booking-updates');

CREATE POLICY "Admin upload booking-updates storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'booking-updates' AND is_admin());

CREATE POLICY "Admin delete booking-updates storage" ON storage.objects
  FOR DELETE USING (bucket_id = 'booking-updates' AND is_admin());
