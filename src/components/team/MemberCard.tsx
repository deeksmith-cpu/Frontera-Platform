"use client";

import Image from "next/image";
import type { OrganizationMember } from "@/types/auth";

interface MemberCardProps {
  member: OrganizationMember;
  isAdmin: boolean;
  isCurrentUser: boolean;
  onEditRole: () => void;
  onRemove: () => void;
}

export default function MemberCard({
  member,
  isAdmin,
  isCurrentUser,
  onEditRole,
  onRemove,
}: MemberCardProps) {
  const displayRole = member.role.replace("org:", "").replace("_", " ");
  const formattedRole = displayRole.charAt(0).toUpperCase() + displayRole.slice(1);
  const fullName = `${member.firstName} ${member.lastName}`.trim() || "Unknown User";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {member.imageUrl ? (
          <Image
            src={member.imageUrl}
            alt={fullName}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="text-slate-600 font-semibold text-lg">
              {member.firstName?.[0] || member.email[0].toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            {fullName}
            {isCurrentUser && (
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                You
              </span>
            )}
          </h3>
          <p className="text-sm text-slate-600">{member.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            member.role === "org:admin"
              ? "text-[#1a1f3a] bg-[#1a1f3a]/10"
              : "text-slate-600 bg-slate-100"
          }`}
        >
          {formattedRole}
        </span>

        {isAdmin && !isCurrentUser && (
          <div className="flex gap-2">
            <button
              onClick={onEditRole}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
            >
              Edit Role
            </button>
            <button
              onClick={onRemove}
              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
