'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Target,
  ShieldCheck,
  Users,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface Artefact {
  id: string;
  title: string;
  artefact_type: string;
  content: Record<string, unknown>;
  audience: string | null;
  created_at: string;
  source_bet_id: string | null;
}

interface ActivationSummaryProps {
  conversationId: string;
  onDrillIn: () => void;
}

const STAKEHOLDER_AUDIENCES: Record<string, string> = {
  cpo_ceo: 'CPO / CEO',
  cto: 'CTO',
  sales: 'Sales',
  product_managers: 'Product Managers',
};

const CATEGORY_CONFIG = {
  team_brief: {
    label: 'Team Briefs',
    icon: FileText,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    iconBg: 'bg-cyan-100',
  },
  okr_cascade: {
    label: 'OKR Cascade',
    icon: Target,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
  },
  guardrails: {
    label: 'Guardrails & Decisions',
    icon: ShieldCheck,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
  },
  stakeholder_pack: {
    label: 'Stakeholder Packs',
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    iconBg: 'bg-purple-100',
  },
} as const;

type CategoryKey = keyof typeof CATEGORY_CONFIG;

export function ActivationSummary({ conversationId, onDrillIn }: ActivationSummaryProps) {
  const [artefacts, setArtefacts] = useState<Artefact[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedArtefact, setExpandedArtefact] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchArtefacts() {
      try {
        const res = await fetch('/api/product-strategy-agent/activation');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setArtefacts(data.artefacts || []);
        }
      } catch {
        // Silently handle fetch errors
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchArtefacts();
    return () => { cancelled = true; };
  }, [conversationId]);

  const toggleArtefact = useCallback((id: string) => {
    setExpandedArtefact(prev => prev === id ? null : id);
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4 animate-pulse">
        <div className="h-5 bg-slate-100 rounded w-48" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-slate-50 rounded-2xl" />
          <div className="h-24 bg-slate-50 rounded-2xl" />
          <div className="h-24 bg-slate-50 rounded-2xl" />
          <div className="h-24 bg-slate-50 rounded-2xl" />
        </div>
      </div>
    );
  }

  const teamBriefs = artefacts.filter(a => a.artefact_type === 'team_brief');
  const okrs = artefacts.filter(a => a.artefact_type === 'okr_cascade');
  const guardrailArtefacts = artefacts.filter(a => a.artefact_type === 'guardrails');
  const decisionFrameworks = artefacts.filter(a => a.artefact_type === 'decision_framework');
  const stakeholderPacks = artefacts.filter(a => a.artefact_type === 'stakeholder_pack');

  // Group artefacts by category
  const grouped: { key: CategoryKey; artefacts: Artefact[] }[] = [
    { key: 'team_brief', artefacts: teamBriefs },
    { key: 'okr_cascade', artefacts: okrs },
    { key: 'guardrails', artefacts: [...guardrailArtefacts, ...decisionFrameworks] },
    { key: 'stakeholder_pack', artefacts: stakeholderPacks },
  ];

  const completedCategories = grouped.filter(g => g.artefacts.length > 0).length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 space-y-5 animate-entrance">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Activation Summary
        </h3>
        <button
          onClick={onDrillIn}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#fbbf24] text-xs font-semibold text-slate-900 transition-all duration-300 hover:bg-[#f59e0b] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
        >
          View Dashboard
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Overall progress */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">Activation Artefacts</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {artefacts.length} artefact{artefacts.length !== 1 ? 's' : ''} generated across {completedCategories} of {grouped.length} categories
            </p>
          </div>
          {completedCategories === grouped.length && (
            <div className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Category sections with expandable artefacts */}
      {grouped.map(group => {
        const config = CATEGORY_CONFIG[group.key];
        const Icon = config.icon;
        const hasArtefacts = group.artefacts.length > 0;

        return (
          <div key={group.key} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Category header */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-100">
              <div className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900">{config.label}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {hasArtefacts
                    ? `${group.artefacts.length} artefact${group.artefacts.length !== 1 ? 's' : ''}`
                    : 'Not generated'}
                </p>
              </div>
              {hasArtefacts && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                  {group.artefacts.length}
                </span>
              )}
            </div>

            {/* Artefact list */}
            {hasArtefacts ? (
              <div className="divide-y divide-slate-50">
                {group.artefacts.map(artefact => {
                  const isExpanded = expandedArtefact === artefact.id;
                  const label = getArtefactLabel(artefact);

                  return (
                    <div key={artefact.id}>
                      <button
                        onClick={() => toggleArtefact(artefact.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50/50 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        )}
                        <span className="text-sm text-slate-700 flex-1 min-w-0 truncate">
                          {label}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 ml-7 animate-entrance">
                          <ArtefactContent artefact={artefact} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-4 text-xs text-slate-400 italic">
                No artefacts generated for this category
              </div>
            )}
          </div>
        );
      })}

      {/* Empty state */}
      {artefacts.length === 0 && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No activation artefacts generated</p>
        </div>
      )}
    </div>
  );
}

/** Get a display label for an artefact */
function getArtefactLabel(artefact: Artefact): string {
  if (artefact.artefact_type === 'stakeholder_pack' && artefact.audience) {
    return STAKEHOLDER_AUDIENCES[artefact.audience] || artefact.title;
  }
  if (artefact.artefact_type === 'decision_framework') {
    return 'Decision Framework';
  }
  return artefact.title;
}

/** Render artefact content inline */
function ArtefactContent({ artefact }: { artefact: Artefact }) {
  const c = artefact.content;

  // Fallback: raw text
  if (c.raw && typeof c.raw === 'string') {
    return (
      <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
        {c.raw}
      </div>
    );
  }

  switch (artefact.artefact_type) {
    case 'team_brief':
      return <TeamBriefContent content={c} />;
    case 'okr_cascade':
      return <OKRContent content={c} />;
    case 'guardrails':
      return <GuardrailsContent content={c} />;
    case 'decision_framework':
      return <DecisionFrameworkContent content={c} />;
    case 'stakeholder_pack':
      return <StakeholderPackContent content={c} />;
    default:
      return (
        <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 leading-relaxed">
          <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(c, null, 2)}</pre>
        </div>
      );
  }
}

/** Helper: safely extract a string or return null */
function asString(value: unknown): string | null {
  if (typeof value === 'string' && value.length > 0) return value;
  return null;
}

/** Helper: render a string or string array as a list */
function renderList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(v => typeof v === 'string');
  if (typeof value === 'string') return value.split('\n').filter(Boolean);
  return [];
}

function ContentSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{label}</p>
      {children}
    </div>
  );
}

function TeamBriefContent({ content }: { content: Record<string, unknown> }) {
  const context = asString(content.strategic_context || content.strategicContext);
  const problem = asString(content.problem_statement || content.problemStatement);
  const criteria = content.success_criteria || content.successCriteria;
  const guardrails = content.guardrails as Array<{ weWill?: string; weWillNot?: string }> | undefined;
  const assumptions = content.key_assumptions || content.keyAssumptions;
  const killCriteria = asString(content.kill_criteria || content.killCriteria);

  return (
    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
      {context && (
        <ContentSection label="Strategic Context">
          <p className="text-sm text-slate-600 leading-relaxed">{context}</p>
        </ContentSection>
      )}
      {problem && (
        <ContentSection label="Problem Statement">
          <p className="text-sm text-slate-600 leading-relaxed">{problem}</p>
        </ContentSection>
      )}
      {renderList(criteria).length > 0 && (
        <ContentSection label="Success Criteria">
          <ul className="space-y-1">
            {renderList(criteria).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </ContentSection>
      )}
      {guardrails && guardrails.length > 0 && (
        <ContentSection label="Guardrails">
          <div className="space-y-2">
            {guardrails.map((g, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 text-xs">
                {g.weWill && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                    <span className="font-semibold text-emerald-700">We will:</span>{' '}
                    <span className="text-emerald-600">{g.weWill}</span>
                  </div>
                )}
                {g.weWillNot && (
                  <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    <span className="font-semibold text-red-700">We won&apos;t:</span>{' '}
                    <span className="text-red-600">{g.weWillNot}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ContentSection>
      )}
      {renderList(assumptions).length > 0 && (
        <ContentSection label="Key Assumptions">
          <ul className="space-y-1">
            {renderList(assumptions).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </ContentSection>
      )}
      {killCriteria && (
        <ContentSection label="Kill Criteria">
          <p className="text-sm text-slate-600 leading-relaxed">{killCriteria}</p>
        </ContentSection>
      )}
    </div>
  );
}

function OKRContent({ content }: { content: Record<string, unknown> }) {
  const okrs = content.okrs as Array<{
    objective?: string;
    bet_reference?: string;
    key_results?: Array<{ key_result?: string; kr?: string; target?: string; timeframe?: string }>;
  }> | undefined;
  const timeHorizon = asString(content.time_horizon || content.timeHorizon);

  if (!okrs || okrs.length === 0) {
    return <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-500 italic">No OKRs found</div>;
  }

  return (
    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
      {timeHorizon && (
        <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5 uppercase tracking-wider">
          {timeHorizon}
        </span>
      )}
      {okrs.map((okr, i) => (
        <div key={i} className="bg-white rounded-lg border border-slate-100 p-3">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded px-1.5 py-0.5 flex-shrink-0 mt-0.5 font-[family-name:var(--font-code)]">
              O{i + 1}
            </span>
            <p className="text-sm font-semibold text-slate-800">{okr.objective}</p>
          </div>
          {okr.key_results && okr.key_results.length > 0 && (
            <div className="ml-6 space-y-1.5">
              {okr.key_results.map((kr, j) => (
                <div key={j} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="font-bold text-slate-400 font-[family-name:var(--font-code)] flex-shrink-0 mt-px">
                    KR{j + 1}
                  </span>
                  <span className="flex-1">{kr.key_result || kr.kr}</span>
                  {kr.target && (
                    <span className="text-[10px] text-slate-400 flex-shrink-0">{kr.target}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function GuardrailsContent({ content }: { content: Record<string, unknown> }) {
  const guardrails = content.guardrails as Array<{
    weWill?: string;
    weWillNot?: string;
    rationale?: string;
  }> | undefined;

  if (!guardrails || guardrails.length === 0) {
    return <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-500 italic">No guardrails found</div>;
  }

  return (
    <div className="bg-slate-50 rounded-xl p-4 space-y-2">
      {guardrails.map((g, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
            <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider mb-0.5">We Will</p>
            <p className="text-xs text-emerald-600 leading-relaxed">{g.weWill}</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <p className="text-[10px] font-semibold text-red-700 uppercase tracking-wider mb-0.5">We Won&apos;t</p>
            <p className="text-xs text-red-600 leading-relaxed">{g.weWillNot}</p>
          </div>
          {g.rationale && (
            <p className="col-span-2 text-[10px] text-slate-400 italic px-1">{g.rationale}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function DecisionFrameworkContent({ content }: { content: Record<string, unknown> }) {
  const framework = content.framework as {
    prioritise?: Array<{ rule: string; context?: string }>;
    consider?: Array<{ rule: string; context?: string }>;
    deprioritise?: Array<{ rule: string; context?: string }>;
  } | undefined;

  if (!framework) {
    return <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-500 italic">No framework found</div>;
  }

  const sections = [
    { key: 'prioritise', label: 'Prioritise', items: framework.prioritise, color: 'emerald' },
    { key: 'consider', label: 'Consider', items: framework.consider, color: 'amber' },
    { key: 'deprioritise', label: 'Deprioritise', items: framework.deprioritise, color: 'red' },
  ] as const;

  const colorMap = {
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', dot: 'bg-amber-400' },
    red: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700', dot: 'bg-red-400' },
  };

  return (
    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
      {sections.map(section => {
        if (!section.items || section.items.length === 0) return null;
        const c = colorMap[section.color];
        return (
          <div key={section.key}>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${c.text} mb-1.5`}>{section.label}</p>
            <div className="space-y-1.5">
              {section.items.map((item, i) => (
                <div key={i} className={`${c.bg} border ${c.border} rounded-lg px-3 py-2`}>
                  <p className="text-xs text-slate-700">{item.rule}</p>
                  {item.context && (
                    <p className="text-[10px] text-slate-400 mt-0.5 italic">{item.context}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StakeholderPackContent({ content }: { content: Record<string, unknown> }) {
  const summary = asString(content.executive_summary || content.executiveSummary);
  const implications = content.key_implications || content.keyImplications;
  const changes = content.what_changes || content.whatChanges;
  const stays = content.what_stays_same || content.whatStaysTheSame;
  const questions = content.questions_to_address || content.questionsToAddress;

  return (
    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
      {summary && (
        <ContentSection label="Executive Summary">
          <p className="text-sm text-slate-600 leading-relaxed">{summary}</p>
        </ContentSection>
      )}
      {renderList(implications).length > 0 && (
        <ContentSection label="Key Implications">
          <ul className="space-y-1">
            {renderList(implications).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </ContentSection>
      )}
      {renderList(changes).length > 0 && (
        <ContentSection label="What Changes">
          <ul className="space-y-1">
            {renderList(changes).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </ContentSection>
      )}
      {renderList(stays).length > 0 && (
        <ContentSection label="What Stays the Same">
          <ul className="space-y-1">
            {renderList(stays).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </ContentSection>
      )}
      {renderList(questions).length > 0 && (
        <ContentSection label="Questions to Address">
          <ul className="space-y-1">
            {renderList(questions).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </ContentSection>
      )}
    </div>
  );
}
