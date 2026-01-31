-- Add 'profiling' to agent_type enum for personal profile conversations
ALTER TYPE agent_type ADD VALUE IF NOT EXISTS 'profiling';
