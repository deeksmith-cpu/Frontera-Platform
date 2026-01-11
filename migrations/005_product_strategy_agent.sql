-- =============================================
-- PRODUCT STRATEGY AGENT MVP MIGRATION
-- Adds tables and columns for 4-phase strategy methodology
-- =============================================

-- =============================================
-- 1. ADD COLUMNS TO conversations TABLE
-- =============================================

-- Add session_name and current_phase tracking
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS session_name TEXT,
ADD COLUMN IF NOT EXISTS current_phase TEXT DEFAULT 'discovery';

-- Add check constraint for valid phases
ALTER TABLE conversations
ADD CONSTRAINT valid_current_phase
CHECK (current_phase IS NULL OR current_phase IN ('discovery', 'research', 'synthesis', 'bets'));

-- =============================================
-- 2. CREATE phase_progress TABLE
-- =============================================

-- Tracks granular progress through each phase
CREATE TABLE IF NOT EXISTS phase_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Phase identification
  phase TEXT NOT NULL CHECK (phase IN ('discovery', 'research', 'synthesis', 'bets')),

  -- Progress tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  progress_pct INTEGER DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),

  -- Metadata
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Ensure one record per conversation per phase
  UNIQUE(conversation_id, phase)
);

-- Index for efficient phase queries
CREATE INDEX IF NOT EXISTS idx_phase_progress_conversation
ON phase_progress(conversation_id);

CREATE INDEX IF NOT EXISTS idx_phase_progress_status
ON phase_progress(status) WHERE status = 'in_progress';

-- =============================================
-- 3. CREATE uploaded_materials TABLE
-- =============================================

-- Stores documents and context uploaded during Discovery phase
CREATE TABLE IF NOT EXISTS uploaded_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- File metadata
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL, -- e.g., 'pdf', 'docx', 'txt', 'url'
  file_url TEXT, -- Supabase Storage URL or external URL
  file_size INTEGER, -- bytes

  -- Extracted content
  extracted_context JSONB DEFAULT '{}'::jsonb, -- Structured extraction results
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),

  -- Timestamps
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  processed_at TIMESTAMPTZ
);

-- Index for efficient material lookups
CREATE INDEX IF NOT EXISTS idx_uploaded_materials_conversation
ON uploaded_materials(conversation_id);

CREATE INDEX IF NOT EXISTS idx_uploaded_materials_status
ON uploaded_materials(processing_status) WHERE processing_status = 'processing';

-- =============================================
-- 4. CREATE territory_insights TABLE
-- =============================================

-- Stores responses for each research area within 3Cs territories
CREATE TABLE IF NOT EXISTS territory_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Territory identification
  territory TEXT NOT NULL CHECK (territory IN ('company', 'customer', 'competitor')),
  research_area TEXT NOT NULL, -- e.g., 'core_capabilities', 'unmet_needs', 'competitive_moats'

  -- User responses and coach analysis
  responses JSONB DEFAULT '{}'::jsonb, -- Structured Q&A data

  -- Metadata
  status TEXT DEFAULT 'unexplored' CHECK (status IN ('unexplored', 'in_progress', 'mapped')),
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Ensure one record per conversation per research area
  UNIQUE(conversation_id, territory, research_area)
);

-- Index for efficient territory queries
CREATE INDEX IF NOT EXISTS idx_territory_insights_conversation
ON territory_insights(conversation_id);

CREATE INDEX IF NOT EXISTS idx_territory_insights_territory
ON territory_insights(territory);

CREATE INDEX IF NOT EXISTS idx_territory_insights_status
ON territory_insights(status);

-- =============================================
-- 5. CREATE synthesis_outputs TABLE
-- =============================================

-- Stores generated synthesis artifacts (opportunities, insights, strategic bets)
CREATE TABLE IF NOT EXISTS synthesis_outputs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Output identification
  output_type TEXT NOT NULL CHECK (output_type IN ('opportunity', 'insight', 'strategic_bet')),

  -- Content
  title TEXT NOT NULL,
  description TEXT,
  evidence JSONB DEFAULT '[]'::jsonb, -- Array of evidence links to territory insights
  confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high')),

  -- For strategic bets
  hypothesis TEXT, -- Structured bet hypothesis
  success_criteria JSONB DEFAULT '[]'::jsonb, -- Array of measurable outcomes

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for efficient synthesis queries
CREATE INDEX IF NOT EXISTS idx_synthesis_outputs_conversation
ON synthesis_outputs(conversation_id);

CREATE INDEX IF NOT EXISTS idx_synthesis_outputs_type
ON synthesis_outputs(output_type);

-- =============================================
-- 6. UPDATE RLS POLICIES
-- =============================================

-- phase_progress policies
ALTER TABLE phase_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their org's phase progress" ON phase_progress;
CREATE POLICY "Users can view their org's phase progress"
  ON phase_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = phase_progress.conversation_id
      AND conversations.clerk_org_id = current_setting('request.jwt.claims', true)::json->>'org_id'
    )
  );

DROP POLICY IF EXISTS "Users can update their org's phase progress" ON phase_progress;
CREATE POLICY "Users can update their org's phase progress"
  ON phase_progress FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = phase_progress.conversation_id
      AND conversations.clerk_org_id = current_setting('request.jwt.claims', true)::json->>'org_id'
    )
  );

-- uploaded_materials policies
ALTER TABLE uploaded_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their org's uploaded materials" ON uploaded_materials;
CREATE POLICY "Users can view their org's uploaded materials"
  ON uploaded_materials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = uploaded_materials.conversation_id
      AND conversations.clerk_org_id = current_setting('request.jwt.claims', true)::json->>'org_id'
    )
  );

DROP POLICY IF EXISTS "Users can manage their org's uploaded materials" ON uploaded_materials;
CREATE POLICY "Users can manage their org's uploaded materials"
  ON uploaded_materials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = uploaded_materials.conversation_id
      AND conversations.clerk_org_id = current_setting('request.jwt.claims', true)::json->>'org_id'
    )
  );

-- territory_insights policies
ALTER TABLE territory_insights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their org's territory insights" ON territory_insights;
CREATE POLICY "Users can view their org's territory insights"
  ON territory_insights FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = territory_insights.conversation_id
      AND conversations.clerk_org_id = current_setting('request.jwt.claims', true)::json->>'org_id'
    )
  );

DROP POLICY IF EXISTS "Users can manage their org's territory insights" ON territory_insights;
CREATE POLICY "Users can manage their org's territory insights"
  ON territory_insights FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = territory_insights.conversation_id
      AND conversations.clerk_org_id = current_setting('request.jwt.claims', true)::json->>'org_id'
    )
  );

-- synthesis_outputs policies
ALTER TABLE synthesis_outputs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their org's synthesis outputs" ON synthesis_outputs;
CREATE POLICY "Users can view their org's synthesis outputs"
  ON synthesis_outputs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = synthesis_outputs.conversation_id
      AND conversations.clerk_org_id = current_setting('request.jwt.claims', true)::json->>'org_id'
    )
  );

DROP POLICY IF EXISTS "Users can manage their org's synthesis outputs" ON synthesis_outputs;
CREATE POLICY "Users can manage their org's synthesis outputs"
  ON synthesis_outputs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = synthesis_outputs.conversation_id
      AND conversations.clerk_org_id = current_setting('request.jwt.claims', true)::json->>'org_id'
    )
  );

-- =============================================
-- 7. CREATE HELPER FUNCTIONS
-- =============================================

-- Function to initialize phase progress for a new conversation
CREATE OR REPLACE FUNCTION initialize_phase_progress(p_conversation_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO phase_progress (conversation_id, phase, status, progress_pct)
  VALUES
    (p_conversation_id, 'discovery', 'in_progress', 0),
    (p_conversation_id, 'research', 'pending', 0),
    (p_conversation_id, 'synthesis', 'pending', 0),
    (p_conversation_id, 'bets', 'pending', 0)
  ON CONFLICT (conversation_id, phase) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to update phase progress
CREATE OR REPLACE FUNCTION update_phase_progress(
  p_conversation_id UUID,
  p_phase TEXT,
  p_status TEXT,
  p_progress_pct INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE phase_progress
  SET
    status = p_status,
    progress_pct = p_progress_pct,
    updated_at = NOW(),
    started_at = CASE WHEN p_status = 'in_progress' AND started_at IS NULL THEN NOW() ELSE started_at END,
    completed_at = CASE WHEN p_status = 'completed' THEN NOW() ELSE completed_at END
  WHERE conversation_id = p_conversation_id
    AND phase = p_phase;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 8. ADD UPDATED_AT TRIGGERS
-- =============================================

-- Trigger for phase_progress
CREATE OR REPLACE FUNCTION update_phase_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS phase_progress_updated_at ON phase_progress;
CREATE TRIGGER phase_progress_updated_at
  BEFORE UPDATE ON phase_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_phase_progress_updated_at();

-- Trigger for territory_insights
DROP TRIGGER IF EXISTS territory_insights_updated_at ON territory_insights;
CREATE TRIGGER territory_insights_updated_at
  BEFORE UPDATE ON territory_insights
  FOR EACH ROW
  EXECUTE FUNCTION update_phase_progress_updated_at();

-- Trigger for synthesis_outputs
DROP TRIGGER IF EXISTS synthesis_outputs_updated_at ON synthesis_outputs;
CREATE TRIGGER synthesis_outputs_updated_at
  BEFORE UPDATE ON synthesis_outputs
  FOR EACH ROW
  EXECUTE FUNCTION update_phase_progress_updated_at();
