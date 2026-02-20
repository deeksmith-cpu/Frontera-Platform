'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function CoachEntryBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        // Navigate to the strategy coach with the query as a URL param
        router.push(`/dashboard/product-strategy-agent-v2?prompt=${encodeURIComponent(query.trim())}`);
      } else {
        router.push('/dashboard/product-strategy-agent-v2');
      }
    },
    [query, router]
  );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 transition-all duration-300 focus-within:border-[#fbbf24] focus-within:shadow-lg focus-within:shadow-[#fbbf24]/10">
        <div className="flex-shrink-0 w-8 h-8 rounded-xl overflow-hidden mr-3">
          <Image src="/frontera-logo-F.jpg" alt="Frontera" width={32} height={32} className="w-full h-full object-cover" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Start a strategy conversation about..."
          className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none focus:ring-0"
        />
        <button
          type="submit"
          className="flex-shrink-0 ml-3 w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1f3a] text-white hover:bg-[#2d3561] transition-colors"
          aria-label="Start conversation"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </form>
  );
}
