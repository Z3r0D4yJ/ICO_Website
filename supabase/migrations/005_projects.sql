-- ============================================================
--  005_projects.sql
--  Vervangt de blog_posts tabel functionaliteit met een
--  projecten tabel gericht op voor-na foto's en voertuiginfo.
-- ============================================================

CREATE TABLE IF NOT EXISTS projects (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    slug             TEXT        UNIQUE NOT NULL,
    title_nl         TEXT        NOT NULL,
    title_en         TEXT,
    description_nl   TEXT,
    description_en   TEXT,
    cover_image_url  TEXT,
    images           TEXT[]      DEFAULT '{}',   -- galerij foto's
    vehicle_type     TEXT,                        -- sedan, suv, bestelwagen, ...
    vehicle_brand    TEXT,                        -- BMW, Mercedes, Porsche, ...
    service_type     TEXT,                        -- DetailWash, Dieptereiniging, Combo
    tags             TEXT[]      DEFAULT '{}',
    is_published     BOOLEAN     DEFAULT false,
    published_at     TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT now(),
    updated_at       TIMESTAMPTZ DEFAULT now()
);

-- Index voor slug lookups
CREATE INDEX IF NOT EXISTS projects_slug_idx ON projects (slug);
-- Index voor gepubliceerde projecten gesorteerd op datum
CREATE INDEX IF NOT EXISTS projects_published_idx ON projects (published_at DESC) WHERE is_published = true;

-- ── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Publiek mag gepubliceerde projecten lezen
CREATE POLICY "projects_public_read"
    ON projects FOR SELECT
    USING (is_published = true);

-- Admins mogen alles
CREATE POLICY "projects_admin_all"
    ON projects FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- ── Storage bucket voor project foto's ───────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- Publiek mag project foto's lezen
CREATE POLICY "projects_storage_public_read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'projects');

-- Alleen admins mogen uploaden
CREATE POLICY "projects_storage_admin_upload"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'projects' AND is_admin());

CREATE POLICY "projects_storage_admin_delete"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'projects' AND is_admin());
