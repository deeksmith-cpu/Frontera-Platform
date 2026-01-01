"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrganizationMember } from "@/types/auth";
import MemberCard from "./MemberCard";
import InviteMemberModal from "./InviteMemberModal";
import EditRoleModal from "./EditRoleModal";
import RemoveMemberModal from "./RemoveMemberModal";

interface MemberListProps {
  members: OrganizationMember[];
  isAdmin: boolean;
  currentUserId: string;
}

type ModalType = "invite" | "edit" | "remove" | null;

export default function MemberList({
  members,
  isAdmin,
  currentUserId,
}: MemberListProps) {
  const router = useRouter();
  const [selectedMember, setSelectedMember] = useState<OrganizationMember | null>(
    null
  );
  const [modalType, setModalType] = useState<ModalType>(null);

  const handleEditRole = (member: OrganizationMember) => {
    setSelectedMember(member);
    setModalType("edit");
  };

  const handleRemove = (member: OrganizationMember) => {
    setSelectedMember(member);
    setModalType("remove");
  };

  const handleInvite = () => {
    setSelectedMember(null);
    setModalType("invite");
  };

  const handleClose = () => {
    setModalType(null);
    setSelectedMember(null);
  };

  const handleSuccess = () => {
    // Refresh the page to get updated member list
    router.refresh();
  };

  // Sort members: admins first, then by name
  const sortedMembers = [...members].sort((a, b) => {
    if (a.role === "org:admin" && b.role !== "org:admin") return -1;
    if (a.role !== "org:admin" && b.role === "org:admin") return 1;
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="space-y-6">
      {/* Header with invite button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {members.length} {members.length === 1 ? "member" : "members"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleInvite}
            className="px-5 py-2.5 rounded-xl font-semibold bg-[#1e3a8a] text-white hover:bg-[#1e2a5e] shadow-lg shadow-[#1e3a8a]/25 transition-all flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Invite Member
          </button>
        )}
      </div>

      {/* Member list */}
      <div className="space-y-3">
        {sortedMembers.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            isAdmin={isAdmin}
            isCurrentUser={member.userId === currentUserId}
            onEditRole={() => handleEditRole(member)}
            onRemove={() => handleRemove(member)}
          />
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No team members yet
          </h3>
          <p className="text-slate-600 mb-6">
            Invite your colleagues to start collaborating
          </p>
          {isAdmin && (
            <button
              onClick={handleInvite}
              className="px-6 py-3 rounded-xl font-semibold bg-[#1e3a8a] text-white hover:bg-[#1e2a5e] shadow-lg shadow-[#1e3a8a]/25 transition-all"
            >
              Invite Your First Member
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {modalType === "invite" && (
        <InviteMemberModal onClose={handleClose} onSuccess={handleSuccess} />
      )}

      {modalType === "edit" && selectedMember && (
        <EditRoleModal
          member={selectedMember}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}

      {modalType === "remove" && selectedMember && (
        <RemoveMemberModal
          member={selectedMember}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
