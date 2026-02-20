-- Gamification: user progress, achievements, and XP events

CREATE TABLE user_gamification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  clerk_org_id TEXT NOT NULL,
  xp_total INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(clerk_user_id, clerk_org_id)
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  clerk_org_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(clerk_user_id, clerk_org_id, achievement_id)
);

CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  clerk_org_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  xp_amount INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_gamification_user ON user_gamification(clerk_user_id, clerk_org_id);
CREATE INDEX idx_user_achievements_user ON user_achievements(clerk_user_id, clerk_org_id);
CREATE INDEX idx_xp_events_user ON xp_events(clerk_user_id, clerk_org_id);
CREATE INDEX idx_xp_events_created ON xp_events(created_at DESC);

-- RLS policies
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on user_gamification"
  ON user_gamification FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on user_achievements"
  ON user_achievements FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on xp_events"
  ON xp_events FOR ALL
  USING (true)
  WITH CHECK (true);
