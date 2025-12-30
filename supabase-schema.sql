-- Frontera Client Onboarding Schema
-- Run this in your Supabase SQL Editor

-- Create enum types
CREATE TYPE strategic_focus AS ENUM (
  'strategy_to_execution',
  'product_model',
  'team_empowerment',
  'mixed',
  'other'
);

CREATE TYPE success_metric AS ENUM (
  'metrics_evidence',
  'outcomes',
  'revenue',
  'client_growth'
);

CREATE TYPE onboarding_status AS ENUM (
  'draft',
  'submitted',
  'reviewed'
);

-- Create the client_onboarding table
CREATE TABLE client_onboarding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Step 1: Company Basics
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  company_size TEXT NOT NULL,

  -- Step 2: Strategic Focus
  strategic_focus strategic_focus NOT NULL,
  strategic_focus_other TEXT,

  -- Step 3: Transformation Context
  pain_points TEXT NOT NULL,
  previous_attempts TEXT NOT NULL,
  additional_context TEXT,

  -- Step 4: Success Criteria
  success_metrics success_metric[] NOT NULL DEFAULT '{}',
  target_outcomes TEXT NOT NULL,
  timeline_expectations TEXT,

  -- Status
  status onboarding_status DEFAULT 'draft' NOT NULL,
  current_step INTEGER DEFAULT 1 NOT NULL
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_client_onboarding_updated_at
  BEFORE UPDATE ON client_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE client_onboarding ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for now (update with auth later)
CREATE POLICY "Allow all operations" ON client_onboarding
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_client_onboarding_status ON client_onboarding(status);
CREATE INDEX idx_client_onboarding_created_at ON client_onboarding(created_at DESC);
