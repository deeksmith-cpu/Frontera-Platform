'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface CanvasHeaderProps {
  conversation: Conversation;
  onPhaseChange?: () => void;
}

export function CanvasHeader({ conversation, onPhaseChange }: CanvasHeaderProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = () => {
    console.log('Export clicked');
    // TODO: Implement export modal (deferred to post-MVP)
  };

  const handleShare = () => {
    console.log('Share clicked');
    // TODO: Implement share functionality (deferred to post-MVP)
  };

  const handleGenerateInsights = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/product-strategy-agent/synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate synthesis');
      }

      // Success - reload to show synthesis phase
      if (onPhaseChange) {
        onPhaseChange();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate insights. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <header className="canvas-header py-5 px-10 border-b border-slate-100 bg-white flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-6">
        <Image
          src="/frontera-logo-white.jpg"
          alt="Frontera"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
        <div>
          <h2 className="canvas-title text-xl font-bold text-slate-900">
            Product Strategy Coach
          </h2>
        </div>
      </div>

      <div className="canvas-controls flex gap-3">
        <button
          onClick={handleExport}
          className="canvas-btn text-sm py-2.5 px-5 bg-white border border-slate-200 rounded-xl text-slate-700 cursor-pointer transition-all duration-300 hover:bg-slate-50 hover:border-cyan-300 hover:shadow-md font-semibold"
        >
          Export
        </button>
        <button
          onClick={handleShare}
          className="canvas-btn text-sm py-2.5 px-5 bg-white border border-slate-200 rounded-xl text-slate-700 cursor-pointer transition-all duration-300 hover:bg-slate-50 hover:border-cyan-300 hover:shadow-md font-semibold"
        >
          Share
        </button>
        <button
          onClick={handleGenerateInsights}
          disabled={isGenerating}
          className="canvas-btn primary text-sm py-2.5 px-5 bg-[#fbbf24] border-0 rounded-xl text-slate-900 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Insights'
          )}
        </button>
      </div>
    </header>
  );
}
