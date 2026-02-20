-- =============================================
-- LIVING STRATEGY TABLES (PSC v3.0 Sprints 10-13)
-- Creates tables for assumption tracking, strategy signals,
-- strategy versioning, and shareable artefacts.
-- Also extends the conversations.current_phase constraint
-- to support activation and review phases.
-- =============================================

-- =============================================
-- 1. UPDATE conversations.current_phase CONSTRAINT
-- =============================================

-- Drop old constraint that only allows 4 phases
ALTER TABLE conversations
DROP CONSTRAINT IF EXISTS valid_current_phase;

-- Re-create with all 6 phases
ALTER TABLE conversations
ADD CONSTRAINT valid_current_phase
CHECK (current_phase IS NULL OR current_phase IN (
  'discovery', 'research', 'synthesis', 'bets', 'activation', 'review'
));

-- =============================================
-- 2. CREATE assumption_register TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS assumption_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  clerk_org_id TEXT NOT NULL,

  assumption_text TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  status TEXT NOT NULL DEFAULT 'untested'
    CHECK (status IN ('untested', 'validated', 'invalidated')),
  evidence TEXT,

  linked_bet_ids UUID[] DEFAULT '{}',
  linked_signal_ids UUID[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_assumption_register_conversation
  ON assumption_register(conversation_id);

CREATE INDEX IF NOT EXISTS idx_assumption_register_org
  ON assumption_register(clerk_org_id);

CREATE INDEX IF NOT EXISTS idx_assumption_register_status
  ON assumption_register(status);

-- =============================================
-- 3. CREATE strategy_signals TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS strategy_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  clerk_org_id TEXT NOT NULL,

  signal_type TEXT NOT NULL
    CHECK (signal_type IN ('competitor', 'customer', 'market', 'internal')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact_assessment TEXT,

  linked_assumption_ids UUID[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_strategy_signals_conversation
  ON strategy_signals(conversation_id);

CREATE INDEX IF NOT EXISTS idx_strategy_signals_org
  ON strategy_signals(clerk_org_id);

CREATE INDEX IF NOT EXISTS idx_strategy_signals_type
  ON strategy_signals(signal_type);

-- =============================================
-- 4. CREATE strategy_versions TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS strategy_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  clerk_org_id TEXT NOT NULL,

  version_number INTEGER NOT NULL DEFAULT 1,
  snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  change_narrative TEXT,
  trigger TEXT NOT NULL DEFAULT 'manual'
    CHECK (trigger IN ('phase_completion', 'manual', 'signal_triggered', 'review')),

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Ensure unique version numbers per conversation
  UNIQUE(conversation_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_strategy_versions_conversation
  ON strategy_versions(conversation_id);

CREATE INDEX IF NOT EXISTS idx_strategy_versions_org
  ON strategy_versions(clerk_org_id);

-- =============================================
-- 5. CREATE strategic_artefacts TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS strategic_artefacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  clerk_org_id TEXT NOT NULL,

  artefact_type TEXT NOT NULL
    CHECK (artefact_type IN (
      'team_brief', 'guardrails', 'okr_cascade',
      'decision_framework', 'stakeholder_pack', 'evidence_summary'
    )),
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  audience TEXT,
  share_token TEXT UNIQUE,
  is_living BOOLEAN DEFAULT FALSE,
  source_bet_id UUID REFERENCES strategic_bets(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_strategic_artefacts_conversation
  ON strategic_artefacts(conversation_id);

CREATE INDEX IF NOT EXISTS idx_strategic_artefacts_org
  ON strategic_artefacts(clerk_org_id);

CREATE INDEX IF NOT EXISTS idx_strategic_artefacts_share_token
  ON strategic_artefacts(share_token) WHERE share_token IS NOT NULL;

-- =============================================
-- 6. RLS POLICIES (Service role full access)
-- =============================================

ALTER TABLE assumption_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_artefacts ENABLE ROW LEVEL SECURITY;

-- assumption_register
CREATE POLICY "Service role full access on assumption_register"
  ON assumption_register FOR ALL
  USING (true)
  WITH CHECK (true);

-- strategy_signals
CREATE POLICY "Service role full access on strategy_signals"
  ON strategy_signals FOR ALL
  USING (true)
  WITH CHECK (true);

-- strategy_versions
CREATE POLICY "Service role full access on strategy_versions"
  ON strategy_versions FOR ALL
  USING (true)
  WITH CHECK (true);

-- strategic_artefacts
CREATE POLICY "Service role full access on strategic_artefacts"
  ON strategic_artefacts FOR ALL
  USING (true)
  WITH CHECK (true);

-- =============================================
-- 7. UPDATED_AT TRIGGERS
-- =============================================

-- Reuse existing trigger function (created in 005_product_strategy_agent.sql)
-- update_phase_progress_updated_at() sets NEW.updated_at = NOW()

DROP TRIGGER IF EXISTS assumption_register_updated_at ON assumption_register;
CREATE TRIGGER assumption_register_updated_at
  BEFORE UPDATE ON assumption_register
  FOR EACH ROW
  EXECUTE FUNCTION update_phase_progress_updated_at();

DROP TRIGGER IF EXISTS strategy_signals_updated_at ON strategy_signals;
CREATE TRIGGER strategy_signals_updated_at
  BEFORE UPDATE ON strategy_signals
  FOR EACH ROW
  EXECUTE FUNCTION update_phase_progress_updated_at();

DROP TRIGGER IF EXISTS strategic_artefacts_updated_at ON strategic_artefacts;
CREATE TRIGGER strategic_artefacts_updated_at
  BEFORE UPDATE ON strategic_artefacts
  FOR EACH ROW
  EXECUTE FUNCTION update_phase_progress_updated_at();
