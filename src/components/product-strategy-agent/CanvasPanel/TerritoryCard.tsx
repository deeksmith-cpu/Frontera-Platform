'use client';

import { CompanyIcon, CustomerIcon, CompetitorIcon } from '@/components/icons/TerritoryIcons';

function StatusCircle({ status }: { status: 'unexplored' | 'in_progress' | 'mapped' }) {
  if (status === 'unexplored') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" className="flex-shrink-0">
        <circle cx="9" cy="9" r="7" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    );
  }
  if (status === 'in_progress') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" className="flex-shrink-0">
        <circle cx="9" cy="9" r="7" fill="none" stroke="#fde68a" strokeWidth="1.5" />
        <path
          d="M9 2a7 7 0 0 1 7 7"
          fill="none"
          stroke="#d97706"
          strokeWidth="2"
          strokeLinecap="round"
          className="animate-spin origin-center"
          style={{ animationDuration: '3s' }}
        />
        <circle cx="9" cy="9" r="2.5" fill="#d97706" />
      </svg>
    );
  }
  // mapped
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className="flex-shrink-0">
      <circle cx="9" cy="9" r="8" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
      <circle cx="9" cy="9" r="5.5" fill="#059669" />
      <path d="M6.5 9l1.8 1.8 3.2-3.6" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
      bgColor: 'bg-slate-50 border border-slate-200',
      textColor: 'text-slate-500',
    },
    in_progress: {
      label: 'In Progress',
      bgColor: 'bg-amber-50 border border-amber-200',
      textColor: 'text-amber-700',
    },
    mapped: {
      label: 'Mapped',
      bgColor: `bg-emerald-50 border border-emerald-200`,
      textColor: 'text-emerald-700',
    },
  };

  const statusDisplay = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className={`group territory-card w-full text-left bg-white rounded-2xl border-3 ${colors.border} ${colors.hover} ${colors.shadow} p-5 sm:p-6 md:p-8 transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.ring}`}
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
          <StatusCircle status={status} />
          {statusDisplay.label}
        </span>

        {status === 'mapped' && (
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" style={{ animationDuration: '2s' }} />
            <svg width="28" height="28" viewBox="0 0 28 28" className="relative">
              <circle cx="14" cy="14" r="12" fill="none" stroke="#6ee7b7" strokeWidth="1.5" />
              <circle cx="14" cy="14" r="9" fill="#059669" />
              <path d="M10 14l2.5 2.5 5-5.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
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
