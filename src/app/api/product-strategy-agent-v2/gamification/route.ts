import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { getXPAmount } from '@/lib/gamification/xp-rules';
import { getLevelInfo, checkLevelUp } from '@/lib/gamification/levels';
import { checkAchievements } from '@/lib/gamification/achievements';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

/** GET — fetch current gamification state */
export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  // Get or create user gamification record
  let { data: gamification } = await supabase
    .from('user_gamification')
    .select('*')
    .eq('clerk_user_id', userId)
    .eq('clerk_org_id', orgId)
    .single();

  if (!gamification) {
    const { data: newRecord } = await supabase
      .from('user_gamification')
      .insert({
        clerk_user_id: userId,
        clerk_org_id: orgId,
        xp_total: 0,
        level: 1,
        streak_days: 0,
      })
      .select()
      .single();
    gamification = newRecord;
  }

  // Get achievements
  const { data: achievements } = await supabase
    .from('user_achievements')
    .select('achievement_id, earned_at')
    .eq('clerk_user_id', userId)
    .eq('clerk_org_id', orgId);

  const levelInfo = getLevelInfo(gamification?.xp_total || 0);

  return Response.json({
    xpTotal: gamification?.xp_total || 0,
    level: levelInfo.level,
    levelTitle: levelInfo.title,
    xpForNextLevel: levelInfo.xpForNextLevel,
    progressInLevel: levelInfo.progressInLevel,
    streakDays: gamification?.streak_days || 0,
    achievements: (achievements || []).map(a => a.achievement_id),
  });
}

/** POST — award XP for an event */
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { eventType, metadata } = body as {
    eventType: string;
    metadata?: Record<string, unknown>;
  };

  if (!eventType) {
    return Response.json({ error: 'eventType is required' }, { status: 400 });
  }

  const xpAmount = getXPAmount(eventType);
  if (xpAmount === 0) {
    return Response.json({ error: `Unknown event type: ${eventType}` }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Get or create user gamification record
  let { data: gamification } = await supabase
    .from('user_gamification')
    .select('*')
    .eq('clerk_user_id', userId)
    .eq('clerk_org_id', orgId)
    .single();

  if (!gamification) {
    const { data: newRecord } = await supabase
      .from('user_gamification')
      .insert({
        clerk_user_id: userId,
        clerk_org_id: orgId,
        xp_total: 0,
        level: 1,
        streak_days: 0,
      })
      .select()
      .single();
    gamification = newRecord;
  }

  const currentXP = gamification?.xp_total || 0;
  const newXP = currentXP + xpAmount;

  // Check for level up
  const levelUp = checkLevelUp(currentXP, xpAmount);
  const newLevelInfo = getLevelInfo(newXP);

  // Update streak
  const today = new Date().toISOString().split('T')[0];
  const lastActive = gamification?.last_active_date;
  let streakDays = gamification?.streak_days || 0;

  if (lastActive !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    streakDays = lastActive === yesterday ? streakDays + 1 : 1;
  }

  // Save XP event
  await supabase.from('xp_events').insert({
    clerk_user_id: userId,
    clerk_org_id: orgId,
    event_type: eventType,
    xp_amount: xpAmount,
    metadata: metadata || {},
  });

  // Update gamification record
  await supabase
    .from('user_gamification')
    .update({
      xp_total: newXP,
      level: newLevelInfo.level,
      streak_days: streakDays,
      last_active_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq('clerk_user_id', userId)
    .eq('clerk_org_id', orgId);

  // Check achievements
  const { data: existingAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('clerk_user_id', userId)
    .eq('clerk_org_id', orgId);

  const existingIds = (existingAchievements || []).map(a => a.achievement_id);
  const newAchievements = checkAchievements(eventType, existingIds);

  // Insert new achievements
  if (newAchievements.length > 0) {
    await supabase.from('user_achievements').insert(
      newAchievements.map(id => ({
        clerk_user_id: userId,
        clerk_org_id: orgId,
        achievement_id: id,
      }))
    );
  }

  return Response.json({
    xpAwarded: xpAmount,
    xpTotal: newXP,
    level: newLevelInfo.level,
    levelTitle: newLevelInfo.title,
    xpForNextLevel: newLevelInfo.xpForNextLevel,
    progressInLevel: newLevelInfo.progressInLevel,
    streakDays,
    levelUp: levelUp ? { newLevel: levelUp.newLevel } : null,
    newAchievements,
    allAchievements: [...existingIds, ...newAchievements],
  });
}
