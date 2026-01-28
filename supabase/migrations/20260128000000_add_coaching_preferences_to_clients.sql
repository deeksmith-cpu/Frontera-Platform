-- Migration: Add coaching_preferences column to clients table
-- Purpose: Store persona preferences for Strategy Coach
-- Structure: { persona?: 'marcus' | 'elena' | 'richard', selected_at?: string, auto_recommended?: boolean }

-- Add coaching_preferences JSONB column with default empty object
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS coaching_preferences JSONB DEFAULT '{}';

-- Add GIN index for efficient JSONB queries (e.g., filtering by persona)
CREATE INDEX IF NOT EXISTS idx_clients_coaching_preferences_gin
  ON public.clients USING GIN (coaching_preferences);

-- Add comment documenting the column structure
COMMENT ON COLUMN public.clients.coaching_preferences IS
  'Coaching persona preferences: { persona?: "marcus" | "elena" | "richard", selected_at?: ISO timestamp, auto_recommended?: boolean }';
