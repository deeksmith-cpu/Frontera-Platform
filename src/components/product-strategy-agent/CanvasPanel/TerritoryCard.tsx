'use client';

import { CompanyIcon, CustomerIcon, CompetitorIcon, CheckIcon } from '@/components/icons/TerritoryIcons';

interface TerritoryCardProps {
  title: string;
  description: string;
  status: 'unexplored' | 'in_progress' | 'mapped';
  onClick: () => void;
  territory: 'company' | 'customer' | 'competitor';
}

export function TerritoryCard({ title, description, status, onClick, territory }: TerritoryCardProps) {
  // Territory-specific icons
  const territoryIcons = {
    company: CompanyIcon,
    customer: CustomerIcon,
    competitor: CompetitorIcon,
  };

  const TerritoryIcon = territoryIcons[territory];

  // Territory-specific bold colors with gradients and shadows
  const territoryColors = {
    company: {
      bg: 'from-indigo-600 to-indigo-700',
      border: 'border-indigo-400',
      text: 'text-indigo-600',
      badge: 'bg-indigo-100 text-indigo-700',
      hover: 'hover:border-indigo-500 hover:shadow-indigo-xl',
      shadow: 'shadow-indigo-lg',
    },
    customer: {
      bg: 'from-amber-500 to-amber-600',
      border: 'border-amber-400',
      text: 'text-amber-600',
      badge: 'bg-amber-100 text-amber-700',
      hover: 'hover:border-amber-500 hover:shadow-amber-xl',
      shadow: 'shadow-amber-lg',
    },
    competitor: {
      bg: 'from-purple-600 to-purple-700',
      border: 'border-purple-400',
      text: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-700',
      hover: 'hover:border-purple-500 hover:shadow-purple-xl',
      shadow: 'shadow-purple-lg',
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
      className={`group territory-card w-full text-left bg-white rounded-2xl border-3 ${colors.border} ${colors.hover} ${colors.shadow} p-8 transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${territory}-400`}
    >
      {/* Icon with Gradient Background */}
      <div className="mb-6">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center ${colors.shadow} transition-transform group-hover:scale-105`}>
          <TerritoryIcon className="text-white" size={32} />
        </div>
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
