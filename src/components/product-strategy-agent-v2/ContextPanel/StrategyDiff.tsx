'use client';

import { useState, useEffect } from 'react';

interface StrategyVersion {
  id: string;
  version_number: number;
  snapshot: Record<string, unknown>;
  change_narrative: string | null;
  trigger: string;
  created_at: string;
}

interface StrategyDiffProps {
  conversationId: string;
}

export function StrategyDiff({ conversationId }: StrategyDiffProps) {
  const [versions, setVersions] = useState<StrategyVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [leftVersion, setLeftVersion] = useState<string | null>(null);
  const [rightVersion, setRightVersion] = useState<string | null>(null);
  const [creatingSnapshot, setCreatingSnapshot] = useState(false);

  useEffect(() => {
    loadVersions();
  }, [conversationId]);

  async function loadVersions() {
    try {
      const res = await fetch(`/api/product-strategy-agent-v2/versions?conversationId=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        const versionList = data.versions || [];
        setVersions(versionList);
        if (versionList.length >= 2) {
          setLeftVersion(versionList[1].id);
          setRightVersion(versionList[0].id);
        } else if (versionList.length === 1) {
          setRightVersion(versionList[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load versions:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSnapshot() {
    setCreatingSnapshot(true);
    try {
      const res = await fetch('/api/product-strategy-agent-v2/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, trigger: 'manual' }),
      });
      if (res.ok) {
        await loadVersions();
      }
    } catch (err) {
      console.error('Failed to create snapshot:', err);
    } finally {
      setCreatingSnapshot(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2.5 text-slate-600 text-sm py-4">
        <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
        <span className="text-xs uppercase tracking-wide font-semibold">Loading version history...</span>
      </div>
    );
  }

  const left = versions.find((v) => v.id === leftVersion);
  const right = versions.find((v) => v.id === rightVersion);

  const triggerLabels: Record<string, string> = {
    phase_completion: 'Phase Completed',
    manual: 'Manual Snapshot',
    signal_triggered: 'Signal Trigger',
    review: 'Strategy Review',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Strategy Versions ({versions.length})
        </span>
        <button
          onClick={handleCreateSnapshot}
          disabled={creatingSnapshot}
          className="text-xs font-semibold text-[#1a1f3a] hover:text-[#fbbf24] transition-colors disabled:opacity-50"
        >
          {creatingSnapshot ? 'Creating...' : '+ Snapshot Now'}
        </button>
      </div>

      {versions.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-slate-500">No strategy versions yet.</p>
          <p className="text-xs text-slate-400 mt-1">
            Strategy snapshots are created automatically at phase transitions and can be created manually.
          </p>
          <button
            onClick={handleCreateSnapshot}
            disabled={creatingSnapshot}
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-[#f59e0b] disabled:opacity-50"
          >
            {creatingSnapshot ? 'Creating...' : 'Create First Snapshot'}
          </button>
        </div>
      ) : (
        <>
          {/* Version timeline */}
          <div className="space-y-2">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`bg-white border rounded-xl p-3 cursor-pointer transition-all ${
                  version.id === rightVersion
                    ? 'border-[#fbbf24] ring-1 ring-[#fbbf24]/30'
                    : version.id === leftVersion
                    ? 'border-cyan-300 ring-1 ring-cyan-200'
                    : 'border-slate-200 hover:border-cyan-200'
                }`}
                onClick={() => {
                  if (version.id === rightVersion) return;
                  if (version.id === leftVersion) {
                    setLeftVersion(null);
                    return;
                  }
                  if (!leftVersion) {
                    setLeftVersion(version.id);
                  } else {
                    // Swap: make current right the left, this the right
                    setLeftVersion(rightVersion);
                    setRightVersion(version.id);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#1a1f3a] rounded-md flex items-center justify-center text-[10px] font-bold text-white">
                      v{version.version_number}
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-slate-900">
                        Version {version.version_number}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-2">
                        {triggerLabels[version.trigger] || version.trigger}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(version.created_at).toLocaleDateString()}
                  </span>
                </div>

                {version.change_narrative && (
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed italic">
                    {version.change_narrative}
                  </p>
                )}

                {/* Selection indicator */}
                <div className="flex gap-1 mt-2">
                  {version.id === leftVersion && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-cyan-100 text-cyan-700 rounded-full">
                      COMPARE FROM
                    </span>
                  )}
                  {version.id === rightVersion && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#fbbf24]/20 text-[#b45309] rounded-full">
                      COMPARE TO
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Diff view */}
          {left && right && (
            <DiffPanel left={left} right={right} />
          )}
        </>
      )}
    </div>
  );
}

function DiffPanel({ left, right }: { left: StrategyVersion; right: StrategyVersion }) {
  const leftSnapshot = left.snapshot;
  const rightSnapshot = right.snapshot;

  const leftBets = (leftSnapshot.bets as Array<{ bet: string; status?: string }>) || [];
  const rightBets = (rightSnapshot.bets as Array<{ bet: string; status?: string }>) || [];

  const leftAssumptions = (leftSnapshot.assumptions as Array<{ assumption_text: string; status: string }>) || [];
  const rightAssumptions = (rightSnapshot.assumptions as Array<{ assumption_text: string; status: string }>) || [];

  const leftPhase = (leftSnapshot.currentPhase as string) || 'unknown';
  const rightPhase = (rightSnapshot.currentPhase as string) || 'unknown';

  return (
    <div className="bg-white border border-cyan-200 rounded-2xl overflow-hidden">
      <div className="bg-[#1a1f3a] text-white px-4 py-2.5 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider">
          v{left.version_number} → v{right.version_number} Comparison
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Phase change */}
        {leftPhase !== rightPhase && (
          <div className="flex items-center gap-2 p-3 bg-[#fbbf24]/10 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#b45309]">Phase</span>
            <span className="text-xs text-slate-500">{leftPhase}</span>
            <span className="text-xs text-[#fbbf24] font-bold">→</span>
            <span className="text-xs text-slate-900 font-semibold">{rightPhase}</span>
          </div>
        )}

        {/* Bets comparison */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Strategic Bets</span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <span className="text-[9px] font-semibold text-cyan-600 uppercase">v{left.version_number}</span>
              {leftBets.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic mt-1">No bets</p>
              ) : (
                <ul className="mt-1 space-y-1">
                  {leftBets.map((b, i) => (
                    <li key={i} className="text-[10px] text-slate-600 leading-relaxed">
                      {b.bet?.substring(0, 80)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <span className="text-[9px] font-semibold text-[#b45309] uppercase">v{right.version_number}</span>
              {rightBets.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic mt-1">No bets</p>
              ) : (
                <ul className="mt-1 space-y-1">
                  {rightBets.map((b, i) => {
                    const isNew = !leftBets.some((lb) => lb.bet === b.bet);
                    return (
                      <li key={i} className={`text-[10px] leading-relaxed ${isNew ? 'text-emerald-600 font-semibold' : 'text-slate-600'}`}>
                        {isNew && '+ '}{b.bet?.substring(0, 80)}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Assumptions comparison */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assumptions</span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <span className="text-[9px] font-semibold text-cyan-600 uppercase">v{left.version_number}</span>
              <div className="flex gap-1 mt-1">
                <span className="text-[9px] px-1 bg-slate-100 text-slate-500 rounded">
                  {leftAssumptions.filter((a) => a.status === 'untested').length} untested
                </span>
                <span className="text-[9px] px-1 bg-emerald-100 text-emerald-600 rounded">
                  {leftAssumptions.filter((a) => a.status === 'validated').length} validated
                </span>
                <span className="text-[9px] px-1 bg-red-100 text-red-500 rounded">
                  {leftAssumptions.filter((a) => a.status === 'invalidated').length} invalid
                </span>
              </div>
            </div>
            <div>
              <span className="text-[9px] font-semibold text-[#b45309] uppercase">v{right.version_number}</span>
              <div className="flex gap-1 mt-1">
                <span className="text-[9px] px-1 bg-slate-100 text-slate-500 rounded">
                  {rightAssumptions.filter((a) => a.status === 'untested').length} untested
                </span>
                <span className="text-[9px] px-1 bg-emerald-100 text-emerald-600 rounded">
                  {rightAssumptions.filter((a) => a.status === 'validated').length} validated
                </span>
                <span className="text-[9px] px-1 bg-red-100 text-red-500 rounded">
                  {rightAssumptions.filter((a) => a.status === 'invalidated').length} invalid
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change narrative */}
        {right.change_narrative && (
          <div className="bg-[#1a1f3a]/5 rounded-xl p-3 border border-[#1a1f3a]/10">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#1a1f3a]">
              Change Narrative
            </span>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">{right.change_narrative}</p>
          </div>
        )}
      </div>
    </div>
  );
}
