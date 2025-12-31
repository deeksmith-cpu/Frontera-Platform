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


-- ==============================================
-- CLERK AUTH INTEGRATION TABLES
-- ==============================================

-- Create enum types for new tables
CREATE TYPE agent_type AS ENUM (
  'strategy_coach',
  'product_coach',
  'team_coach',
  'general'
);

CREATE TYPE output_type AS ENUM (
  'strategy_document',
  'roadmap',
  'okr_framework',
  'team_charter',
  'transformation_plan',
  'assessment_report',
  'custom'
);

CREATE TYPE client_tier AS ENUM (
  'pilot',
  'standard',
  'enterprise'
);

CREATE TYPE conversation_status AS ENUM (
  'active',
  'archived',
  'completed'
);

CREATE TYPE output_status AS ENUM (
  'draft',
  'review',
  'approved',
  'archived'
);

-- ==============================================
-- CLIENTS TABLE (Tenant Configuration)
-- ==============================================
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_org_id TEXT UNIQUE NOT NULL,

  -- Organization metadata
  company_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,

  -- Context (can be imported from onboarding)
  industry TEXT,
  company_size TEXT,
  strategic_focus TEXT,
  pain_points TEXT,
  target_outcomes TEXT,

  -- Customization
  branding JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{
    "timezone": "Europe/London",
    "language": "en-GB",
    "features": {}
  }'::jsonb,

  -- Subscription tier
  tier client_tier DEFAULT 'pilot',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Link to original onboarding record
  onboarding_id UUID REFERENCES client_onboarding(id)
);

-- ==============================================
-- CONVERSATIONS TABLE (Agent History)
-- ==============================================
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_org_id TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,

  -- Conversation metadata
  title TEXT,
  agent_type agent_type NOT NULL,

  -- State management
  framework_state JSONB DEFAULT '{}'::jsonb,
  context_summary TEXT,

  -- Status
  status conversation_status DEFAULT 'active',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),

  -- Foreign key
  CONSTRAINT fk_client
    FOREIGN KEY (clerk_org_id)
    REFERENCES clients(clerk_org_id)
    ON DELETE CASCADE
);

-- ==============================================
-- CONVERSATION MESSAGES TABLE
-- ==============================================
CREATE TABLE conversation_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  clerk_org_id TEXT NOT NULL,

  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  token_count INTEGER,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================
-- STRATEGIC OUTPUTS TABLE (Generated Documents)
-- ==============================================
CREATE TABLE strategic_outputs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_org_id TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,

  -- Document metadata
  title TEXT NOT NULL,
  output_type output_type NOT NULL,

  -- Content
  content JSONB NOT NULL,
  content_markdown TEXT,

  -- Versioning
  version INTEGER DEFAULT 1,
  parent_id UUID REFERENCES strategic_outputs(id),

  -- Status
  status output_status DEFAULT 'draft',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Foreign key
  CONSTRAINT fk_client
    FOREIGN KEY (clerk_org_id)
    REFERENCES clients(clerk_org_id)
    ON DELETE CASCADE
);

-- ==============================================
-- INDEXES
-- ==============================================
CREATE INDEX idx_clients_clerk_org_id ON clients(clerk_org_id);
CREATE INDEX idx_clients_slug ON clients(slug);

CREATE INDEX idx_conversations_clerk_org_id ON conversations(clerk_org_id);
CREATE INDEX idx_conversations_clerk_user_id ON conversations(clerk_user_id);
CREATE INDEX idx_conversations_status ON conversations(status);

CREATE INDEX idx_conversation_messages_conversation_id ON conversation_messages(conversation_id);
CREATE INDEX idx_conversation_messages_clerk_org_id ON conversation_messages(clerk_org_id);

CREATE INDEX idx_strategic_outputs_clerk_org_id ON strategic_outputs(clerk_org_id);
CREATE INDEX idx_strategic_outputs_type ON strategic_outputs(output_type);
CREATE INDEX idx_strategic_outputs_status ON strategic_outputs(status);

-- ==============================================
-- TRIGGERS FOR updated_at
-- ==============================================
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strategic_outputs_updated_at
  BEFORE UPDATE ON strategic_outputs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- ROW LEVEL SECURITY
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_outputs ENABLE ROW LEVEL SECURITY;

-- Helper function to get org_id from JWT
CREATE OR REPLACE FUNCTION auth.org_id()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'org_id',
    ''
  )
$$ LANGUAGE sql STABLE;

-- Helper function to get user_id from JWT
CREATE OR REPLACE FUNCTION auth.clerk_user_id()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'user_id',
    ''
  )
$$ LANGUAGE sql STABLE;

-- Helper function to check if user is super admin
CREATE OR REPLACE FUNCTION auth.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::json->'metadata'->>'role') = 'frontera:super_admin',
    false
  )
$$ LANGUAGE sql STABLE;

-- ==============================================
-- CLIENTS TABLE POLICIES
-- ==============================================

-- Super admins can do everything with clients
CREATE POLICY "Super admins full access to clients"
  ON clients FOR ALL
  USING (auth.is_super_admin());

-- Org members can view their own client
CREATE POLICY "Org members can view own client"
  ON clients FOR SELECT
  USING (clerk_org_id = auth.org_id());

-- ==============================================
-- CONVERSATIONS TABLE POLICIES
-- ==============================================

-- Super admins can access all conversations
CREATE POLICY "Super admins full access to conversations"
  ON conversations FOR ALL
  USING (auth.is_super_admin());

-- Org members can view conversations in their org
CREATE POLICY "Org members can view org conversations"
  ON conversations FOR SELECT
  USING (clerk_org_id = auth.org_id());

-- Org members can create conversations
CREATE POLICY "Org members can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (clerk_org_id = auth.org_id());

-- Users can update their own conversations
CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (
    clerk_org_id = auth.org_id()
    AND clerk_user_id = auth.clerk_user_id()
  );

-- ==============================================
-- CONVERSATION MESSAGES TABLE POLICIES
-- ==============================================

-- Super admins can access all messages
CREATE POLICY "Super admins full access to messages"
  ON conversation_messages FOR ALL
  USING (auth.is_super_admin());

-- Org members can view messages in their org
CREATE POLICY "Org members can view org messages"
  ON conversation_messages FOR SELECT
  USING (clerk_org_id = auth.org_id());

-- Org members can create messages
CREATE POLICY "Org members can create messages"
  ON conversation_messages FOR INSERT
  WITH CHECK (clerk_org_id = auth.org_id());

-- ==============================================
-- STRATEGIC OUTPUTS TABLE POLICIES
-- ==============================================

-- Super admins can access all outputs
CREATE POLICY "Super admins full access to outputs"
  ON strategic_outputs FOR ALL
  USING (auth.is_super_admin());

-- Org members can view outputs in their org
CREATE POLICY "Org members can view org outputs"
  ON strategic_outputs FOR SELECT
  USING (clerk_org_id = auth.org_id());

-- Org members can create outputs
CREATE POLICY "Org members can create outputs"
  ON strategic_outputs FOR INSERT
  WITH CHECK (clerk_org_id = auth.org_id());

-- Users can update their own outputs
CREATE POLICY "Users can update own outputs"
  ON strategic_outputs FOR UPDATE
  USING (
    clerk_org_id = auth.org_id()
    AND clerk_user_id = auth.clerk_user_id()
  );
