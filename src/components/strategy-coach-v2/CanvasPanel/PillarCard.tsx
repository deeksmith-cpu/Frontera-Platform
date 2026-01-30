'use client';

import { ReactNode } from 'react';

interface Insight {
  id: string;
  content: string;
  category: string;
}

interface PillarCardProps {
  pillar: 'company' | 'customer' | 'competitor';
  icon: ReactNode;
  title: string;
  subtitle: string;
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  insights: Insight[];
  isActive: boolean;
  onClick: () => void;
}

export function PillarCard({
  pillar,
  icon,
  title,
  subtitle,
  status,
  progress,
  insights,
  isActive,
  onClick,
}: PillarCardProps) {
  const statusLabels = {
    pending: 'Unexplored',
    in_progress: 'Mapping',
    completed: 'Charted',
  };

  const statusColors = {
    pending: 'text-slate-500',
    in_progress: 'text-[#fbbf24]',
    completed: 'text-emerald-500',
  };

  const iconGradients = {
    company: 'bg-gradient-to-br from-indigo-50 to-cyan-50 text-indigo-900',
    customer: 'bg-gradient-to-br from-cyan-50 to-teal-50 text-cyan-600',
    competitor: 'bg-gradient-to-br from-slate-50 to-indigo-50 text-slate-700',
  };

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white border rounded-2xl p-8 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
        isActive
          ? 'border-[#fbbf24]/40 shadow-xl ring-1 ring-[#fbbf24]/20'
          : status === 'completed'
          ? 'border-emerald-100'
          : status === 'in_progress'
          ? 'border-[#fbbf24]/20'
          : 'border-slate-100'
      }`}
      style={{ animationDelay: `${['company', 'customer', 'competitor'].indexOf(pillar) * 0.1}s` }}
    >
      {/* Status Badge */}
      <div className={`absolute top-6 right-6 text-xs font-bold uppercase tracking-wider ${statusColors[status]}`}>
        {statusLabels[status]}
      </div>

      {/* Icon */}
      <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${iconGradients[pillar]} transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
        {title}
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-slate-500 leading-relaxed mb-6">
        {subtitle}
      </p>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-[#fbbf24] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          {status === 'pending'
            ? 'Territory Unexplored'
            : status === 'completed'
            ? `Fully Charted · ${insights.length} landmarks discovered`
            : `${progress}% Mapped · ${insights.length} landmarks discovered`}
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-2.5">
        {insights.length === 0 ? (
          <div className="flex items-start gap-2.5 text-sm text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />
            <span>Click to begin exploring {title.toLowerCase()} territory</span>
          </div>
        ) : (
          <>
            {insights.slice(0, 3).map((insight) => (
              <div key={insight.id} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                <span>{insight.content}</span>
              </div>
            ))}
            {insights.length > 3 && (
              <div className="flex items-start gap-2.5 text-sm text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />
                <span>+ {insights.length - 3} more landmarks</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Hover Indicator */}
      {!isActive && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-[#fbbf24] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </div>
  );
}
