'use client';

interface ReviewItem {
  id: string;
  job_to_be_done: string;
  kill_date: string | null;
  status: string;
}

interface ReviewCardProps {
  upcomingReviews: ReviewItem[];
}

function getDaysUntil(dateStr: string): number {
  const now = new Date();
  const date = new Date(dateStr);
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getUrgencyColor(days: number): string {
  if (days < 0) return 'bg-red-100 text-red-700 border-red-200';
  if (days <= 7) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (days <= 30) return 'bg-cyan-100 text-cyan-700 border-cyan-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
}

export function ReviewCard({ upcomingReviews }: ReviewCardProps) {
  if (upcomingReviews.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Upcoming Reviews
        </span>
        <p className="text-sm text-slate-500 mt-2">No upcoming kill dates. Reviews will appear once you create strategic bets.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-cyan-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-cyan-300">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Upcoming Reviews
      </span>
      <div className="mt-3 space-y-2.5">
        {upcomingReviews.map((item) => {
          const days = item.kill_date ? getDaysUntil(item.kill_date) : null;
          return (
            <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/50">
              {days !== null && (
                <span className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border ${getUrgencyColor(days)}`}>
                  {days < 0 ? 'Overdue' : days === 0 ? 'Today' : `${days}d`}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {item.job_to_be_done}
                </p>
                {item.kill_date && (
                  <p className="text-[11px] text-slate-400">
                    Kill date: {new Date(item.kill_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
