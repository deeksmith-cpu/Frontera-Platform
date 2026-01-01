"use client";

import type { ClientOnboarding } from "@/types/database";

interface ApplicationCardProps {
  application: ClientOnboarding;
  onView: () => void;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  submitted: { bg: "bg-blue-100", text: "text-blue-700", label: "Pending Review" },
  approved: { bg: "bg-green-100", text: "text-green-700", label: "Approved" },
  rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
  provisioned: { bg: "bg-purple-100", text: "text-purple-700", label: "Provisioned" },
  draft: { bg: "bg-gray-100", text: "text-gray-600", label: "Draft" },
};

const INVITATION_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  sent: { bg: "bg-amber-100", text: "text-amber-700", label: "Invite Sent" },
  accepted: { bg: "bg-green-100", text: "text-green-700", label: "Invite Accepted" },
  expired: { bg: "bg-gray-100", text: "text-gray-600", label: "Invite Expired" },
  revoked: { bg: "bg-red-100", text: "text-red-700", label: "Invite Revoked" },
};

export default function ApplicationCard({ application, onView }: ApplicationCardProps) {
  const statusStyle = STATUS_STYLES[application.status] || STATUS_STYLES.draft;
  const invitationStyle = application.invitation_status
    ? INVITATION_STYLES[application.invitation_status]
    : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      onClick={onView}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">
            {application.company_name}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {application.industry} · {application.company_size}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.label}
          </span>
          {invitationStyle && (
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${invitationStyle.bg} ${invitationStyle.text}`}
            >
              {invitationStyle.label}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          Submitted {formatDate(application.created_at)}
        </span>
        <svg
          className="w-5 h-5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    </div>
  );
}
