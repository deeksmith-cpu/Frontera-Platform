'use client';

import { useState } from 'react';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface DiscoverySectionProps {
  conversation: Conversation;
}

export function DiscoverySection({ conversation }: DiscoverySectionProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // TODO: Handle file upload
    console.log('Files dropped:', e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Handle file upload
    console.log('Files selected:', e.target.files);
  };

  // Extract context from conversation
  const frameworkState = (conversation.framework_state as Record<string, unknown>) || {};
  const context = (frameworkState.context as Record<string, string>) || {};

  // Check if we have any context to display
  const hasContext = Boolean(context.companyName || context.industry || context.companySize ||
                     context.strategicFocus || context.painPoints || context.targetOutcomes);

  return (
    <section className="discovery-section mb-16">
      <div className="section-header mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-cyan-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
            1
          </div>
          <h3 className="text-3xl font-bold text-slate-900">Discovery</h3>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 bg-cyan-50 px-3 py-1.5 rounded-full">
            Context Setting
          </span>
        </div>
        <p className="text-base text-slate-500 ml-[52px] leading-relaxed">
          Establish your strategic baseline by providing company context and source materials
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Company Context Summary */}
        <div className="group bg-white border border-slate-100 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-cyan-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-cyan-50 flex items-center justify-center text-indigo-900 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="7" y="5" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M10 9H18M10 13H18M10 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-slate-900 mb-1.5">Company Context</h4>
              <p className="text-sm text-slate-500">Strategic baseline and organizational details</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Introductory message */}
            <div className="text-sm text-slate-500 leading-relaxed pb-4 border-b border-slate-100">
              Your strategic context will be captured and developed during your conversation with the Strategy Coach
            </div>

            {/* Strategic context from sign-up */}
            {hasContext && (
              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-600 mb-3">
                  Initial Context from Sign-Up
                </div>

                {context.companyName && (
                  <div className="context-item">
                    <span className="text-xs font-medium text-slate-500 block mb-1">Company</span>
                    <p className="text-base text-slate-900 font-semibold">{context.companyName}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {context.industry && (
                    <div className="context-item">
                      <span className="text-xs font-medium text-slate-500 block mb-1">Industry</span>
                      <p className="text-sm text-slate-700">{context.industry}</p>
                    </div>
                  )}
                  {context.companySize && (
                    <div className="context-item">
                      <span className="text-xs font-medium text-slate-500 block mb-1">Company Size</span>
                      <p className="text-sm text-slate-700">{context.companySize}</p>
                    </div>
                  )}
                </div>

                {/* Strategic Focus, Challenges, and Targets - Compact Block */}
                {(context.strategicFocusDescription || context.painPoints || context.targetOutcomes) && (
                  <div className="context-item space-y-2 pt-2 border-t border-slate-100">
                    {context.strategicFocusDescription && (
                      <div className="text-sm leading-relaxed">
                        <span className="font-semibold text-slate-900">Strategic Focus: </span>
                        <span className="text-slate-700 capitalize">{context.strategicFocusDescription}</span>
                      </div>
                    )}
                    {context.painPoints && (
                      <div className="text-sm leading-relaxed">
                        <span className="font-semibold text-slate-900">Challenges: </span>
                        <span className="text-slate-700">{context.painPoints}</span>
                      </div>
                    )}
                    {context.targetOutcomes && (
                      <div className="text-sm leading-relaxed">
                        <span className="font-semibold text-slate-900">Targets: </span>
                        <span className="text-slate-700">{context.targetOutcomes}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Document Upload Area */}
        <div
          className={`group relative bg-white border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
            isDragOver
              ? 'border-cyan-500 bg-cyan-50/50 shadow-xl scale-105'
              : 'border-slate-200 hover:border-cyan-300 hover:bg-slate-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center h-full">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center text-cyan-600 mb-5 transition-transform duration-300 group-hover:scale-110">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 22V10M16 10L11 15M16 10L21 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 22V26H26V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Add Source Materials</h4>
            <p className="text-sm text-slate-500 mb-6 max-w-xs leading-relaxed">
              Upload documents, reports, or provide links to strategic resources
            </p>

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
                />
                <div className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-sm">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 14V6M9 6L6 9M9 6L12 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 14V16H15V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Upload Files
                </div>
              </label>

              <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:border-cyan-300 hover:bg-slate-50 hover:shadow-md transition-all duration-300 font-semibold text-sm">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 4C9 4 13 4 13 8C13 12 9 12 9 12M9 4C9 4 5 4 5 8C5 12 9 12 9 12M9 4V12M9 12V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Add Link
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">PDF</span>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">DOCX</span>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">XLSX</span>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">CSV</span>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Documents List (placeholder) */}
      <div className="uploaded-docs mt-6">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Uploaded Materials (0)</div>
        <div className="text-sm text-slate-400 italic">
          No documents uploaded yet. Source materials will appear here once added.
        </div>
      </div>
    </section>
  );
}
