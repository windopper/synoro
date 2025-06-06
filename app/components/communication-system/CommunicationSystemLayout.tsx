"use client";
import React, { useState } from "react";
import CommunicationInterface from "./CommunicationInterface";
import SignalStrengthDisplay from "./SignalStrengthDisplay";
import CommunicationHistory from "./CommunicationHistory";

type CommunicationTabType = "interface" | "signal" | "history";

export default function CommunicationSystemLayout() {
  const [activeTab, setActiveTab] = useState<CommunicationTabType>("interface");

  const tabs = [
    { id: "interface" as CommunicationTabType, label: "Communication", icon: "📡" },
    { id: "signal" as CommunicationTabType, label: "Signal Status", icon: "📶" },
    { id: "history" as CommunicationTabType, label: "History", icon: "📋" },
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-950/60 backdrop-blur-sm">
      {/* 탭 네비게이션 */}
      <div className="border-b border-zinc-800/50 bg-zinc-900/30">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3 text-sm font-mono uppercase tracking-wider transition-all duration-300 group ${
                activeTab === tab.id
                  ? "text-emerald-300 border-b-2 border-emerald-400 bg-emerald-950/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className={`transition-all duration-300 ${
                  activeTab === tab.id ? "text-emerald-300" : ""
                }`}>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "interface" && <CommunicationInterface />}
        {activeTab === "signal" && <SignalStrengthDisplay />}
        {activeTab === "history" && <CommunicationHistory />}
      </div>
    </div>
  );
} 