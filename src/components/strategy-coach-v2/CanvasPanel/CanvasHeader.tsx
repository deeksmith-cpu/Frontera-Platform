'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Database} from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface CanvasHeaderProps {
  conversation: Conversation;
}

export function CanvasHeader() {
  const handleExport = () => {
    console.log('Export clicked');
    // TODO: Implement export modal
  };

  const handleShare = () => {
    console.log('Share clicked');
    // TODO: Implement share functionality
  };

  const handleGenerateInsights = () => {
    console.log('Generate insights clicked');
    // TODO: Implement synthesis generation
  };

  return (
    <header className="canvas-header py-5 px-10 border-b border-slate-100 bg-white flex justify-between items-center">
      <div className="flex items-center gap-6">
        <Link href="/dashboard">
          <Image
            src="/frontera-logo-white.jpg"
            alt="Frontera"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
        <div>
          <h2 className="canvas-title text-xl font-bold text-slate-900">
            Product Strategy Coach
          </h2>
        </div>
      </div>

      <div className="canvas-controls flex gap-3">
        <button
          onClick={handleExport}
          className="canvas-btn text-sm py-2.5 px-5 bg-white border border-slate-200 rounded-xl text-slate-700 cursor-pointer transition-all duration-300 hover:bg-slate-50 hover:border-[#fbbf24] hover:shadow-md font-semibold"
        >
          Export
        </button>
        <button
          onClick={handleShare}
          className="canvas-btn text-sm py-2.5 px-5 bg-white border border-slate-200 rounded-xl text-slate-700 cursor-pointer transition-all duration-300 hover:bg-slate-50 hover:border-[#fbbf24] hover:shadow-md font-semibold"
        >
          Share
        </button>
        <button
          onClick={handleGenerateInsights}
          className="canvas-btn primary text-sm py-2.5 px-5 bg-[#fbbf24] border-0 rounded-xl text-slate-900 hover:bg-[#f59e0b] cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 font-semibold"
        >
          Generate Insights
        </button>
      </div>
    </header>
  );
}
