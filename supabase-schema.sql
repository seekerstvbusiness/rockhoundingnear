-- ============================================
-- RockhoundingNear.com — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STATES table
-- ============================================
CREATE TABLE IF NOT EXISTS states (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  abbreviation TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  location_count INTEGER DEFAULT 0,
  image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  featured_gems TEXT[] DEFAULT '{}'
);

-- ============================================
-- LOCATIONS table
-- ============================================
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  state TEXT NOT NULL,
  state_slug TEXT NOT NULL,
  city TEXT,
  city_slug TEXT,
  short_description TEXT,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  gem_types TEXT[] DEFAULT '{}',
  difficulty TEXT CHECK (difficulty IN ('easy', 'moderate', 'hard', 'expert')),
  access_type TEXT CHECK (access_type IN ('public', 'private', 'fee', 'permit')),
  fee_amount DECIMAL(10, 2),
  best_season TEXT,
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  address TEXT,
  directions TEXT,
  tips TEXT,
  rules TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(state_slug, city_slug, slug)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_locations_state_slug ON locations(state_slug);
CREATE INDEX IF NOT EXISTS idx_locations_city_slug ON locations(city_slug);
CREATE INDEX IF NOT EXISTS idx_locations_published ON locations(published);
CREATE INDEX IF NOT EXISTS idx_locations_featured ON locations(featured);
CREATE INDEX IF NOT EXISTS idx_locations_gem_types ON locations USING GIN(gem_types);

-- ============================================
-- Auto-update location count on states
-- ============================================
CREATE OR REPLACE FUNCTION update_state_location_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE states
  SET location_count = (
    SELECT COUNT(*) FROM locations
    WHERE state_slug = COALESCE(NEW.state_slug, OLD.state_slug)
    AND published = true
  )
  WHERE slug = COALESCE(NEW.state_slug, OLD.state_slug);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_state_count
AFTER INSERT OR UPDATE OR DELETE ON locations
FOR EACH ROW EXECUTE FUNCTION update_state_location_count();

-- ============================================
-- Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_locations_updated_at
BEFORE UPDATE ON locations
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Row Level Security (read-only for anon)
-- ============================================
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published locations" ON locations
  FOR SELECT USING (published = true);

CREATE POLICY "Public read states" ON states
  FOR SELECT USING (true);

-- ============================================
-- Sample data — a few starter locations
-- ============================================
INSERT INTO states (name, slug, abbreviation, short_description, featured_gems) VALUES
('Arizona', 'arizona', 'AZ', 'One of the richest rockhounding states in the US — famous for turquoise, peridot, and agates.', ARRAY['Turquoise', 'Peridot', 'Agate', 'Jasper']),
('California', 'california', 'CA', 'Diverse geology yields jade, gold, serpentine, and more across its vast landscapes.', ARRAY['Jade', 'Gold', 'Serpentine', 'Tourmaline']),
('Oregon', 'oregon', 'OR', 'Oregon Sunstone, thundereggs, agates, and obsidian await in this Pacific Northwest gem.', ARRAY['Sunstone', 'Agate', 'Obsidian', 'Thundereggs'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, state, state_slug, city, city_slug, short_description, description, gem_types, difficulty, access_type, best_season, featured, published, latitude, longitude, meta_title, meta_description) VALUES
(
  'Petrified Wood Park',
  'petrified-wood-park',
  'Arizona',
  'arizona',
  'Holbrook',
  'holbrook',
  'One of the most accessible petrified wood sites in the American Southwest.',
  'Located near Holbrook, this area offers some of the best petrified wood collecting in Arizona. Billions of years of geological history are preserved in these stunning fossilized trees. Bring sturdy boots and a collecting bag — pieces ranging from palm-sized chips to impressive logs can be found scattered across the terrain.',
  ARRAY['Petrified Wood', 'Jasper', 'Agate'],
  'easy',
  'public',
  'October–April',
  true,
  true,
  34.9023,
  -110.1328,
  'Petrified Wood Park, Holbrook AZ — Rockhounding Guide',
  'Find spectacular petrified wood near Holbrook, Arizona. Access info, GPS coordinates, and what to bring.'
),
(
  'Crater Rock Museum Area',
  'crater-rock-museum-area',
  'Oregon',
  'oregon',
  'Central Point',
  'central-point',
  'The gateway to southern Oregon''s rich rockhounding country — thundereggs and more.',
  'Southern Oregon is legendary among rockhounds, and the area around Central Point and Medford is the perfect base camp. Thundereggs, agates, and jasper are found throughout the region. The nearby Crater Rock Museum is a must-visit for any collector.',
  ARRAY['Thunderegg', 'Agate', 'Jasper', 'Obsidian'],
  'moderate',
  'public',
  'May–October',
  true,
  true,
  42.3765,
  -122.9165,
  'Rockhounding near Central Point, Oregon — Thundereggs & Agates',
  'Discover thundereggs, agates, and jasper near Central Point in southern Oregon. Detailed guide with directions.'
)
ON CONFLICT DO NOTHING;
