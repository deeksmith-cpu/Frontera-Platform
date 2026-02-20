-- Add confidence JSONB column to territory_insights
-- Stores per-question confidence levels: { "0": "data", "1": "experience", "2": "guess" }
ALTER TABLE territory_insights
ADD COLUMN IF NOT EXISTS confidence jsonb DEFAULT '{}'::jsonb;
