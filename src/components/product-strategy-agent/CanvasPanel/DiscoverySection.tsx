'use client';

import { useState, useEffect } from 'react';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type UploadedMaterial = Database['public']['Tables']['uploaded_materials']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];

interface DiscoverySectionProps {
  conversation: Conversation;
  clientContext?: Client | null;
}

export function DiscoverySection({ conversation, clientContext }: DiscoverySectionProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedMaterial[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAiResearchModal, setShowAiResearchModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; filename: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle material deletion
  const handleDeleteMaterial = async (materialId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/product-strategy-agent/materials?id=${materialId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      // Remove from local state
      setUploadedFiles((prev) => prev.filter((f) => f.id !== materialId));
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Error deleting material:', error);
      setUploadError(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  // Fetch existing uploaded materials on mount
  useEffect(() => {
    async function fetchMaterials() {
      try {
        const response = await fetch(`/api/product-strategy-agent/materials?conversation_id=${conversation.id}`);
        if (response.ok) {
          const materials: UploadedMaterial[] = await response.json();
          setUploadedFiles(materials);
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMaterials();
  }, [conversation.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversation_id', conversation.id);

      const response = await fetch('/api/product-strategy-agent/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const uploaded: UploadedMaterial = await response.json();
      setUploadedFiles((prev) => [...prev, uploaded]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = async (url: string) => {
    if (!url.trim()) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await fetch('/api/product-strategy-agent/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          url,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'URL import failed');
      }

      const uploaded: UploadedMaterial = await response.json();
      setUploadedFiles((prev) => [...prev, uploaded]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'URL import failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="discovery-section max-w-6xl mx-auto space-y-8">
      {/* Methodology Introduction */}
      <div className="methodology-intro bg-[#f4f4f7] rounded-2xl p-8 border border-slate-200">
        {/* Coaching Intro Video */}
        <div className="mb-6 flex justify-center">
          <div className="w-1/2 rounded-xl overflow-hidden shadow-lg">
            <video
              className="w-full"
              controls
              preload="metadata"
            >
              <source src="/frontera-coaching-intro.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-[#1a1f3a] rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Welcome to the Product Strategy Research Playbook
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              This is an <strong>iterative, evolutionary process</strong> where we&apos;ll develop your product strategy through structured exploration across three strategic territories: <strong>Company</strong>, <strong>Customer</strong>, and <strong>Competitor</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/70 backdrop-blur rounded-xl p-4 border border-slate-200">
                <div className="text-emerald-600 font-bold text-sm uppercase tracking-wide mb-1">Phase 1</div>
                <div className="font-semibold text-slate-900">Discovery</div>
                <div className="text-xs text-slate-600 mt-1">Context Setting</div>
              </div>
              <div className="bg-white/70 backdrop-blur rounded-xl p-4 border border-slate-200">
                <div className="text-amber-600 font-bold text-sm uppercase tracking-wide mb-1">Phase 2</div>
                <div className="font-semibold text-slate-900">Landscape</div>
                <div className="text-xs text-slate-600 mt-1">Terrain Mapping</div>
              </div>
              <div className="bg-white/70 backdrop-blur rounded-xl p-4 border border-slate-200">
                <div className="text-purple-600 font-bold text-sm uppercase tracking-wide mb-1">Phase 3</div>
                <div className="font-semibold text-slate-900">Synthesis</div>
                <div className="text-xs text-slate-600 mt-1">Pattern Recognition</div>
              </div>
              <div className="bg-white/70 backdrop-blur rounded-xl p-4 border border-slate-200">
                <div className="text-cyan-600 font-bold text-sm uppercase tracking-wide mb-1">Phase 4</div>
                <div className="font-semibold text-slate-900">Strategic Bets</div>
                <div className="text-xs text-slate-600 mt-1">Route Planning</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4 italic">
              Your strategic context will deepen and evolve as we progress through each phase, with insights building upon each other to reveal your strategic opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Context Tile */}
      {clientContext && (
        <div className="strategic-context-tile bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a1f3a] rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Company Strategic Context</h3>
                <p className="text-xs text-slate-600">From your onboarding profile</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Company Name & Industry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Organization</div>
                <div className="text-base font-semibold text-slate-900">{clientContext.company_name}</div>
              </div>
              {clientContext.industry && (
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Industry</div>
                  <div className="text-base font-semibold text-slate-900">{clientContext.industry}</div>
                </div>
              )}
            </div>

            {/* Strategic Focus */}
            {clientContext.strategic_focus && (
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Strategic Focus</div>
                <div className="text-sm text-slate-700 leading-relaxed">
                  {formatStrategicFocus(clientContext.strategic_focus)}
                </div>
              </div>
            )}

            {/* Pain Points */}
            {clientContext.pain_points && (
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Key Challenges</div>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {clientContext.pain_points}
                </div>
              </div>
            )}

            {/* Target Outcomes */}
            {clientContext.target_outcomes && (
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Target Outcomes</div>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {clientContext.target_outcomes}
                </div>
              </div>
            )}

            {/* Evolutionary Context Message */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-start gap-3 bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-cyan-900 font-medium mb-1">Evolving Strategic Context</p>
                  <p className="text-xs text-cyan-800 leading-relaxed">
                    This strategic context will <strong>deepen and iterate</strong> as we progress through the research phases. Through our conversations and territory exploration, we&apos;ll refine your understanding of market forces, customer needs, and organizational capabilities—building a richer, more nuanced strategy foundation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discovery Progress Checklist */}
      <div className="progress-checklist bg-white rounded-2xl border-2 border-slate-200 p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Discovery Progress</h3>
            <p className="text-sm text-slate-600">Strengthen your strategic foundation before mapping the terrain</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Company Context Check */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex-shrink-0 mt-0.5">
              {clientContext ? (
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 bg-slate-300 rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">Company strategic context provided</p>
              <p className="text-xs text-slate-600 mt-0.5">Your organization profile is available from onboarding</p>
            </div>
          </div>

          {/* Strategic Materials Check - MINIMUM REQUIREMENT */}
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border-2 border-amber-300">
            <div className="flex-shrink-0 mt-0.5">
              {uploadedFiles.length > 0 ? (
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900">Strategic materials uploaded</p>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-xs font-bold rounded-full">REQUIRED</span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5">
                {uploadedFiles.length > 0
                  ? `${uploadedFiles.length} document${uploadedFiles.length > 1 ? 's' : ''} uploaded - excellent!`
                  : 'At least 1 document outlining company name & performance needed'}
              </p>
            </div>
          </div>

          {/* AI Coaching Conversations Check */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">Coaching conversations (Recommended)</p>
              <p className="text-xs text-slate-600 mt-0.5">Discuss your strategic context with the AI coach to deepen understanding</p>
            </div>
          </div>
        </div>

        {/* Encouragement Message */}
        <div className="mt-4 p-4 bg-[#f4f4f7] border border-slate-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-900 font-semibold mb-1">The more context, the better insights</p>
              <p className="text-xs text-slate-700 leading-relaxed">
                While you can proceed with minimal materials, providing additional strategic documents, market research, and engaging in coaching conversations will significantly enhance the quality and relevance of your strategic insights throughout this journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Strategic Materials Section */}
      <div className="materials-section">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Add Strategic Materials</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload relevant documents, strategic plans, market research, or provide URLs to help ground our conversations in your existing strategic artifacts.
              </p>
            </div>
          </div>

          {/* AI Research Assistant Button */}
          <button
            onClick={() => setShowAiResearchModal(true)}
            className="w-full mb-6 p-4 bg-[#1a1f3a] hover:bg-[#252b4a] text-white rounded-xl transition-all hover:shadow-xl border-2 border-transparent hover:scale-[1.02] duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-lg mb-1">AI Research Assistant</div>
                <div className="text-sm text-white/90">Let the coach find supporting documents from listed sites, news articles, and market reviews</div>
              </div>
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Upload Area */}
      <div className="upload-area bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 hover:border-[#fbbf24] hover:bg-[#f4f4f7]/30 transition-all">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">Upload Strategic Materials</h4>
          <p className="text-sm text-slate-600 mb-6">
            PDF, DOCX, TXT, or provide a URL to a public document
          </p>

          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#fbbf24] text-slate-900 rounded-xl font-semibold cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Choose File
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.md,.rtf,.xlsx,.xls,.csv,.pptx,.ppt,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            disabled={isUploading}
          />

          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-slate-300" />
            <span className="text-sm text-slate-500 font-medium">OR</span>
            <div className="h-px flex-1 bg-slate-300" />
          </div>

          <UrlInput onSubmit={handleUrlSubmit} isDisabled={isUploading} />
        </div>

        {isUploading && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-[#1a1f3a] font-semibold">
              <div className="w-4 h-4 border-2 border-[#1a1f3a] border-t-transparent rounded-full animate-spin" />
              Uploading...
            </div>
          </div>
        )}

        {uploadError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600 font-semibold">{uploadError}</p>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files mt-6">
          <h4 className="text-base font-semibold text-slate-900 mb-4">
            Uploaded Materials ({uploadedFiles.length})
          </h4>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-[#fbbf24] transition-colors group"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-[#1a1f3a] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{file.filename}</p>
                  <p className="text-sm text-slate-500">
                    {file.file_type.toUpperCase()} · {formatFileSize(file.file_size)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {file.processing_status === 'completed' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Processed
                    </span>
                  )}
                  {file.processing_status === 'processing' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                      <div className="w-3 h-3 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
                      Processing
                    </span>
                  )}
                  {file.processing_status === 'failed' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                      Failed
                    </span>
                  )}
                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteConfirmation({ id: file.id, filename: file.filename })}
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    aria-label={`Delete ${file.filename}`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

      {/* Ready to Map Your Terrain CTA */}
      <div className="terrain-cta-section mt-8">
        {uploadedFiles.length > 0 ? (
          // Minimum requirement met - show success CTA
          <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl border-2 border-emerald-300 p-8 shadow-lg shadow-emerald-500/20">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to Map Your Terrain</h3>
                <p className="text-base text-slate-700 leading-relaxed mb-6">
                  You&apos;ve provided the essential strategic context to begin your journey. You can now proceed to explore the three strategic territories: <strong>Company</strong>, <strong>Customer</strong>, and <strong>Competitor</strong>.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={async () => {
                      // Transition to landscape phase
                      const response = await fetch(`/api/product-strategy-agent/phase`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          conversation_id: conversation.id,
                          phase: 'research',
                        }),
                      });

                      if (response.ok) {
                        window.location.reload();
                      }
                    }}
                    className="px-8 py-4 bg-[#fbbf24] text-slate-900 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
                  >
                    Begin Terrain Mapping →
                  </button>
                  <div className="text-sm text-slate-600">
                    <p className="font-semibold">Tip: Add more materials anytime</p>
                    <p className="text-xs">You can always upload additional documents as insights deepen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Minimum requirement not met - show guidance
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 p-8 shadow-lg shadow-amber-500/20">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/40">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Almost Ready to Map Your Terrain</h3>
                <p className="text-base text-slate-700 leading-relaxed mb-4">
                  To unlock the Landscape mapping phase, please upload <strong>at least one document</strong> that outlines your company name and performance. This ensures we have a solid foundation for strategic exploration.
                </p>
                <div className="bg-white rounded-xl p-4 border border-amber-200 mb-4">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Recommended documents:</p>
                  <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
                    <li>Annual report or quarterly performance summary</li>
                    <li>Strategic plan or business plan</li>
                    <li>Company overview or pitch deck</li>
                    <li>Market analysis or competitive landscape document</li>
                  </ul>
                </div>
                <p className="text-sm text-slate-600 italic">
                  <strong>Need help finding materials?</strong> Use the AI Research Assistant above to discover relevant documents.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Research Assistant Modal */}
      {showAiResearchModal && (
        <AiResearchModal
          conversation={conversation}
          onClose={() => setShowAiResearchModal(false)}
          onDocumentsAdded={(newFiles) => {
            setUploadedFiles((prev) => [...prev, ...newFiles]);
            setShowAiResearchModal(false);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-red-50 border-b border-red-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Delete Document</h3>
                  <p className="text-sm text-slate-600">This action cannot be undone</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-slate-700 mb-2">
                Are you sure you want to delete this document?
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="font-semibold text-slate-900 truncate">{deleteConfirmation.filename}</p>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                This will permanently remove the document and any extracted context from your strategy session.
              </p>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMaterial(deleteConfirmation.id)}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Document
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
  </div>
);
}

// URL Input Component
function UrlInput({ onSubmit, isDisabled }: { onSubmit: (url: string) => void; isDisabled: boolean }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url);
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex gap-3 max-w-2xl mx-auto">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/strategy-doc.pdf"
        className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent disabled:opacity-50"
        disabled={isDisabled}
      />
      <button
        type="submit"
        disabled={!url.trim() || isDisabled}
        className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Add URL
      </button>
    </form>
  );
}

// Helper function to format file size
function formatFileSize(bytes: number | null): string {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Helper function to format strategic focus
function formatStrategicFocus(focus: string): string {
  const focusMap: Record<string, string> = {
    strategy_to_execution: 'Bridging the gap between strategic vision and operational reality',
    product_model: 'Transforming into a product-centric operating model',
    team_empowerment: 'Enabling autonomous, high-performing teams',
    market_expansion: 'Expanding into new markets or customer segments',
    innovation_acceleration: 'Accelerating innovation and time-to-market',
    customer_experience: 'Improving customer experience and satisfaction',
    operational_excellence: 'Achieving operational excellence and efficiency',
    mixed: 'Comprehensive transformation combining multiple focus areas',
    other: 'Custom transformation focus',
  };

  return focusMap[focus] || focus;
}

// AI Research Assistant Modal Component
interface AiResearchModalProps {
  conversation: Conversation;
  onClose: () => void;
  onDocumentsAdded: (files: UploadedMaterial[]) => void;
}

function AiResearchModal({ conversation, onClose, onDocumentsAdded }: AiResearchModalProps) {
  const [websites, setWebsites] = useState('');
  const [topics, setTopics] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!topics.trim()) {
      setSearchError('Please provide topics or keywords to search for');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch('/api/product-strategy-agent/ai-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          websites: websites.split('\n').filter((w) => w.trim()),
          topics: topics.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Research failed');
      }

      const uploadedMaterials = await response.json();

      if (Array.isArray(uploadedMaterials) && uploadedMaterials.length > 0) {
        onDocumentsAdded(uploadedMaterials);
      } else {
        throw new Error('No documents were discovered. Try different topics or keywords.');
      }
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Research failed');
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#1a1f3a] text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">AI Research Assistant</h2>
              <p className="text-sm text-white/90">
                Let the coach discover supporting documents, articles, and market insights for you
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSearching}
              className="flex-shrink-0 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Information Banner */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-cyan-900 font-semibold mb-1">How it works</p>
                <p className="text-xs text-cyan-800 leading-relaxed">
                  Provide specific websites, topics, or keywords. The AI will search for relevant documents, news articles, market reports, and other strategic materials that match your needs.
                </p>
              </div>
            </div>
          </div>

          {/* Topics/Keywords Input */}
          <div>
            <label className="block mb-2">
              <span className="text-sm font-semibold text-slate-900">Topics & Keywords</span>
              <span className="text-xs text-red-600 ml-1">*</span>
            </label>
            <textarea
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="E.g., SaaS market trends 2024, enterprise software pricing strategies, product-led growth best practices"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 focus:outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              rows={3}
              disabled={isSearching}
            />
            <p className="text-xs text-slate-600 mt-1">
              What strategic topics, market areas, or themes should the AI research?
            </p>
          </div>

          {/* Websites Input (Optional) */}
          <div>
            <label className="block mb-2">
              <span className="text-sm font-semibold text-slate-900">Specific Websites</span>
              <span className="text-xs text-slate-600 ml-2">(Optional)</span>
            </label>
            <textarea
              value={websites}
              onChange={(e) => setWebsites(e.target.value)}
              placeholder="https://example.com/reports&#10;https://blog.competitor.com&#10;https://industry-insights.org"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 focus:outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm font-mono"
              rows={4}
              disabled={isSearching}
            />
            <p className="text-xs text-slate-600 mt-1">
              Enter specific websites to search (one per line). Leave empty to search broadly.
            </p>
          </div>

          {/* Error Display */}
          {searchError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-semibold">{searchError}</p>
            </div>
          )}

          {/* Searching State */}
          {isSearching && (
            <div className="p-6 bg-[#f4f4f7] border border-slate-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#1a1f3a] rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 mb-1">AI Research in Progress</p>
                  <p className="text-xs text-slate-700">
                    Searching for relevant documents, articles, and market insights. This may take a minute...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 rounded-b-2xl flex items-center justify-between">
          <button
            onClick={onClose}
            disabled={isSearching}
            className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSearch}
            disabled={isSearching || !topics.trim()}
            className="px-8 py-3 bg-[#fbbf24] text-slate-900 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {isSearching ? 'Researching...' : 'Start AI Research'}
          </button>
        </div>
      </div>
    </div>
  );
}
