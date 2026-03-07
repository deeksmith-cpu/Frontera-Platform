'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Maximize2, Minimize2, Download, Sparkles } from 'lucide-react';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface SlimHeaderProps {
  conversation: Conversation | null;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  compactXP?: { level: number; xpTotal: number };
  breadcrumb?: string;
  onExport?: () => void;
  onGenerateInsights?: () => void;
}

export function SlimHeader({
  conversation,
  isFocusMode,
  onToggleFocusMode,
  compactXP,
  breadcrumb,
  onExport,
  onGenerateInsights,
}: SlimHeaderProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInsights = async () => {
    if (!conversation || isGenerating) return;
    setIsGenerating(true);
    try {
      if (onGenerateInsights) {
        onGenerateInsights();
      } else {
        const response = await fetch('/api/product-strategy-agent/synthesis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversation_id: conversation.id }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate synthesis');
        }
        window.location.reload();
      }
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 border-b-2 border-[#fbbf24]/30 bg-gradient-to-b from-[#1e2440] to-[#151930] animate-entrance-down">
      {/* Left: Logo + breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="transition-transform duration-300 hover:scale-105 flex-shrink-0">
          <Image
            src="/frontera-logo-white.jpg"
            alt="Frontera"
            width={100}
            height={32}
            className="h-7 w-auto"
          />
        </Link>

        {breadcrumb && (
          <span className="hidden sm:inline text-xs text-slate-400 font-medium truncate max-w-[300px]">
            {breadcrumb}
          </span>
        )}

        {/* Compact XP in focus mode */}
        {isFocusMode && compactXP && (
          <div className="hidden sm:flex items-center gap-2 ml-2">
            <div className="w-5 h-5 rounded-full bg-[#fbbf24] flex items-center justify-center">
              <span className="text-[8px] font-bold text-slate-900">{compactXP.level}</span>
            </div>
            <span className="text-[10px] text-white/40 font-semibold font-[family-name:var(--font-code)]">
              {compactXP.xpTotal} XP
            </span>
          </div>
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Focus mode toggle */}
        <button
          onClick={onToggleFocusMode}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
          aria-label={isFocusMode ? 'Exit focus mode' : 'Enter focus mode'}
          title={isFocusMode ? 'Exit focus mode (Ctrl+Shift+F)' : 'Focus mode (Ctrl+Shift+F)'}
        >
          {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Export — only shown when handler is provided */}
        {onExport && (
          <button
            onClick={onExport}
            className="hidden sm:flex items-center gap-1.5 text-xs py-1.5 px-3 bg-white/10 border border-white/20 rounded-lg text-white transition-all duration-300 hover:bg-white/20 hover:border-white/40 font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export</span>
          </button>
        )}

        {/* Generate Insights */}
        <button
          onClick={handleGenerateInsights}
          disabled={isGenerating}
          className="flex items-center gap-1.5 text-xs py-1.5 px-3 bg-[#fbbf24] rounded-lg text-slate-900 transition-all duration-300 hover:bg-[#f59e0b] hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{isGenerating ? 'Generating...' : 'Insights'}</span>
        </button>
      </div>
    </header>
  );
}
