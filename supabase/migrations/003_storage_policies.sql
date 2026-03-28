-- =============================================
-- ICO Website — Migration 003: Storage Policies
-- Blog bucket: authenticeerde gebruikers mogen uploaden,
-- iedereen mag lezen (bucket is public).
-- =============================================

-- Authenticated users kunnen uploaden naar 'blog' bucket
CREATE POLICY "Blog: authenticated can upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog');

-- Authenticated users kunnen hun eigen bestanden updaten
CREATE POLICY "Blog: authenticated can update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog');

-- Authenticated users kunnen bestanden verwijderen
CREATE POLICY "Blog: authenticated can delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog');

-- Iedereen (ook anon) mag afbeeldingen lezen
CREATE POLICY "Blog: public can read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'blog');
