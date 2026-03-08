-- Add original_opportunities column to synthesis_outputs for revert support
-- Stores the AI-generated opportunities before any user edits
ALTER TABLE synthesis_outputs
ADD COLUMN IF NOT EXISTS original_opportunities JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN synthesis_outputs.original_opportunities IS 'Stores the original AI-generated opportunities array before user edits, enabling revert functionality';
