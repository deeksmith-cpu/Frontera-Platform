"use client";

import { useState } from "react";
import type { ClientOnboarding } from "@/types/database";

interface ApplicationDetailModalProps {
  application: ClientOnboarding;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ApplicationDetailModal({
  application,
  onClose,
  onUpdate,
}: ApplicationDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState(application.review_notes || "");
  const [provisionEmail, setProvisionEmail] = useState("");
  const [showProvisionForm, setShowProvisionForm] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleApprove = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved", review_notes: reviewNotes }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reviewNotes.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", review_notes: reviewNotes }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProvision = async () => {
    if (!provisionEmail.trim()) {
      setError("Please enter an email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/applications/${application.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: provisionEmail }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to provision");
    } finally {
      setIsLoading(false);
    }
  };

  const canApproveReject = application.status === "submitted";
  const canProvision = application.status === "approved" && !application.provisioned_org_id;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {application.company_name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Company Info */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Company Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p className="font-medium text-gray-900">{application.industry}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company Size</p>
                <p className="font-medium text-gray-900">{application.company_size}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted</p>
                <p className="font-medium text-gray-900">{formatDate(application.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Strategic Focus</p>
                <p className="font-medium text-gray-900">
                  {application.strategic_focus?.replace(/_/g, " ")}
                </p>
              </div>
            </div>
          </section>

          {/* Pain Points */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Pain Points
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {application.pain_points || "Not provided"}
            </p>
          </section>

          {/* Previous Attempts */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Previous Transformation Attempts
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {application.previous_attempts || "Not provided"}
            </p>
          </section>

          {/* Target Outcomes */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Target Outcomes
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {application.target_outcomes || "Not provided"}
            </p>
          </section>

          {/* Invitation Status (if applicable) */}
          {application.invitation_status && (
            <section className="p-4 bg-gray-50 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Invitation Status
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {application.invitation_status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{application.invitation_email}</p>
                </div>
                {application.invitation_sent_at && (
                  <div>
                    <p className="text-sm text-gray-500">Sent At</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(application.invitation_sent_at)}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Review Notes */}
          {(canApproveReject || application.review_notes) && (
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Review Notes
              </h3>
              {canApproveReject ? (
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4]/20 transition-all outline-none"
                />
              ) : (
                <p className="text-gray-700">{application.review_notes}</p>
              )}
            </section>
          )}

          {/* Provision Form */}
          {canProvision && (
            <section className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <h3 className="text-sm font-semibold text-green-800 mb-3">
                Provision Pilot Account
              </h3>
              {!showProvisionForm ? (
                <button
                  onClick={() => setShowProvisionForm(true)}
                  className="px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-all"
                >
                  Start Provisioning
                </button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invitation Email
                    </label>
                    <input
                      type="email"
                      value={provisionEmail}
                      onChange={(e) => setProvisionEmail(e.target.value)}
                      placeholder="applicant@company.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowProvisionForm(false)}
                      className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProvision}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-all disabled:opacity-50"
                    >
                      {isLoading ? "Provisioning..." : "Create Account & Send Invite"}
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Actions */}
        {canApproveReject && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Approve"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
