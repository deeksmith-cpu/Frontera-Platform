'use client';

import { useState, useEffect, useCallback } from 'react';

interface Signal {
  id: string;
  signal_type: 'competitor' | 'customer' | 'market' | 'internal';
  title: string;
  description: string;
  impact_assessment: string | null;
  linked_assumption_ids: string[];
  created_at: string;
}

interface SignalLogProps {
  conversationId: string;
}

const SIGNAL_TYPES = [
  { id: 'competitor', label: 'Competitor', icon: '↗', color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'customer', label: 'Customer', icon: '◎', color: 'text-cyan-600', bg: 'bg-cyan-100' },
  { id: 'market', label: 'Market', icon: '◆', color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'internal', label: 'Internal', icon: '●', color: 'text-indigo-600', bg: 'bg-indigo-100' },
] as const;

export function SignalLog({ conversationId }: SignalLogProps) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Form state
  const [formType, setFormType] = useState<string>('competitor');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');

  useEffect(() => {
    loadSignals();
  }, [conversationId]);

  async function loadSignals() {
    try {
      const res = await fetch(`/api/product-strategy-agent-v2/signals?conversationId=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setSignals(data.signals || []);
      }
    } catch (err) {
      console.error('Failed to load signals:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = useCallback(async () => {
    if (!formTitle.trim() || !formDescription.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/product-strategy-agent-v2/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          signalType: formType,
          title: formTitle.trim(),
          description: formDescription.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSignals((prev) => [data.signal, ...prev]);
        setFormTitle('');
        setFormDescription('');
        setShowForm(false);
      }
    } catch (err) {
      console.error('Failed to create signal:', err);
    } finally {
      setSubmitting(false);
    }
  }, [conversationId, formType, formTitle, formDescription]);

  const handleDelete = useCallback(async (signalId: string) => {
    try {
      const res = await fetch('/api/product-strategy-agent-v2/signals', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signalId }),
      });
      if (res.ok) {
        setSignals((prev) => prev.filter((s) => s.id !== signalId));
      }
    } catch (err) {
      console.error('Failed to delete signal:', err);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2.5 text-slate-600 text-sm py-4">
        <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
        <span className="text-xs uppercase tracking-wide font-semibold">Loading signals...</span>
      </div>
    );
  }

  const filteredSignals = filterType === 'all'
    ? signals
    : signals.filter((s) => s.signal_type === filterType);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Signal Log ({signals.length})
        </span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs font-semibold text-[#1a1f3a] hover:text-[#fbbf24] transition-colors"
        >
          {showForm ? 'Cancel' : '+ Log Signal'}
        </button>
      </div>

      {/* Log signal form */}
      {showForm && (
        <div className="bg-white border border-cyan-200 rounded-2xl p-4 space-y-3">
          {/* Signal type selector */}
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Signal Type</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {SIGNAL_TYPES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setFormType(st.id)}
                  className={`px-2.5 py-1 text-[10px] font-semibold rounded-full transition-colors ${
                    formType === st.id
                      ? 'bg-[#1a1f3a] text-white'
                      : `${st.bg} ${st.color} hover:opacity-80`
                  }`}
                >
                  {st.icon} {st.label}
                </button>
              ))}
            </div>
          </div>

          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Signal title (e.g., 'Competitor launched AI feature')"
            className="w-full text-sm p-3 border border-slate-200 rounded-lg bg-white text-slate-900 transition-all focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
          />

          <textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Describe the signal and its potential impact..."
            className="w-full text-sm p-3 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none leading-relaxed transition-all focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
            rows={3}
          />

          <button
            onClick={handleSubmit}
            disabled={submitting || !formTitle.trim() || !formDescription.trim()}
            className="inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-[#f59e0b] disabled:opacity-50"
          >
            {submitting ? 'Analyzing & Saving...' : 'Log Signal'}
          </button>
        </div>
      )}

      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilterType('all')}
          className={`px-2.5 py-1 text-[10px] font-semibold rounded-full transition-colors ${
            filterType === 'all'
              ? 'bg-[#1a1f3a] text-white'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          All ({signals.length})
        </button>
        {SIGNAL_TYPES.map((st) => {
          const count = signals.filter((s) => s.signal_type === st.id).length;
          if (count === 0) return null;
          return (
            <button
              key={st.id}
              onClick={() => setFilterType(st.id)}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded-full transition-colors ${
                filterType === st.id
                  ? 'bg-[#1a1f3a] text-white'
                  : `${st.bg} ${st.color} hover:opacity-80`
              }`}
            >
              {st.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Signal timeline */}
      {filteredSignals.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-slate-500">
            {signals.length === 0
              ? 'No signals logged yet.'
              : 'No signals match this filter.'}
          </p>
          {signals.length === 0 && (
            <p className="text-xs text-slate-400 mt-1">
              Log market signals, competitor moves, and customer feedback to keep your strategy current.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSignals.map((signal) => {
            const typeConfig = SIGNAL_TYPES.find((st) => st.id === signal.signal_type) || SIGNAL_TYPES[0];
            return (
              <div key={signal.id} className="bg-white border border-cyan-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${typeConfig.color}`}>{typeConfig.icon}</span>
                    <h3 className="text-sm font-semibold text-slate-900">{signal.title}</h3>
                  </div>
                  <span className={`flex-shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full ${typeConfig.bg} ${typeConfig.color}`}>
                    {typeConfig.label}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{signal.description}</p>

                {/* AI Impact Assessment */}
                {signal.impact_assessment && (
                  <div className="bg-[#1a1f3a]/5 rounded-xl p-3 border border-[#1a1f3a]/10">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#1a1f3a]">
                      AI Impact Assessment
                    </span>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{signal.impact_assessment}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    {new Date(signal.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(signal.id)}
                    className="text-[10px] text-slate-300 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
