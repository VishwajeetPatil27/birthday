-- ==============================================================================
-- A THOUSAND LITTLE REASONS - SUPABASE CLOUD DATABASE & STORAGE SETUP
-- ==============================================================================
-- Copy and paste this script into your Supabase SQL Editor and click "Run".
-- This creates the configuration table, realtime sync, and media storage bucket.

-- 1. Create the birthday experiences configuration table
CREATE TABLE IF NOT EXISTS public.birthday_experiences (
  id TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.birthday_experiences ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anyone with the link to read the birthday surprise
DROP POLICY IF EXISTS "Allow public read access" ON public.birthday_experiences;
CREATE POLICY "Allow public read access"
  ON public.birthday_experiences
  FOR SELECT
  USING (true);

-- 4. Policy: Allow updating/inserting configuration (protected on frontend by creator passcode)
DROP POLICY IF EXISTS "Allow public upsert access" ON public.birthday_experiences;
CREATE POLICY "Allow public upsert access"
  ON public.birthday_experiences
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Enable Realtime for cross-device instant sync
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'birthday_experiences'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.birthday_experiences;
  END IF;
END $$;

-- 6. Create the Storage Bucket for uploaded photos and music ('birthday-media')
INSERT INTO storage.buckets (id, name, public)
VALUES ('birthday-media', 'birthday-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 7. Storage Policies: Allow public read of uploaded photos
DROP POLICY IF EXISTS "Public media read access" ON storage.objects;
CREATE POLICY "Public media read access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'birthday-media');

-- 8. Storage Policies: Allow uploading photos
DROP POLICY IF EXISTS "Public media upload access" ON storage.objects;
CREATE POLICY "Public media upload access"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'birthday-media');

DROP POLICY IF EXISTS "Public media update access" ON storage.objects;
CREATE POLICY "Public media update access"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'birthday-media');
