-- ==============================================================================
-- SUPABASE DATABASE SCHEMA FOR MYVALUT (STASHR BOOKMARKS)
-- ==============================================================================
-- Run this SQL in Supabase Dashboard -> SQL Editor -> Click 'Run'
-- ==============================================================================

-- 1. Collections Table
CREATE TABLE IF NOT EXISTS public.collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tags Table
CREATE TABLE IF NOT EXISTS public.tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Bookmarks Table
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
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_platform ON public.bookmarks(platform);
CREATE INDEX IF NOT EXISTS idx_bookmarks_is_favorite ON public.bookmarks(is_favorite);
CREATE INDEX IF NOT EXISTS idx_bookmarks_is_archived ON public.bookmarks(is_archived);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at_ms ON public.bookmarks(created_at_ms DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_collection_id ON public.bookmarks(collection_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Permissive policies for Anon / Public access
DROP POLICY IF EXISTS "Allow public read access on collections" ON public.collections;
CREATE POLICY "Allow public read access on collections" ON public.collections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access on collections" ON public.collections;
CREATE POLICY "Allow public insert access on collections" ON public.collections FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access on collections" ON public.collections;
CREATE POLICY "Allow public update access on collections" ON public.collections FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete access on collections" ON public.collections;
CREATE POLICY "Allow public delete access on collections" ON public.collections FOR DELETE USING (true);

-- Tags policies
DROP POLICY IF EXISTS "Allow public read access on tags" ON public.tags;
CREATE POLICY "Allow public read access on tags" ON public.tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access on tags" ON public.tags;
CREATE POLICY "Allow public insert access on tags" ON public.tags FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access on tags" ON public.tags;
CREATE POLICY "Allow public update access on tags" ON public.tags FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete access on tags" ON public.tags;
CREATE POLICY "Allow public delete access on tags" ON public.tags FOR DELETE USING (true);

-- Bookmarks policies
DROP POLICY IF EXISTS "Allow public read access on bookmarks" ON public.bookmarks;
CREATE POLICY "Allow public read access on bookmarks" ON public.bookmarks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access on bookmarks" ON public.bookmarks;
CREATE POLICY "Allow public insert access on bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access on bookmarks" ON public.bookmarks;
CREATE POLICY "Allow public update access on bookmarks" ON public.bookmarks FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete access on bookmarks" ON public.bookmarks;
CREATE POLICY "Allow public delete access on bookmarks" ON public.bookmarks FOR DELETE USING (true);

-- 4. Initial Seed Collections
INSERT INTO public.collections (id, name, icon)
VALUES ('col-1', 'qjahsf', 'heart')
ON CONFLICT (id) DO NOTHING;

-- 5. Initial Seed Tags
INSERT INTO public.tags (id, name, color) VALUES
  ('tag-1', 'graphic design', 'blue'),
  ('tag-2', 'photo editing', 'violet'),
  ('tag-3', 'motion design', 'violet'),
  ('tag-4', 'animation', 'pink'),
  ('tag-5', 'ui', 'green'),
  ('tag-6', 'ai', 'orange'),
  ('tag-7', 'ux', 'amber'),
  ('tag-8', 'design inspiration', 'red'),
  ('tag-9', 'open source', 'green'),
  ('tag-10', 'github', 'orange')
ON CONFLICT (name) DO NOTHING;
