-- Strategy Documents — Final 6-page Product Strategy Draft deliverable
CREATE TABLE strategy_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  selected_bet_ids UUID[] NOT NULL DEFAULT '{}',
  document_content JSONB NOT NULL DEFAULT '{}',

  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  exported_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_strategy_documents_conversation ON strategy_documents(conversation_id);

-- RLS policies
ALTER TABLE strategy_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on strategy_documents"
  ON strategy_documents FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comment
COMMENT ON TABLE strategy_documents IS 'Final Product Strategy Draft documents generated from selected strategic bets';
COMMENT ON COLUMN strategy_documents.selected_bet_ids IS 'Array of strategic_bets.id values selected for the strategy';
COMMENT ON COLUMN strategy_documents.document_content IS 'JSONB structure with 6-page content: executiveSummary, ptwCascade, selectedBets, portfolioView, nextSteps';
