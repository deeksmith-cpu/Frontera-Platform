-- =============================================
-- ADMIN WORKFLOW MIGRATION
-- Adds approval workflow and invitation tracking
-- =============================================

-- =============================================
-- 1. UPDATE ONBOARDING STATUS ENUM
-- =============================================

-- Add new status values to the enum
ALTER TYPE onboarding_status ADD VALUE IF NOT EXISTS 'approved';
ALTER TYPE onboarding_status ADD VALUE IF NOT EXISTS 'rejected';
ALTER TYPE onboarding_status ADD VALUE IF NOT EXISTS 'provisioned';

-- =============================================
-- 2. ADD ADMIN TRACKING COLUMNS TO client_onboarding
-- =============================================

-- Add columns for admin workflow tracking
ALTER TABLE client_onboarding
ADD COLUMN IF NOT EXISTS reviewed_by TEXT,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS review_notes TEXT,
ADD COLUMN IF NOT EXISTS invitation_status TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS invitation_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS invitation_email TEXT,
ADD COLUMN IF NOT EXISTS provisioned_org_id TEXT;

-- Add check constraint for invitation_status
ALTER TABLE client_onboarding
ADD CONSTRAINT valid_invitation_status
CHECK (invitation_status IS NULL OR invitation_status IN ('sent', 'accepted', 'expired', 'revoked'));

-- =============================================
-- 3. CREATE INDEX FOR ADMIN QUERIES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_client_onboarding_status_submitted
ON client_onboarding(status) WHERE status = 'submitted';

CREATE INDEX IF NOT EXISTS idx_client_onboarding_invitation_status
ON client_onboarding(invitation_status) WHERE invitation_status IS NOT NULL;

-- =============================================
-- 4. UPDATE RLS POLICIES FOR ADMIN ACCESS
-- =============================================

-- Super admins can update any onboarding record (for approval workflow)
DROP POLICY IF EXISTS "Super admins can update onboarding" ON client_onboarding;
CREATE POLICY "Super admins can update onboarding"
  ON client_onboarding FOR UPDATE
  USING (public.is_super_admin());
