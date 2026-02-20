'use client';

import { useState, useEffect, useCallback } from 'react';

interface Assumption {
  id: string;
  assumption_text: string;
  source: string;
  status: 'untested' | 'validated' | 'invalidated';
  evidence: string | null;
  linked_bet_ids: string[];
  linked_signal_ids: string[];
  created_at: string;
  updated_at: string;
}

interface AssumptionTrackerProps {
  conversationId: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  untested: { label: 'Untested', color: 'text-slate-500', bgColor: 'bg-slate-100' },
  validated: { label: 'Validated', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  invalidated: { label: 'Invalidated', color: 'text-red-600', bgColor: 'bg-red-100' },
};

export function AssumptionTracker({ conversationId }: AssumptionTrackerProps) {
  const [assumptions, setAssumptions] = useState<Assumption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newText, setNewText] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEvidence, setEditEvidence] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadAssumptions();
  }, [conversationId]);

  async function loadAssumptions() {
    try {
      const res = await fetch(`/api/product-strategy-agent-v2/assumptions?conversationId=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setAssumptions(data.assumptions || []);
      }
    } catch (err) {
      console.error('Failed to load assumptions:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = useCallback(async () => {
    if (!newText.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/product-strategy-agent-v2/assumptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          assumptionText: newText.trim(),
          source: 'manual',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAssumptions((prev) => [data.assumption, ...prev]);
        setNewText('');
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Failed to add assumption:', err);
    } finally {
      setSaving(false);
    }
  }, [conversationId, newText]);

  const handleStatusChange = useCallback(async (assumptionId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/product-strategy-agent-v2/assumptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assumptionId, status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setAssumptions((prev) =>
          prev.map((a) => (a.id === assumptionId ? data.assumption : a))
        );
      }
    } catch (err) {
      console.error('Failed to update assumption:', err);
    }
  }, []);

  const handleSaveEvidence = useCallback(async (assumptionId: string) => {
    try {
      const res = await fetch('/api/product-strategy-agent-v2/assumptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assumptionId, evidence: editEvidence }),
      });
      if (res.ok) {
        const data = await res.json();
        setAssumptions((prev) =>
          prev.map((a) => (a.id === assumptionId ? data.assumption : a))
        );
        setEditingId(null);
        setEditEvidence('');
      }
    } catch (err) {
      console.error('Failed to save evidence:', err);
    }
  }, [editEvidence]);

  const handleDelete = useCallback(async (assumptionId: string) => {
    try {
      const res = await fetch('/api/product-strategy-agent-v2/assumptions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assumptionId }),
      });
      if (res.ok) {
        setAssumptions((prev) => prev.filter((a) => a.id !== assumptionId));
      }
    } catch (err) {
      console.error('Failed to delete assumption:', err);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2.5 text-slate-600 text-sm py-4">
        <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
        <span className="text-xs uppercase tracking-wide font-semibold">Loading assumptions...</span>
      </div>
    );
  }

  const filteredAssumptions = filterStatus === 'all'
    ? assumptions
    : assumptions.filter((a) => a.status === filterStatus);

  const statusCounts = {
    all: assumptions.length,
    untested: assumptions.filter((a) => a.status === 'untested').length,
    validated: assumptions.filter((a) => a.status === 'validated').length,
    invalidated: assumptions.filter((a) => a.status === 'invalidated').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Assumption Register
        </span>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs font-semibold text-[#1a1f3a] hover:text-[#fbbf24] transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Assumption'}
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="bg-white border border-cyan-200 rounded-2xl p-4 space-y-3">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="What assumption are you making? e.g., 'Enterprise buyers will prioritise integration over price...'"
            className="w-full text-sm p-3 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
            rows={3}
          />
          <button
            onClick={handleAdd}
            disabled={saving || !newText.trim()}
            className="inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-[#f59e0b] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Add Assumption'}
          </button>
        </div>
      )}

      {/* Status filter */}
      <div className="flex flex-wrap gap-1.5">
        {(['all', 'untested', 'validated', 'invalidated'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-2.5 py-1 text-[10px] font-semibold rounded-full transition-colors ${
              filterStatus === status
                ? 'bg-[#1a1f3a] text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {status === 'all' ? 'All' : STATUS_CONFIG[status].label} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Assumption list */}
      {filteredAssumptions.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-slate-500">
            {assumptions.length === 0
              ? 'No assumptions tracked yet.'
              : 'No assumptions match this filter.'}
          </p>
          {assumptions.length === 0 && (
            <p className="text-xs text-slate-400 mt-1">
              Add assumptions from your strategy work to track and validate them.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAssumptions.map((assumption) => {
            const statusCfg = STATUS_CONFIG[assumption.status];
            const isEditing = editingId === assumption.id;

            return (
              <div key={assumption.id} className="bg-white border border-cyan-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-slate-700 leading-relaxed flex-1">
                    {assumption.assumption_text}
                  </p>
                  <span className={`flex-shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full ${statusCfg.bgColor} ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                </div>

                {/* Source */}
                <p className="text-[10px] text-slate-400">
                  Source: {assumption.source} &bull;{' '}
                  {new Date(assumption.created_at).toLocaleDateString()}
                </p>

                {/* Evidence */}
                {assumption.evidence && !isEditing && (
                  <div className="bg-slate-50 rounded-lg p-2">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Evidence</span>
                    <p className="text-xs text-slate-600 mt-0.5">{assumption.evidence}</p>
                  </div>
                )}

                {/* Edit evidence form */}
                {isEditing && (
                  <div className="space-y-2">
                    <textarea
                      value={editEvidence}
                      onChange={(e) => setEditEvidence(e.target.value)}
                      placeholder="What evidence supports or contradicts this assumption?"
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEvidence(assumption.id)}
                        className="text-[11px] font-semibold text-[#1a1f3a] hover:text-[#fbbf24] transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditEvidence(''); }}
                        className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  {assumption.status === 'untested' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(assumption.id, 'validated')}
                        className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        Validate
                      </button>
                      <button
                        onClick={() => handleStatusChange(assumption.id, 'invalidated')}
                        className="text-[10px] font-semibold text-red-500 hover:text-red-600 transition-colors"
                      >
                        Invalidate
                      </button>
                    </>
                  )}
                  {assumption.status !== 'untested' && (
                    <button
                      onClick={() => handleStatusChange(assumption.id, 'untested')}
                      className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingId(assumption.id);
                      setEditEvidence(assumption.evidence || '');
                    }}
                    className="text-[10px] font-semibold text-[#1a1f3a] hover:text-[#fbbf24] transition-colors"
                  >
                    {assumption.evidence ? 'Edit Evidence' : 'Add Evidence'}
                  </button>
                  <button
                    onClick={() => handleDelete(assumption.id)}
                    className="text-[10px] text-slate-300 hover:text-red-500 transition-colors ml-auto"
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
