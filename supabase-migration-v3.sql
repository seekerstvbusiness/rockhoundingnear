-- ============================================
-- Migration v3: Review photos
-- Run in Supabase SQL Editor
-- ============================================

-- Add photo_urls to reviews
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS photo_urls TEXT[] DEFAULT '{}';

-- Create storage bucket for review photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  true,
  5242880, -- 5MB per file
  ARRAY['image/jpeg','image/png','image/webp','image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read review photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-photos');

CREATE POLICY "Anyone can upload review photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'review-photos');
