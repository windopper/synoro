import React from "react";
import { TabType } from "./ResourceGuide";

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const tabs = [
    { id: "needed" as TabType, label: "필요 자원", icon: "🎯" },
    { id: "stellar" as TabType, label: "항성 자원", icon: "⭐" },
    { id: "manufacturing" as TabType, label: "제조 자원", icon: "🏭" },
  ];

  return (
    <div className="flex space-x-2 bg-zinc-900 p-2 rounded-lg border border-zinc-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            flex-1 px-6 py-3 rounded-md font-mono text-sm font-medium transition-all duration-300
            flex items-center justify-center space-x-2
            ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25 transform scale-105"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent hover:border-zinc-700"
            }
          `}
        >
          <span className="text-base">{tab.icon}</span>
          <span className="tracking-wide">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
