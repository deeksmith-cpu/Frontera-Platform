"use client";

import { Suspense } from "react";
import AcceptInvitationContent from "./AcceptInvitationContent";

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Processing invitation...</p>
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AcceptInvitationContent />
    </Suspense>
  );
}
