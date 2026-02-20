import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  getCaseStudies,
  getCaseStudyById,
  getRelevantCaseStudies,
  getCaseStudyFilterOptions,
} from '@/lib/knowledge/case-studies';

/**
 * GET /api/product-strategy-agent-v2/case-studies
 *
 * Query params:
 *   mode: 'list' | 'detail' | 'relevant' | 'filters' (default: 'list')
 *   id: case study ID (for mode=detail)
 *   industry, stage, challenge, speaker, phase, search: filters (for mode=list)
 *   user_industry, user_stage, user_challenges, user_phase, user_topics: context (for mode=relevant)
 *   limit: max results (default: 20)
 */
export async function GET(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode') || 'list';
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  try {
    if (mode === 'filters') {
      return NextResponse.json(getCaseStudyFilterOptions());
    }

    if (mode === 'detail') {
      const id = searchParams.get('id');
      if (!id) {
        return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
      }
      const cs = getCaseStudyById(id);
      if (!cs) {
        return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
      }
      return NextResponse.json(cs);
    }

    if (mode === 'relevant') {
      const userIndustry = searchParams.get('user_industry') || undefined;
      const userStage = searchParams.get('user_stage') || undefined;
      const userChallenges = searchParams.get('user_challenges')?.split(',').filter(Boolean) || undefined;
      const userPhase = searchParams.get('user_phase') || undefined;
      const userTopics = searchParams.get('user_topics')?.split(',').filter(Boolean) || undefined;

      const results = getRelevantCaseStudies(
        {
          industry: userIndustry,
          companyStage: userStage,
          challenges: userChallenges,
          phase: userPhase,
          topics: userTopics,
        },
        limit
      );
      return NextResponse.json({ cases: results, total: results.length });
    }

    // Default: list with filters
    const cases = getCaseStudies({
      industry: searchParams.get('industry') || undefined,
      companyStage: searchParams.get('stage') || undefined,
      challengeType: searchParams.get('challenge') || undefined,
      phase: searchParams.get('phase') || undefined,
      speaker: searchParams.get('speaker') || undefined,
      search: searchParams.get('search') || undefined,
    });

    const limited = cases.slice(0, limit);
    return NextResponse.json({ cases: limited, total: cases.length });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
