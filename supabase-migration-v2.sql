-- ============================================
-- RockhoundingNear.com — Migration v2
-- Run in Supabase SQL Editor after schema v1
-- ============================================

-- New columns on locations
ALTER TABLE locations ADD COLUMN IF NOT EXISTS cover_photo TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS alternative_names TEXT[] DEFAULT '{}';
ALTER TABLE locations ADD COLUMN IF NOT EXISTS history TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS county TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS county_slug TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS nearest_city TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS nearest_city_distance DECIMAL(6,1);
ALTER TABLE locations ADD COLUMN IF NOT EXISTS primary_category TEXT CHECK (primary_category IN ('public_blm','national_forest','fee_dig','private','state_park','closed','other'));
ALTER TABLE locations ADD COLUMN IF NOT EXISTS collection_rules TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS quantity_limits TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS permit_required BOOLEAN DEFAULT false;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS permit_link TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS commercial_use_allowed BOOLEAN DEFAULT false;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS written_directions TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS vehicle_required TEXT CHECK (vehicle_required IN ('passenger','awd','4x4','atv','hiking'));
ALTER TABLE locations ADD COLUMN IF NOT EXISTS road_conditions TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS parking_notes TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS terrain_notes TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS beginner_friendly BOOLEAN;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS family_friendly BOOLEAN;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS kid_age_range TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS accessibility_notes TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS dog_friendly BOOLEAN;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS hazards TEXT[] DEFAULT '{}';
ALTER TABLE locations ADD COLUMN IF NOT EXISTS cell_service TEXT CHECK (cell_service IN ('none','spotty','reliable'));
ALTER TABLE locations ADD COLUMN IF NOT EXISTS nearest_services TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS remoteness_rating INTEGER CHECK (remoteness_rating BETWEEN 1 AND 5);
ALTER TABLE locations ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]';
ALTER TABLE locations ADD COLUMN IF NOT EXISTS rating_average DECIMAL(3,2) DEFAULT 0;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- Indexes for new SEO-relevant fields
CREATE INDEX IF NOT EXISTS idx_locations_county ON locations(county_slug);
CREATE INDEX IF NOT EXISTS idx_locations_nearest_city ON locations(nearest_city);
CREATE INDEX IF NOT EXISTS idx_locations_category ON locations(primary_category);
CREATE INDEX IF NOT EXISTS idx_locations_beginner ON locations(beginner_friendly);
CREATE INDEX IF NOT EXISTS idx_locations_family ON locations(family_friendly);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  comment TEXT,
  visit_date DATE,
  gem_found TEXT,
  verified BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_location ON reviews(location_id);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(published);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published reviews" ON reviews
  FOR SELECT USING (published = true);

CREATE POLICY "Anyone can submit review" ON reviews
  FOR INSERT WITH CHECK (true);

-- Auto-update rating average when review is published
CREATE OR REPLACE FUNCTION update_location_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE locations SET
    rating_average = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM reviews
      WHERE location_id = COALESCE(NEW.location_id, OLD.location_id)
      AND published = true
    ),
    rating_count = (
      SELECT COUNT(*) FROM reviews
      WHERE location_id = COALESCE(NEW.location_id, OLD.location_id)
      AND published = true
    )
  WHERE id = COALESCE(NEW.location_id, OLD.location_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_location_rating();
