'use client';

import { CompanyIcon, CustomerIcon, CompetitorIcon, CheckIcon } from '@/components/icons/TerritoryIcons';
import { ProgressRing } from '../ProgressRing';

interface TerritoryCardProps {
  title: string;
  description: string;
  status: 'unexplored' | 'in_progress' | 'mapped';
  onClick: () => void;
  territory: 'company' | 'customer' | 'competitor';
  mappedAreas?: number;
  totalAreas?: number;
}

export function TerritoryCard({ title, description, status, onClick, territory, mappedAreas = 0, totalAreas = 3 }: TerritoryCardProps) {
  // Territory-specific icons
  const territoryIcons = {
    company: CompanyIcon,
    customer: CustomerIcon,
    competitor: CompetitorIcon,
  };

  const TerritoryIcon = territoryIcons[territory];

  // Territory-specific colors using Frontera brand palette
  const territoryColors = {
    company: {
      bg: 'from-[#1a1f3a] to-[#2d3561]',
      border: 'border-[#1a1f3a]/30',
      text: 'text-[#1a1f3a]',
      badge: 'bg-[#1a1f3a]/10 text-[#1a1f3a]',
      hover: 'hover:border-[#1a1f3a]/60 hover:shadow-lg',
      shadow: 'shadow-md',
      ring: 'focus:ring-[#1a1f3a]',
    },
    customer: {
      bg: 'from-[#fbbf24] to-[#f59e0b]',
      border: 'border-[#fbbf24]/40',
      text: 'text-[#b45309]',
      badge: 'bg-[#fbbf24]/10 text-[#b45309]',
      hover: 'hover:border-[#fbbf24]/70 hover:shadow-lg',
      shadow: 'shadow-md',
      ring: 'focus:ring-[#fbbf24]',
    },
    competitor: {
      bg: 'from-[#0891b2] to-[#0e7490]',
      border: 'border-cyan-300',
      text: 'text-[#0891b2]',
      badge: 'bg-cyan-50 text-[#0891b2]',
      hover: 'hover:border-cyan-400 hover:shadow-lg',
      shadow: 'shadow-md',
      ring: 'focus:ring-cyan-400',
    },
  };

  const colors = territoryColors[territory];

  // Status display
  const statusConfig = {
    unexplored: {
      label: 'Unexplored',
      icon: '○',
      bgColor: 'bg-slate-100',
      textColor: 'text-slate-600',
    },
    in_progress: {
      label: 'In Progress',
      icon: '◐',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-700',
    },
    mapped: {
      label: 'Mapped',
      icon: '●',
      bgColor: colors.badge,
      textColor: colors.text,
    },
  };

  const statusDisplay = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className={`group territory-card w-full text-left bg-white rounded-2xl border-3 ${colors.border} ${colors.hover} ${colors.shadow} p-5 sm:p-6 md:p-8 transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.ring}`}
    >
      {/* Icon with Gradient Background + Progress Ring */}
      <div className="mb-6 flex items-center justify-between">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center ${colors.shadow} transition-transform group-hover:scale-105`}>
          <TerritoryIcon className="text-white" size={32} />
        </div>
        {mappedAreas > 0 && (
          <ProgressRing
            percentage={(mappedAreas / totalAreas) * 100}
            size={44}
            strokeWidth={3.5}
            color={territory === 'company' ? '#1a1f3a' : territory === 'customer' ? '#fbbf24' : '#0891b2'}
            label={`${mappedAreas}/${totalAreas}`}
          />
        )}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-base text-slate-600 leading-relaxed mb-6">{description}</p>

      {/* Status Badge - Positioned at bottom */}
      <div className="flex items-center justify-between mt-auto">
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 ${statusDisplay.bgColor} ${statusDisplay.textColor} rounded-full text-xs font-bold uppercase tracking-wide`}>
          {status === 'unexplored' && '○'}
          {status === 'in_progress' && <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />}
          {status === 'mapped' && <CheckIcon className={colors.text} size={14} />}
          {statusDisplay.label}
        </span>

        {status === 'mapped' && (
          <svg className={`w-6 h-6 ${colors.text}`} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {/* Visual Progress Indicator */}
      <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colors.bg} transition-all duration-500`}
          style={{
            width: status === 'unexplored' ? '0%' : status === 'in_progress' ? '50%' : '100%',
          }}
        />
      </div>

      {/* CTA Hint */}
      <div className={`mt-3 text-sm font-semibold ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
        {status === 'unexplored' && 'Begin Exploration →'}
        {status === 'in_progress' && 'Continue Mapping →'}
        {status === 'mapped' && 'Review Insights →'}
      </div>
    </button>
  );
}
