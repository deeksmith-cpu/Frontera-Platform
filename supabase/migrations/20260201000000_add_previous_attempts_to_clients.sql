-- Add previous_attempts column to clients table
-- Previously this field only lived on client_onboarding; now it's editable on clients too
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS previous_attempts TEXT;
