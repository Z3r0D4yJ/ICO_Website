-- =============================================
-- ICO Website — Migration 002: Quote Requests
-- =============================================

CREATE TABLE quote_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service_interest TEXT,              -- Slug of dienst (bijv. 'carrosserie-coating')
    vehicle_type TEXT,                  -- 'sedan', 'suv', etc.
    vehicle_brand TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'accepted', 'declined')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Publiek mag offerte-aanvragen indienen
CREATE POLICY "Public can create quote requests"
    ON quote_requests FOR INSERT TO anon
    WITH CHECK (true);

-- Authenticated (admins) kunnen alles
CREATE POLICY "Authenticated can manage quote requests"
    ON quote_requests FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_quote_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quote_requests_updated_at
    BEFORE UPDATE ON quote_requests
    FOR EACH ROW EXECUTE FUNCTION update_quote_requests_updated_at();
