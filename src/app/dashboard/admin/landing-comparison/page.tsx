"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingComparisonPage() {
  const [activeTab, setActiveTab] = useState<"original" | "mockup">("original");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/admin"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Admin
              </Link>
              <div className="h-6 w-px bg-slate-200"></div>
              <h1 className="text-lg font-semibold text-slate-900">Landing Page Comparison</h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 mr-2">Compare:</span>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("original")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === "original"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Original (Components)
                </button>
                <button
                  onClick={() => setActiveTab("mockup")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === "mockup"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Mockup (Fintech Style)
                </button>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 px-4 py-2 text-sm font-medium bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e3070] transition-colors flex items-center gap-2"
              >
                View Live Page
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3H3V13H13V10M9 3H13V7M13 3L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-3 text-sm">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue-600 flex-shrink-0">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-blue-800">
              <strong>Note:</strong> The current live landing page uses Landing V2 design. These are archived versions for comparison during pilot refinement.
            </p>
          </div>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            {/* Browser Chrome */}
            <div className="bg-slate-100 px-4 py-3 flex items-center gap-3 border-b border-slate-200">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-white rounded-md px-4 py-1.5 text-sm text-slate-500">
                localhost:3001/{activeTab === "original" ? "dashboard/admin/landing-comparison/original" : "landing-mockup"}
              </div>
            </div>

            {/* iFrame Content */}
            <div className="h-[calc(100vh-280px)] overflow-hidden">
              {activeTab === "original" ? (
                <iframe
                  src="/dashboard/admin/landing-comparison/original"
                  className="w-full h-full border-0"
                  title="Original Landing Page"
                />
              ) : (
                <iframe
                  src="/landing-mockup"
                  className="w-full h-full border-0"
                  title="Mockup Landing Page"
                />
              )}
            </div>
          </div>

          {/* Comparison Notes */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl border-2 transition-all ${activeTab === "original" ? "border-[#1e3a8a] bg-indigo-50" : "border-slate-200 bg-white"}`}>
              <h3 className="font-semibold text-slate-900 mb-2">Original (Component-based)</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Uses modular React components</li>
                <li>• Tailwind CSS styling</li>
                <li>• Standard enterprise messaging</li>
                <li>• Logo component with live text</li>
              </ul>
            </div>
            <div className={`p-6 rounded-xl border-2 transition-all ${activeTab === "mockup" ? "border-[#1e3a8a] bg-indigo-50" : "border-slate-200 bg-white"}`}>
              <h3 className="font-semibold text-slate-900 mb-2">Mockup (Fintech Style)</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Fintech-inspired phone mockups</li>
                <li>• Custom CSS animations</li>
                <li>• Card-based visual elements</li>
                <li>• More playful aesthetic</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
