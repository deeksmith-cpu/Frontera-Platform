'use client';

import { useState, useEffect } from 'react';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type UploadedMaterial = Database['public']['Tables']['uploaded_materials']['Row'];

interface DiscoverySectionProps {
  conversation: Conversation;
}

export function DiscoverySection({ conversation }: DiscoverySectionProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedMaterial[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="discovery-section max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Discovery Phase</h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Let&apos;s establish your strategic context. Upload any relevant documents, strategic plans, or
          market research to help me understand your landscape.
        </p>
      </div>

      {/* Upload Area */}
      <div className="upload-area bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 mb-8 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
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
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Strategic Materials</h3>
          <p className="text-sm text-slate-600 mb-6">
            PDF, DOCX, TXT, or provide a URL to a public document
          </p>

          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
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
            accept=".pdf,.docx,.txt"
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
            <div className="inline-flex items-center gap-2 text-indigo-600 font-semibold">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
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
        <div className="uploaded-files">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Uploaded Materials</h3>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-lg flex items-center justify-center">
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
                <div>
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
                </div>
              </div>
            ))}
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
        className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:opacity-50"
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
