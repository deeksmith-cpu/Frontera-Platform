import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { matchThemesToContext } from '@/lib/knowledge/leadership-themes';
import type { LeadershipTheme } from '@/lib/knowledge/leadership-themes';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

interface PlaybookTheme {
  title: string;
  relevanceExplanation: string;
  expertQuotes: { speaker: string; company: string; quote: string; context: string }[];
  actionablePractices: { title: string; description: string; frequency: string }[];
  recommendedListening: { episodeTitle: string; speaker: string; topic: string }[];
}

/**
 * GET /api/product-strategy-agent-v2/leadership-playbook
 * Retrieve existing playbook for a conversation
 */
export async function GET(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conversationId = req.nextUrl.searchParams.get('conversation_id');
  if (!conversationId) {
    return Response.json({ error: 'conversation_id required' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Check conversation exists and get framework_state
  const { data: conversation, error } = await supabase
    .from('conversations')
    .select('framework_state')
    .eq('id', conversationId)
    .eq('clerk_org_id', orgId)
    .single();

  if (error || !conversation) {
    return Response.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const frameworkState = conversation.framework_state as Record<string, unknown> | null;
  const playbook = frameworkState?.leadershipPlaybook as Record<string, unknown> | null;

  return Response.json({ playbook: playbook || null });
}

/**
 * POST /api/product-strategy-agent-v2/leadership-playbook
 * Generate a new leadership playbook
 */
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { conversation_id } = body;

  if (!conversation_id) {
    return Response.json({ error: 'conversation_id required' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Fetch conversation and client context
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .select('framework_state, clerk_org_id')
    .eq('id', conversation_id)
    .eq('clerk_org_id', orgId)
    .single();

  if (convError || !conversation) {
    return Response.json({ error: 'Conversation not found' }, { status: 404 });
  }

  // Check phase - must be at least research
  const frameworkState = (conversation.framework_state as Record<string, unknown>) || {};
  const currentPhase = frameworkState.currentPhase as string || 'discovery';
  if (currentPhase === 'discovery') {
    return Response.json({ error: 'Complete Research phase first', locked: true }, { status: 403 });
  }

  // Fetch client context for personalization
  const { data: client } = await supabase
    .from('clients')
    .select('industry, pain_points, strategic_focus')
    .eq('clerk_org_id', orgId)
    .single();

  // Match themes to user context
  const themes: LeadershipTheme[] = matchThemesToContext({
    painPoints: client?.pain_points || undefined,
    industry: client?.industry || undefined,
    strategicFocus: client?.strategic_focus || undefined,
  });

  // Build playbook
  const playbookThemes: PlaybookTheme[] = themes.slice(0, 5).map(theme => ({
    title: theme.title,
    relevanceExplanation: buildRelevanceExplanation(theme, client),
    expertQuotes: theme.expertQuotes.map(q => ({
      speaker: q.speaker,
      company: q.company,
      quote: q.quote,
      context: q.context,
    })),
    actionablePractices: theme.actionablePractices.map(p => ({
      title: p.title,
      description: p.description,
      frequency: p.frequency,
    })),
    recommendedListening: theme.recommendedListening,
  }));

  const playbook = {
    themes: playbookThemes,
    generatedAt: new Date().toISOString(),
    generationContext: {
      industry: client?.industry || null,
      painPoints: client?.pain_points || null,
      strategicFocus: client?.strategic_focus || null,
      phase: currentPhase,
    },
  };

  // Save to framework_state
  const { error: updateError } = await supabase
    .from('conversations')
    .update({
      framework_state: { ...frameworkState, leadershipPlaybook: playbook },
    })
    .eq('id', conversation_id)
    .eq('clerk_org_id', orgId);

  if (updateError) {
    return Response.json({ error: 'Failed to save playbook' }, { status: 500 });
  }

  return Response.json({ success: true, playbook });
}

function buildRelevanceExplanation(
  theme: LeadershipTheme,
  client: { industry?: string | null; pain_points?: string | null; strategic_focus?: string | null } | null
): string {
  const parts: string[] = [];
  parts.push(`${theme.title} is critical for leaders navigating ${theme.description.toLowerCase()}`);

  if (client?.industry) {
    parts.push(`In the ${client.industry} sector, this capability is especially important.`);
  }
  if (client?.pain_points) {
    parts.push(`Given your challenges around "${client.pain_points}", this theme directly addresses skill gaps that may be holding back execution.`);
  }

  return parts.join(' ');
}
