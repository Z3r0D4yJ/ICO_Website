-- =============================================
-- ICO Website — Migration 002: Pricing Tiers
-- =============================================
-- Voeg pricing_tiers (JSONB) en service_category toe aan de services tabel.
-- pricing_tiers structuur:
-- [{"vehicle_type": "standaard", "label": "Standaard wagen", "price": 55}, ...]

ALTER TABLE services ADD COLUMN IF NOT EXISTS pricing_tiers JSONB;
ALTER TABLE services ADD COLUMN IF NOT EXISTS service_category TEXT DEFAULT 'wash';

-- Index voor snel filteren op categorie
CREATE INDEX IF NOT EXISTS services_service_category_idx ON services (service_category);
