"use client";

import { useState } from "react";
import type { OrganizationMember } from "@/types/auth";

interface RemoveMemberModalProps {
  member: OrganizationMember;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RemoveMemberModal({
  member,
  onClose,
  onSuccess,
}: RemoveMemberModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullName = `${member.firstName} ${member.lastName}`.trim() || member.email;

  const handleRemove = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/organizations/members/${member.userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove member");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 max-w-md w-full overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Remove Member</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-900">
                  Are you sure you want to remove{" "}
                  <span className="font-semibold">{fullName}</span> from the organization?
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  They will lose access to all organization data.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isLoading}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                !isLoading
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Removing..." : "Remove Member"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
