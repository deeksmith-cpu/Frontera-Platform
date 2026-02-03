-- Strategic Theses — groups bets under coherent strategic choices (Martin)
CREATE TABLE strategic_theses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT NOT NULL,

  opportunity_id TEXT NOT NULL,
  ptw_winning_aspiration TEXT,
  ptw_where_to_play TEXT,
  ptw_how_to_win TEXT,

  dhm_delight TEXT,
  dhm_hard_to_copy TEXT,
  dhm_margin_enhancing TEXT,

  thesis_type TEXT NOT NULL CHECK (thesis_type IN ('offensive','defensive','capability')),
  time_horizon TEXT CHECK (time_horizon IN ('90d','6m','12m','18m')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_strategic_theses_conversation ON strategic_theses(conversation_id);

-- Strategic Bets — individual testable initiatives within a thesis
CREATE TABLE strategic_bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  strategic_thesis_id UUID REFERENCES strategic_theses(id) ON DELETE SET NULL,

  -- 5-part hypothesis (Christensen demand-side + Duke kill criteria)
  job_to_be_done TEXT NOT NULL,
  belief TEXT NOT NULL,
  bet TEXT NOT NULL,
  success_metric TEXT NOT NULL,
  kill_criteria TEXT,
  kill_date DATE,

  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','proposed','accepted','prioritized')),

  opportunity_id TEXT NOT NULL,
  evidence_links JSONB NOT NULL DEFAULT '[]',
  assumption_being_tested TEXT,

  ptw_where_to_play TEXT,
  ptw_how_to_win TEXT,

  -- Janakiraman 4-dimension scoring
  expected_impact INTEGER CHECK (expected_impact BETWEEN 1 AND 10),
  certainty_of_impact INTEGER CHECK (certainty_of_impact BETWEEN 1 AND 10),
  clarity_of_levers INTEGER CHECK (clarity_of_levers BETWEEN 1 AND 10),
  uniqueness_of_levers INTEGER CHECK (uniqueness_of_levers BETWEEN 1 AND 10),
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  priority_level TEXT CHECK (priority_level IN ('high','medium','low')),
  confidence TEXT CHECK (confidence IN ('low','medium','high')),
  time_horizon TEXT CHECK (time_horizon IN ('90d','6m','12m','18m')),

  -- Strategic risks (not solution risks)
  risks JSONB DEFAULT '{}',

  -- Sequencing
  depends_on UUID[] DEFAULT '{}',

  agent_generated BOOLEAN DEFAULT FALSE,
  agent_reasoning TEXT,
  user_modified BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_strategic_bets_conversation ON strategic_bets(conversation_id);
CREATE INDEX idx_strategic_bets_thesis ON strategic_bets(strategic_thesis_id);

-- RLS policies
ALTER TABLE strategic_theses ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on strategic_theses"
  ON strategic_theses FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on strategic_bets"
  ON strategic_bets FOR ALL
  USING (true)
  WITH CHECK (true);
