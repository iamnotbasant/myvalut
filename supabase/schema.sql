-- ==============================================================================
-- SUPABASE DATABASE SCHEMA FOR MYVALUT (REAL USER ACCOUNTS & PRIVATE BOOKMARKS)
-- ==============================================================================
-- Run this SQL in Supabase Dashboard -> SQL Editor -> Click 'Run'
-- ==============================================================================

-- 1. Collections Table (Per User)
CREATE TABLE IF NOT EXISTS public.collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tags Table (Per User)
CREATE TABLE IF NOT EXISTS public.tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Bookmarks Table (Per User)
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  display_name TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  image_url TEXT,
  title TEXT,
  text TEXT NOT NULL,
  url TEXT,
  date TEXT NOT NULL,
  created_at_ms BIGINT,
  tags JSONB DEFAULT '[]'::jsonb,
  is_favorite BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  note TEXT,
  collection_id TEXT REFERENCES public.collections(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add user_id column if tables already exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'collections' AND column_name = 'user_id') THEN
    ALTER TABLE public.collections ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tags' AND column_name = 'user_id') THEN
    ALTER TABLE public.tags ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookmarks' AND column_name = 'user_id') THEN
    ALTER TABLE public.bookmarks ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_platform ON public.bookmarks(platform);
CREATE INDEX IF NOT EXISTS idx_bookmarks_is_favorite ON public.bookmarks(is_favorite);
CREATE INDEX IF NOT EXISTS idx_bookmarks_is_archived ON public.bookmarks(is_archived);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at_ms ON public.bookmarks(created_at_ms DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_collection_id ON public.bookmarks(collection_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Permissive policies for Users & Public/Anon
DROP POLICY IF EXISTS "Users can manage their collections" ON public.collections;
DROP POLICY IF EXISTS "Allow public read access on collections" ON public.collections;
DROP POLICY IF EXISTS "Allow public insert access on collections" ON public.collections;
DROP POLICY IF EXISTS "Allow public update access on collections" ON public.collections;
DROP POLICY IF EXISTS "Allow public delete access on collections" ON public.collections;

CREATE POLICY "Allow public read access on collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on collections" ON public.collections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on collections" ON public.collections FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on collections" ON public.collections FOR DELETE USING (true);

-- Tags policies
DROP POLICY IF EXISTS "Allow public read access on tags" ON public.tags;
DROP POLICY IF EXISTS "Allow public insert access on tags" ON public.tags;
DROP POLICY IF EXISTS "Allow public update access on tags" ON public.tags;
DROP POLICY IF EXISTS "Allow public delete access on tags" ON public.tags;

CREATE POLICY "Allow public read access on tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on tags" ON public.tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on tags" ON public.tags FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on tags" ON public.tags FOR DELETE USING (true);

-- Bookmarks policies
DROP POLICY IF EXISTS "Allow public read access on bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Allow public insert access on bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Allow public update access on bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Allow public delete access on bookmarks" ON public.bookmarks;

CREATE POLICY "Allow public read access on bookmarks" ON public.bookmarks FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on bookmarks" ON public.bookmarks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on bookmarks" ON public.bookmarks FOR DELETE USING (true);
