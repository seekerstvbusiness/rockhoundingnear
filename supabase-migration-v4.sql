-- ============================================================
-- Migration v4: Permanent special-character sanitization
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Helper function: replace curly/fancy characters with ASCII
CREATE OR REPLACE FUNCTION sanitize_text(t TEXT) RETURNS TEXT AS $$
BEGIN
  IF t IS NULL THEN RETURN NULL; END IF;
  t := replace(t, chr(8212), ' - ');   -- em dash
  t := replace(t, chr(8211), '-');     -- en dash
  t := replace(t, chr(8230), '...');  -- ellipsis
  t := replace(t, chr(8216), '''');    -- left single quote
  t := replace(t, chr(8217), '''');    -- right single quote / apostrophe
  t := replace(t, chr(8220), '"');     -- left double quote
  t := replace(t, chr(8221), '"');     -- right double quote
  t := replace(t, chr(8226), '-');     -- bullet point
  RETURN t;
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- 2. Trigger function: sanitize every text field on every location row
CREATE OR REPLACE FUNCTION sanitize_location_fields() RETURNS TRIGGER AS $$
BEGIN
  NEW.name              := sanitize_text(NEW.name);
  NEW.short_description := sanitize_text(NEW.short_description);
  NEW.description       := sanitize_text(NEW.description);
  NEW.history           := sanitize_text(NEW.history);
  NEW.tips              := sanitize_text(NEW.tips);
  NEW.rules             := sanitize_text(NEW.rules);
  NEW.best_season       := sanitize_text(NEW.best_season);
  NEW.directions        := sanitize_text(NEW.directions);
  NEW.written_directions := sanitize_text(NEW.written_directions);
  NEW.road_conditions   := sanitize_text(NEW.road_conditions);
  NEW.parking_notes     := sanitize_text(NEW.parking_notes);
  NEW.terrain_notes     := sanitize_text(NEW.terrain_notes);
  NEW.collection_rules  := sanitize_text(NEW.collection_rules);
  NEW.quantity_limits   := sanitize_text(NEW.quantity_limits);
  NEW.nearest_services  := sanitize_text(NEW.nearest_services);
  NEW.accessibility_notes := sanitize_text(NEW.accessibility_notes);
  NEW.address           := sanitize_text(NEW.address);
  NEW.meta_title        := sanitize_text(NEW.meta_title);
  NEW.meta_description  := sanitize_text(NEW.meta_description);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 3. Attach trigger (fires before every INSERT or UPDATE)
DROP TRIGGER IF EXISTS trg_sanitize_location_fields ON locations;
CREATE TRIGGER trg_sanitize_location_fields
  BEFORE INSERT OR UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION sanitize_location_fields();


-- 4. Back-fill: clean all existing rows now
UPDATE locations SET updated_at = updated_at;
-- (touching updated_at fires the trigger on every row without changing data)
