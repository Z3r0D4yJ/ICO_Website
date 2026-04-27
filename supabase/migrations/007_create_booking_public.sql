-- ============================================================
-- 007_create_booking_public.sql
-- Race-safe versie van create_booking_public.
--
-- WAAROM deze update:
--   1. De vorige versie deed `INSERT INTO availability ... ON CONFLICT DO NOTHING`
--      → bij gelijktijdige bookings voor hetzelfde slot werd het slot maar
--      één keer gereserveerd, maar BEIDE bookings bleven in de tabel staan.
--      De verliezer dacht dat alles gelukt was = silent data corruption.
--   2. booking_number gebruikte `COUNT(*) + 1` (niet atomic) → race kan
--      twee bookings dezelfde nummer geven, tweede crasht op UNIQUE constraint
--      maar laat een wees-rij in availability achter.
--   3. Voor garage-boekingen werd ook een exclusief slot geblokkeerd terwijl
--      meerdere auto's tegelijk in de garage kunnen staan.
--
-- WAT verandert:
--   - Atomic booking_number via SEQUENCE (booking_number_seq)
--   - Bij slot-conflict: RAISE EXCEPTION 23505 met HINT 'BOOKING_SLOT_TAKEN'
--     → hele functie rolt terug, geen wees-data
--   - Slot-reservering alleen voor 'mobiel' bookings, niet voor 'garage'
--
-- Signature blijft identiek zodat src/api/bookings.js niet hoeft te wijzigen.
-- ============================================================

CREATE SEQUENCE IF NOT EXISTS booking_number_seq START WITH 1;

CREATE OR REPLACE FUNCTION public.create_booking_public(
  p_booking_type         TEXT,
  p_service_id           TEXT,
  p_customer_name        TEXT,
  p_customer_email       TEXT,
  p_customer_phone       TEXT,
  p_customer_address     TEXT,
  p_customer_city        TEXT,
  p_customer_postal_code TEXT,
  p_preferred_date       TEXT,
  p_preferred_time_slot  TEXT,
  p_drop_off_date        TEXT DEFAULT NULL,
  p_drop_off_time        TEXT DEFAULT NULL,
  p_vehicle_type         TEXT DEFAULT NULL,
  p_vehicle_brand        TEXT DEFAULT NULL,
  p_notes                TEXT DEFAULT NULL,
  p_total_price          NUMERIC DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_year           INT;
  v_seq            INT;
  v_booking_number TEXT;
  v_booking_id     UUID;
  v_token          UUID;
  v_service_id     UUID;
  v_pref_date      DATE;
BEGIN
  -- ── Atomic booking_number ICO-YYYY-NNNN ─────────────────────
  v_year := EXTRACT(YEAR FROM now())::INT;
  v_seq  := nextval('booking_number_seq')::INT;
  v_booking_number := 'ICO-' || v_year || '-' || LPAD(v_seq::TEXT, 4, '0');

  v_service_id := NULLIF(TRIM(p_service_id), '')::UUID;
  v_pref_date  := NULLIF(p_preferred_date, '')::DATE;

  -- ── Insert booking ──────────────────────────────────────────
  INSERT INTO bookings (
    booking_number, booking_type,
    service_id,
    customer_name, customer_email, customer_phone,
    customer_address, customer_city, customer_postal_code,
    preferred_date, preferred_time_slot,
    drop_off_date, drop_off_time,
    vehicle_type, vehicle_brand, notes, total_price, status
  ) VALUES (
    v_booking_number, p_booking_type,
    v_service_id,
    p_customer_name, p_customer_email, p_customer_phone,
    NULLIF(p_customer_address, ''), NULLIF(p_customer_city, ''), NULLIF(p_customer_postal_code, ''),
    v_pref_date, p_preferred_time_slot,
    NULLIF(p_drop_off_date, '')::DATE, NULLIF(p_drop_off_time, ''),
    NULLIF(p_vehicle_type, ''), NULLIF(p_vehicle_brand, ''), NULLIF(p_notes, ''),
    p_total_price, 'pending'
  )
  RETURNING id, tracking_token INTO v_booking_id, v_token;

  -- ── Slot-reservering: alleen mobiel, race-safe ──────────────
  -- Bij UNIQUE conflict op (date, time_slot) rolt de hele functie terug
  -- (incl. de booking insert hierboven) zodat er geen wees-data ontstaat.
  IF p_booking_type = 'mobiel' THEN
    BEGIN
      INSERT INTO availability (date, time_slot, booking_id, is_blocked)
      VALUES (v_pref_date, p_preferred_time_slot, v_booking_id, true);
    EXCEPTION WHEN unique_violation THEN
      RAISE EXCEPTION 'Tijdslot is net door iemand anders geboekt'
        USING ERRCODE = '23505',
              HINT    = 'BOOKING_SLOT_TAKEN';
    END;
  END IF;

  RETURN jsonb_build_object(
    'id',             v_booking_id,
    'booking_number', v_booking_number,
    'tracking_token', v_token
  );
END;
$function$;

GRANT EXECUTE ON FUNCTION public.create_booking_public(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT,
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC
) TO anon, authenticated;
