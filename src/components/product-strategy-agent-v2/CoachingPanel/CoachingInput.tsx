'use client';

import { useState, useRef, KeyboardEvent, useMemo } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Upload, Link2, Lightbulb, X } from 'lucide-react';

interface TerritoryProgress {
  mapped: number;
  total: number;
}

interface SmartPromptsContext {
  phase: string;
  materialsCount: number;
  territoryProgress: {
    company: TerritoryProgress;
    customer: TerritoryProgress;
    competitor: TerritoryProgress;
  };
  synthesisAvailable: boolean;
}

interface SmartPrompt {
  text: string;
  category: 'discovery' | 'research' | 'synthesis' | 'bets' | 'general';
}

interface CoachingInputProps {
  onSendMessage: (content: string) => void;
  isDisabled: boolean;
  smartPromptsContext?: SmartPromptsContext;
  conversationId?: string;
  onMaterialsChanged?: () => void;
}

// Generate smart prompts based on context
function getSmartPrompts(context?: SmartPromptsContext): SmartPrompt[] {
  if (!context) return [];

  const { phase, materialsCount, territoryProgress, synthesisAvailable } = context;
  const prompts: SmartPrompt[] = [];

  // Discovery phase prompts
  if (phase === 'discovery') {
    if (materialsCount === 0) {
      prompts.push({ text: "What documents should I upload to get started?", category: 'discovery' });
      prompts.push({ text: "Help me think through our strategic challenges", category: 'discovery' });
    } else {
      prompts.push({ text: "What insights can you share from my documents?", category: 'discovery' });
      prompts.push({ text: "Am I ready to start mapping strategic terrain?", category: 'discovery' });
    }
  }

  // Research phase prompts
  if (phase === 'research') {
    const { company, customer, competitor } = territoryProgress;

    if (company.mapped < company.total) {
      prompts.push({ text: "What should I focus on in Company territory?", category: 'research' });
    }
    if (customer.mapped < customer.total) {
      prompts.push({ text: "Help me understand our customer segments", category: 'research' });
    }
    if (competitor.mapped < competitor.total) {
      prompts.push({ text: "What competitive dynamics should I explore?", category: 'research' });
    }

    const totalMapped = company.mapped + customer.mapped + competitor.mapped;
    if (totalMapped >= 4 && !synthesisAvailable) {
      prompts.push({ text: "Am I ready to generate the strategic synthesis?", category: 'research' });
    }
  }

  // Synthesis phase prompts
  if (phase === 'synthesis') {
    prompts.push({ text: "Walk me through the strategic opportunities", category: 'synthesis' });
    prompts.push({ text: "What tensions exist in the synthesis?", category: 'synthesis' });
    prompts.push({ text: "Help me formulate Strategic Bets", category: 'synthesis' });
  }

  // Bets phase prompts
  if (phase === 'bets' || phase === 'planning') {
    prompts.push({ text: "How should I prioritize these Strategic Bets?", category: 'bets' });
    prompts.push({ text: "What success metrics should each bet have?", category: 'bets' });
    prompts.push({ text: "What are the key risks for each bet?", category: 'bets' });
  }

  // Add general fallback prompts if we have few phase-specific ones
  if (prompts.length < 2) {
    prompts.push({ text: "What should I focus on next?", category: 'general' });
    prompts.push({ text: "Help me understand my strategic position", category: 'general' });
  }

  return prompts.slice(0, 3); // Max 3 prompts
}

/* ── Discovery Toolbar ───────────────────────────────────────────── */

function DiscoveryToolbar({
  conversationId,
  onMaterialsChanged,
  isDisabled,
}: {
  conversationId: string;
  onMaterialsChanged?: () => void;
  isDisabled: boolean;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [showAiResearch, setShowAiResearch] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversation_id', conversationId);

      const response = await fetch('/api/product-strategy-agent-v2/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      setUploadStatus({ type: 'success', message: `${file.name} uploaded` });
      onMaterialsChanged?.();
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (error) {
      setUploadStatus({ type: 'error', message: error instanceof Error ? error.message : 'Upload failed' });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlValue.trim()) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const response = await fetch('/api/product-strategy-agent-v2/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          url: urlValue.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'URL import failed');
      }

      setUploadStatus({ type: 'success', message: 'URL imported' });
      setUrlValue('');
      setShowUrlInput(false);
      onMaterialsChanged?.();
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (error) {
      setUploadStatus({ type: 'error', message: error instanceof Error ? error.message : 'URL import failed' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="mb-2 space-y-2">
        {/* Action buttons row */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mr-1">Add context</span>

          {/* Upload File */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isDisabled || isUploading}
            className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Upload className="w-3 h-3" />
            Upload File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.md,.rtf,.xlsx,.xls,.csv,.pptx,.ppt,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            disabled={isDisabled || isUploading}
          />

          {/* Add URL */}
          <button
            onClick={() => { setShowUrlInput(!showUrlInput); setShowAiResearch(false); }}
            disabled={isDisabled || isUploading}
            className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              showUrlInput
                ? 'bg-cyan-50 text-cyan-700 border-cyan-300'
                : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Link2 className="w-3 h-3" />
            Add URL
          </button>

          {/* AI Research */}
          <button
            onClick={() => { setShowAiResearch(!showAiResearch); setShowUrlInput(false); }}
            disabled={isDisabled || isUploading}
            className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              showAiResearch
                ? 'bg-[#1a1f3a] text-white border-[#1a1f3a]'
                : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Lightbulb className="w-3 h-3" />
            AI Research
          </button>

          {/* Upload spinner */}
          {isUploading && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              Uploading...
            </div>
          )}
        </div>

        {/* URL input inline */}
        {showUrlInput && (
          <div className="flex gap-2 animate-fade-in">
            <input
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleUrlSubmit(); } }}
              placeholder="https://example.com/document.pdf"
              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/20 focus:border-[#fbbf24] disabled:opacity-50"
              disabled={isUploading}
              autoFocus
            />
            <button
              onClick={handleUrlSubmit}
              disabled={!urlValue.trim() || isUploading}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => { setShowUrlInput(false); setUrlValue(''); }}
              className="px-1.5 py-1.5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* AI Research inline panel */}
        {showAiResearch && (
          <AiResearchPanel
            conversationId={conversationId}
            onComplete={() => {
              setShowAiResearch(false);
              onMaterialsChanged?.();
            }}
            onClose={() => setShowAiResearch(false)}
          />
        )}

        {/* Status message */}
        {uploadStatus && (
          <div className={`flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-lg ${
            uploadStatus.type === 'success'
              ? 'text-emerald-700 bg-emerald-50'
              : 'text-red-700 bg-red-50'
          }`}>
            {uploadStatus.type === 'success' ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {uploadStatus.message}
          </div>
        )}
      </div>
    </>
  );
}

/* ── AI Research Panel (compact inline version) ──────────────────── */

function AiResearchPanel({
  conversationId,
  onComplete,
  onClose,
}: {
  conversationId: string;
  onComplete: () => void;
  onClose: () => void;
}) {
  const [topics, setTopics] = useState('');
  const [websites, setWebsites] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!topics.trim()) {
      setError('Please provide topics or keywords');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch('/api/product-strategy-agent-v2/ai-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          websites: websites.split('\n').filter((w) => w.trim()),
          topics: topics.trim(),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Research failed');
      }

      const results = await response.json();
      if (!Array.isArray(results) || results.length === 0) {
        throw new Error('No documents found. Try different topics.');
      }

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Research failed');
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-3 space-y-2.5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-[#fbbf24]" />
          <span className="text-xs font-semibold text-slate-700">AI Research Assistant</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed">
        Provide topics or keywords and the AI will find relevant documents, articles, and market insights.
      </p>

      <div>
        <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
          Topics & Keywords <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          placeholder="e.g., SaaS market trends, product-led growth"
          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/20 focus:border-[#fbbf24] disabled:opacity-50"
          disabled={isSearching}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
          Specific Websites <span className="text-slate-400">(optional)</span>
        </label>
        <input
          type="text"
          value={websites}
          onChange={(e) => setWebsites(e.target.value)}
          placeholder="e.g., mckinsey.com, hbr.org"
          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/20 focus:border-[#fbbf24] disabled:opacity-50"
          disabled={isSearching}
        />
      </div>

      {error && (
        <p className="text-[11px] text-red-600 font-medium">{error}</p>
      )}

      <button
        onClick={handleSearch}
        disabled={!topics.trim() || isSearching}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold bg-[#1a1f3a] text-white rounded-lg hover:bg-[#252b4a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSearching ? (
          <>
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Researching...
          </>
        ) : (
          <>
            <Lightbulb className="w-3.5 h-3.5" />
            Start AI Research
          </>
        )}
      </button>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────── */

export function CoachingInput({ onSendMessage, isDisabled, smartPromptsContext, conversationId, onMaterialsChanged }: CoachingInputProps) {
  const [value, setValue] = useState('');
  const [promptsExpanded, setPromptsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const smartPrompts = useMemo(
    () => getSmartPrompts(smartPromptsContext),
    [smartPromptsContext]
  );

  const isDiscovery = smartPromptsContext?.phase === 'discovery';

  const handleSend = () => {
    if (value.trim() && !isDisabled) {
      onSendMessage(value);
      setValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handlePromptClick = (promptText: string) => {
    if (!isDisabled) {
      onSendMessage(promptText);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  return (
    <div className="coaching-input p-3 sm:p-4 border-t border-slate-100 bg-white">
      {/* Smart Prompts — collapsible */}
      {!isDisabled && smartPrompts.length > 0 && (
        <div className="mb-3">
          <button
            onClick={() => setPromptsExpanded(!promptsExpanded)}
            className="flex items-center gap-1.5 mb-2 group"
          >
            <Sparkles className="w-3 h-3 text-[#fbbf24]" />
            <span className="text-xs text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
              Suggested prompts ({smartPrompts.length})
            </span>
            {promptsExpanded ? (
              <ChevronUp className="w-3 h-3 text-slate-400" />
            ) : (
              <ChevronDown className="w-3 h-3 text-slate-400" />
            )}
          </button>
          {promptsExpanded && (
            <div className="flex gap-2 overflow-x-auto flex-nowrap pb-1">
              {smartPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handlePromptClick(prompt.text)}
                  className="text-xs px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full border border-slate-200 transition-colors hover:border-slate-300 whitespace-nowrap flex-shrink-0"
                >
                  {prompt.text}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Always-visible coaching action pills */}
      {!isDisabled && (
        <div className="flex gap-1.5 mb-2 overflow-x-auto pb-0.5">
          {[
            { label: 'Challenge my thinking', icon: '⚡' },
            { label: 'Show me a framework', icon: '📐' },
            { label: 'What evidence supports this?', icon: '🔍' },
            { label: 'Suggest next steps', icon: '→' },
          ].map((pill, i) => (
            <button
              key={pill.label}
              onClick={() => handlePromptClick(pill.label)}
              className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors whitespace-nowrap flex-shrink-0 animate-entrance animate-delay-${i * 75}`}
              style={{ animationDelay: `${i * 75}ms` }}
            >
              <span className="text-[10px]">{pill.icon}</span>
              {pill.label}
            </button>
          ))}
        </div>
      )}

      {/* Discovery toolbar — upload, URL, AI Research */}
      {isDiscovery && conversationId && (
        <DiscoveryToolbar
          conversationId={conversationId}
          onMaterialsChanged={onMaterialsChanged}
          isDisabled={isDisabled}
        />
      )}

      {/* Input area */}
      <div className="input-wrapper relative">
        <textarea
          ref={textareaRef}
          className="input-field w-full text-sm p-4 pr-14 border border-slate-200 rounded-xl bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400"
          rows={2}
          placeholder="Share your insights or ask a question..."
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || isDisabled}
          className="send-btn absolute right-2 bottom-2 w-10 h-10 bg-[#fbbf24] text-slate-900 hover:bg-[#f59e0b] border-0 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:shadow-lg hover:scale-105 active:animate-spring disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M16 2L8 10M16 2L10.5 16L8 10M16 2L2 7.5L8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
