"use client";

import Link from "next/link";

interface SuccessScreenProps {
  onEdit: () => void;
  recordId: string | null;
}

export default function SuccessScreen({ onEdit, recordId }: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Success Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-teal-electric to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-teal-electric/30">
            <svg
              className="w-12 h-12 text-white animate-[fadeInUp_0.5s_ease-out]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          {/* Decorative rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-teal-electric/20 animate-ping" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Application Submitted
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Thank you for completing your onboarding information. Our transformation experts
          will review your submission and reach out within 24 hours.
        </p>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 mb-8 text-left">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-indigo-deep"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            What happens next
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-deep/10 text-indigo-deep font-semibold text-sm flex items-center justify-center">
                1
              </span>
              <span className="text-gray-600">
                Our team reviews your information and prepares personalized recommendations
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-deep/10 text-indigo-deep font-semibold text-sm flex items-center justify-center">
                2
              </span>
              <span className="text-gray-600">
                We&apos;ll schedule a discovery call to dive deeper into your needs
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-deep/10 text-indigo-deep font-semibold text-sm flex items-center justify-center">
                3
              </span>
              <span className="text-gray-600">
                Receive a customized transformation roadmap tailored to your organization
              </span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onEdit}
            className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            Edit Submission
          </button>
          <Link
            href="/"
            className="px-8 py-3 rounded-xl font-semibold bg-indigo-deep text-white hover:bg-indigo-darker shadow-lg shadow-indigo-deep/25 transition-all inline-flex items-center justify-center gap-2"
          >
            Back to Home
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Reference ID */}
        {recordId && (
          <p className="mt-8 text-sm text-gray-400">
            Reference ID: <code className="bg-gray-100 px-2 py-1 rounded">{recordId}</code>
          </p>
        )}
      </div>
    </div>
  );
}
