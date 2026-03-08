'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  FileText,
  Target,
  ShieldCheck,
  Users,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

type ArtefactType = 'team_brief' | 'guardrails' | 'okr_cascade' | 'decision_framework' | 'stakeholder_pack';

interface Artefact {
  id: string;
  title: string;
  artefact_type: ArtefactType;
  content: Record<string, unknown>;
  audience: string | null;
  created_at: string;
  source_bet_id: string | null;
}

interface BetSummary {
  id: string;
  bet: string;
  thesis_type?: string;
}

interface ActivationDashboardProps {
  conversationId: string;
  artefacts: Artefact[];
  generating: string | null;
  onGenerate: (type: ArtefactType, betId?: string, audience?: string) => Promise<void>;
}

const STAKEHOLDER_AUDIENCES = [
  { value: 'cpo_ceo', label: 'CPO / CEO' },
  { value: 'cto', label: 'CTO' },
  { value: 'sales', label: 'Sales' },
  { value: 'product_managers', label: 'Product Managers' },
];

export function ActivationDashboard({
  conversationId,
  artefacts,
  generating,
  onGenerate,
}: ActivationDashboardProps) {
  const [bets, setBets] = useState<BetSummary[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Fetch bets to show completeness
  useEffect(() => {
    async function loadBets() {
      try {
        const res = await fetch(
          `/api/product-strategy-agent/bets?conversation_id=${conversationId}`
        );
        if (res.ok) {
          const data = await res.json();
          const allBets: BetSummary[] = [];
          if (data.theses) {
            for (const thesis of data.theses) {
              for (const bet of thesis.bets || []) {
                allBets.push({ id: bet.id, bet: bet.bet, thesis_type: thesis.thesis_type });
              }
            }
          }
          if (data.ungroupedBets) {
            for (const bet of data.ungroupedBets) {
              allBets.push({ id: bet.id, bet: bet.bet });
            }
          }
          setBets(allBets);
        }
      } catch (err) {
        console.error('Failed to load bets for dashboard:', err);
      }
    }
    loadBets();
  }, [conversationId]);

  const toggleCategory = useCallback((id: string) => {
    setExpandedCategory((prev) => (prev === id ? null : id));
  }, []);

  // Derived counts
  const teamBriefs = artefacts.filter((a) => a.artefact_type === 'team_brief');
  const okrs = artefacts.filter((a) => a.artefact_type === 'okr_cascade');
  const guardrails = artefacts.filter((a) => a.artefact_type === 'guardrails');
  const decisionFrameworks = artefacts.filter((a) => a.artefact_type === 'decision_framework');
  const stakeholderPacks = artefacts.filter((a) => a.artefact_type === 'stakeholder_pack');

  // Completeness calculations
  const betsWithBriefs = new Set(teamBriefs.map((a) => a.source_bet_id).filter(Boolean));
  const betsMissingBriefs = bets.filter((b) => !betsWithBriefs.has(b.id));
  const coveredAudiences = new Set(stakeholderPacks.map((a) => a.audience).filter(Boolean));
  const missingAudiences = STAKEHOLDER_AUDIENCES.filter((a) => !coveredAudiences.has(a.value));

  const totalCategories = 4;
  let completedCategories = 0;
  if (teamBriefs.length > 0) completedCategories++;
  if (okrs.length > 0) completedCategories++;
  if (guardrails.length > 0 || decisionFrameworks.length > 0) completedCategories++;
  if (stakeholderPacks.length > 0) completedCategories++;

  const categories = [
    {
      id: 'team_briefs',
      label: 'Team Briefs',
      icon: FileText,
      color: 'cyan',
      count: teamBriefs.length,
      done: teamBriefs.length > 0,
      summary:
        bets.length > 0
          ? `${betsWithBriefs.size} of ${bets.length} bets covered`
          : `${teamBriefs.length} generated`,
      items: bets.map((b) => ({
        label: truncate(b.bet, 60),
        done: betsWithBriefs.has(b.id),
        action: !betsWithBriefs.has(b.id)
          ? () => onGenerate('team_brief', b.id)
          : undefined,
        actionLabel: 'Generate',
        generating: generating === 'team_brief',
      })),
      emptyHint:
        bets.length === 0
          ? 'No strategic bets found — complete the Bets phase first.'
          : undefined,
    },
    {
      id: 'okrs',
      label: 'OKR Cascade',
      icon: Target,
      color: 'emerald',
      count: okrs.length,
      done: okrs.length > 0,
      summary: okrs.length > 0 ? `${okrs.length} cascade generated` : 'Not yet generated',
      items: [
        {
          label: `OKR Cascade across ${bets.length} bet${bets.length !== 1 ? 's' : ''}`,
          done: okrs.length > 0,
          action: okrs.length === 0 ? () => onGenerate('okr_cascade') : undefined,
          actionLabel: 'Generate',
          generating: generating === 'okr_cascade',
        },
      ],
    },
    {
      id: 'guardrails',
      label: 'Guardrails',
      icon: ShieldCheck,
      color: 'amber',
      count: guardrails.length + decisionFrameworks.length,
      done: guardrails.length > 0 || decisionFrameworks.length > 0,
      summary: (() => {
        const parts: string[] = [];
        if (guardrails.length > 0) parts.push(`${guardrails.length} guardrail set`);
        if (decisionFrameworks.length > 0) parts.push(`${decisionFrameworks.length} decision framework`);
        return parts.length > 0 ? parts.join(', ') : 'Not yet generated';
      })(),
      items: [
        {
          label: 'Strategic Guardrails',
          done: guardrails.length > 0,
          action: guardrails.length === 0 ? () => onGenerate('guardrails') : undefined,
          actionLabel: 'Generate',
          generating: generating === 'guardrails',
        },
        {
          label: 'Decision Framework',
          done: decisionFrameworks.length > 0,
          action:
            decisionFrameworks.length === 0
              ? () => onGenerate('decision_framework')
              : undefined,
          actionLabel: 'Generate',
          generating: generating === 'decision_framework',
        },
      ],
    },
    {
      id: 'stakeholder',
      label: 'Stakeholder Packs',
      icon: Users,
      color: 'purple',
      count: stakeholderPacks.length,
      done: stakeholderPacks.length > 0,
      summary: `${coveredAudiences.size} of ${STAKEHOLDER_AUDIENCES.length} audiences covered`,
      items: STAKEHOLDER_AUDIENCES.map((aud) => ({
        label: aud.label,
        done: coveredAudiences.has(aud.value),
        action: !coveredAudiences.has(aud.value)
          ? () => onGenerate('stakeholder_pack', undefined, aud.value)
          : undefined,
        actionLabel: 'Generate',
        generating: generating === `stakeholder_pack_${aud.value}`,
      })),
    },
  ];

  const colorMap: Record<string, { ring: string; bg: string; text: string; badge: string; iconBg: string }> = {
    cyan: {
      ring: 'ring-cyan-200',
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      badge: 'bg-cyan-100 text-cyan-700',
      iconBg: 'bg-cyan-100',
    },
    emerald: {
      ring: 'ring-emerald-200',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-700',
      iconBg: 'bg-emerald-100',
    },
    amber: {
      ring: 'ring-amber-200',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-700',
      iconBg: 'bg-amber-100',
    },
    purple: {
      ring: 'ring-purple-200',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-700',
      iconBg: 'bg-purple-100',
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Activation Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Bridge strategy to execution. Generate team briefs, OKRs, guardrails, and stakeholder packs
          from your strategic bets — then review before moving to Living Strategy.
        </p>
      </div>

      {/* Progress summary */}
      <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4">
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeDasharray={`${(completedCategories / totalCategories) * 97.4} 97.4`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-900 font-code">
            {completedCategories}/{totalCategories}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">
            {completedCategories === totalCategories
              ? 'All artefact types generated'
              : `${completedCategories} of ${totalCategories} artefact types started`}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {artefacts.length} total artefact{artefacts.length !== 1 ? 's' : ''} generated
            {bets.length > 0 && ` across ${bets.length} strategic bet${bets.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {completedCategories === totalCategories && (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Complete</span>
          </div>
        )}
      </div>

      {/* Category cards */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const c = colorMap[cat.color];
          const Icon = cat.icon;
          const isExpanded = expandedCategory === cat.id;
          const doneItems = cat.items.filter((i) => i.done).length;
          const totalItems = cat.items.length;

          return (
            <div
              key={cat.id}
              className={`bg-white border rounded-2xl transition-all duration-300 ${
                cat.done ? 'border-slate-200' : 'border-slate-200'
              } ${isExpanded ? 'shadow-md' : 'shadow-sm hover:shadow-md'}`}
            >
              {/* Card header — always visible */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center gap-4 p-4 text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.iconBg}`}>
                  <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{cat.label}</h3>
                    {cat.count > 0 && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge}`}>
                        {cat.count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.summary}</p>
                </div>
                {/* Mini progress dots */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {cat.items.slice(0, 6).map((item, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        item.done ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                  {cat.items.length > 6 && (
                    <span className="text-[9px] text-slate-400 font-semibold">
                      +{cat.items.length - 6}
                    </span>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </button>

              {/* Expanded checklist */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-slate-100">
                  {cat.emptyHint ? (
                    <p className="text-xs text-slate-500 py-3 italic">{cat.emptyHint}</p>
                  ) : (
                    <ul className="divide-y divide-slate-50">
                      {cat.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 py-2.5">
                          {item.done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                          )}
                          <span
                            className={`text-sm flex-1 min-w-0 ${
                              item.done ? 'text-slate-500' : 'text-slate-700'
                            }`}
                          >
                            {item.label}
                          </span>
                          {item.action && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                item.action!();
                              }}
                              disabled={!!generating}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fbbf24] text-xs font-semibold text-slate-900 transition-all hover:bg-[#f59e0b] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                            >
                              {item.generating ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3" />
                                  {item.actionLabel}
                                </>
                              )}
                            </button>
                          )}
                          {item.done && !item.action && (
                            <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider flex-shrink-0">
                              Done
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {totalItems > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${(doneItems / totalItems) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 font-code">
                          {doneItems}/{totalItems}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function truncate(text: string, max: number): string {
  if (!text || text.length <= max) return text || '';
  return text.substring(0, max - 1) + '\u2026';
}
