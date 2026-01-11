'use client';

interface TerritoryCardProps {
  title: string;
  description: string;
  status: 'unexplored' | 'in_progress' | 'mapped';
  onClick: () => void;
  territory: 'company' | 'customer' | 'competitor';
}

export function TerritoryCard({ title, description, status, onClick, territory }: TerritoryCardProps) {
  // Territory-specific colors
  const territoryColors = {
    company: {
      bg: 'from-indigo-600 to-indigo-800',
      border: 'border-indigo-300',
      text: 'text-indigo-600',
      badge: 'bg-indigo-100 text-indigo-700',
      hover: 'hover:border-indigo-400',
    },
    customer: {
      bg: 'from-cyan-600 to-cyan-800',
      border: 'border-cyan-300',
      text: 'text-cyan-600',
      badge: 'bg-cyan-100 text-cyan-700',
      hover: 'hover:border-cyan-400',
    },
    competitor: {
      bg: 'from-purple-600 to-purple-800',
      border: 'border-purple-300',
      text: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-700',
      hover: 'hover:border-purple-400',
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
      className={`territory-card w-full text-left bg-white rounded-2xl border-2 ${colors.border} ${colors.hover} p-6 transition-all hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${territory}-400`}
    >
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center gap-2 px-3 py-1 ${statusDisplay.bgColor} ${statusDisplay.textColor} rounded-full text-xs font-semibold uppercase tracking-wide`}>
          <span className="text-base">{statusDisplay.icon}</span>
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

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed mb-4">{description}</p>

      {/* CTA */}
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className={colors.text}>
          {status === 'unexplored' && 'Begin Exploration →'}
          {status === 'in_progress' && 'Continue Mapping →'}
          {status === 'mapped' && 'Review Insights →'}
        </span>
      </div>

      {/* Visual Indicator */}
      <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colors.bg} transition-all duration-300`}
          style={{
            width: status === 'unexplored' ? '0%' : status === 'in_progress' ? '50%' : '100%',
          }}
        />
      </div>
    </button>
  );
}
