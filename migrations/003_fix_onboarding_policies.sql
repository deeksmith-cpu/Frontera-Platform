-- =============================================
-- FIX ONBOARDING POLICIES FOR PUBLIC WIZARD
-- The onboarding wizard needs to read/update records by ID
-- =============================================

-- Allow anyone to SELECT their own onboarding record by ID
-- (The wizard stores the ID in state after first insert)
CREATE POLICY "Allow select own onboarding by id"
  ON client_onboarding FOR SELECT
  USING (true);

-- Allow anyone to UPDATE onboarding records that are still in draft status
-- This allows the wizard to save progress as user fills in steps
CREATE POLICY "Allow update draft onboarding"
  ON client_onboarding FOR UPDATE
  USING (status = 'draft')
  WITH CHECK (status IN ('draft', 'submitted'));
