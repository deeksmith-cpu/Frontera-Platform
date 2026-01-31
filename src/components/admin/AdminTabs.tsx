"use client";

import { useState } from "react";
import ApplicationList from "./ApplicationList";
import UserProfileList from "./UserProfileList";

const TABS = [
  { id: "applications", label: "Applications" },
  { id: "profiles", label: "User Profiles" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("applications");

  return (
    <div>
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "border-b-2 border-[#fbbf24] text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "applications" ? <ApplicationList /> : <UserProfileList />}
    </div>
  );
}
