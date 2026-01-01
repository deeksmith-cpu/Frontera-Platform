-- =============================================
-- SECURITY FIXES MIGRATION
-- Run this in Supabase SQL Editor after initial schema
-- =============================================

-- =============================================
-- 0. CREATE HELPER FUNCTIONS (in public schema)
-- =============================================

-- Helper function to get org_id from JWT
CREATE OR REPLACE FUNCTION public.get_org_id()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'org_id',
    ''
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function to get user_id from JWT
CREATE OR REPLACE FUNCTION public.get_clerk_user_id()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'user_id',
    ''
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::json->'metadata'->>'role') = 'frontera:super_admin',
    false
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- =============================================
-- 1. FIX client_onboarding TABLE POLICIES
-- The original "Allow all operations" policy exposed all lead data
-- =============================================

-- Drop the insecure policy
DROP POLICY IF EXISTS "Allow all operations" ON client_onboarding;

-- Allow public INSERT for lead generation (anonymous users can submit)
CREATE POLICY "Allow public insert for lead gen"
  ON client_onboarding FOR INSERT
  WITH CHECK (true);

-- Super admins can view all onboarding records
CREATE POLICY "Super admins can view all onboarding"
  ON client_onboarding FOR SELECT
  USING (public.is_super_admin());

-- Org members can view their linked onboarding record
CREATE POLICY "Org members can view linked onboarding"
  ON client_onboarding FOR SELECT
  USING (
    id IN (
      SELECT onboarding_id FROM clients
      WHERE clerk_org_id = public.get_org_id()
    )
  );

-- Only super admins can update onboarding records
CREATE POLICY "Super admins can update onboarding"
  ON client_onboarding FOR UPDATE
  USING (public.is_super_admin());

-- Only super admins can delete onboarding records
CREATE POLICY "Super admins can delete onboarding"
  ON client_onboarding FOR DELETE
  USING (public.is_super_admin());

-- =============================================
-- 2. ADD MISSING DELETE POLICIES FOR conversations
-- =============================================

-- Users can delete their own conversations
CREATE POLICY "Users can delete own conversations"
  ON conversations FOR DELETE
  USING (
    clerk_org_id = public.get_org_id()
    AND clerk_user_id = public.get_clerk_user_id()
  );

-- Super admins can delete any conversation
CREATE POLICY "Super admins can delete any conversation"
  ON conversations FOR DELETE
  USING (public.is_super_admin());

-- =============================================
-- 3. ADD MISSING DELETE POLICIES FOR strategic_outputs
-- =============================================

-- Users can delete their own outputs
CREATE POLICY "Users can delete own outputs"
  ON strategic_outputs FOR DELETE
  USING (
    clerk_org_id = public.get_org_id()
    AND clerk_user_id = public.get_clerk_user_id()
  );

-- Super admins can delete any output
CREATE POLICY "Super admins can delete any output"
  ON strategic_outputs FOR DELETE
  USING (public.is_super_admin());

-- =============================================
-- 4. ADD INSERT/UPDATE POLICIES FOR clients TABLE
-- =============================================

-- Super admins can insert clients (webhook creates via service role, but this is a backup)
CREATE POLICY "Super admins can insert clients"
  ON clients FOR INSERT
  WITH CHECK (public.is_super_admin());

-- Org members can update their own client record (e.g., settings, branding)
CREATE POLICY "Org members can update own client"
  ON clients FOR UPDATE
  USING (clerk_org_id = public.get_org_id())
  WITH CHECK (clerk_org_id = public.get_org_id());

-- =============================================
-- VERIFICATION QUERIES (run after migration)
-- =============================================

-- Check policies on client_onboarding:
-- SELECT * FROM pg_policies WHERE tablename = 'client_onboarding';

-- Check policies on conversations:
-- SELECT * FROM pg_policies WHERE tablename = 'conversations';

-- Check policies on strategic_outputs:
-- SELECT * FROM pg_policies WHERE tablename = 'strategic_outputs';

-- Check policies on clients:
-- SELECT * FROM pg_policies WHERE tablename = 'clients';
