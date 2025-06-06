"use client";
import React from "react";
import { useState } from "react";
import { useAppSelector } from "../../lib/hooks";
import SystemOverview from "./SystemOverview";
import UpgradeOverview from "../upgrade-overview/UpgradeOverview";
import ResourceGuide from "../resource-guide/ResourceGuide";
import ModuleCreator from "../module-create/ModuleCreator";
import ResearchCenter from "../research-center/ResearchCenter";
import ModuleSystemLayout from "../module-system/ModuleSystemLayout";
import CommunicationSystemLayout from "../communication-system/CommunicationSystemLayout";

type TabType = "modules" | "upgrades" | "creator" | "research" | "resources" | "communication";

export default function ShipSystemsPanel() {
  const shipSystems = useAppSelector((state) => state.shipSystems);
  const [activeTab, setActiveTab] = useState<TabType>("modules");

  const tabs = [
    { id: "modules" as TabType, label: "모듈 관리", icon: "⚙️" },
    { id: "upgrades" as TabType, label: "업그레이드", icon: "⬆️" },
    { id: "creator" as TabType, label: "모듈 생성", icon: "🔧" },
    { id: "research" as TabType, label: "연구 센터", icon: "🔬" },
    { id: "communication" as TabType, label: "통신 시스템", icon: "📡" },
    { id: "resources" as TabType, label: "자원 가이드", icon: "📋" },
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 relative overflow-hidden">
      {/* 네온 그리드 패턴 */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* 상단 시스템 개요 - 콤팩트한 디자인 */}
      <div className="relative p-3 border-b border-zinc-800/70 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/40 via-zinc-800/20 to-transparent" />
        <div className="relative">
          <SystemOverview
            hull={shipSystems.overallHullIntegrity}
            shield={shipSystems.overallShieldIntegrity}
          />
        </div>
      </div>

      {/* 네온 탭 네비게이션 */}
      <div className="relative border-b border-zinc-800/70 bg-zinc-900/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/30 to-transparent" />
        <div className="relative flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-all duration-300 group ${
                activeTab === tab.id
                  ? "text-emerald-300 border-b-2 border-emerald-400 bg-emerald-950/30 shadow-emerald-500/20 shadow-md"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <span className={`transition-all duration-300 ${
                  activeTab === tab.id ? "text-emerald-300 drop-shadow-lg" : ""
                }`}>{tab.icon}</span>
                <span className="whitespace-nowrap">{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-emerald-400/20 to-emerald-600/10 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                </>
              )}
              <div className={`absolute inset-0 rounded-sm transition-all duration-300 ${
                activeTab === tab.id 
                  ? "bg-emerald-500/5 border border-emerald-500/20" 
                  : "group-hover:bg-zinc-700/20"
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {activeTab === "modules" && (
          <div className="w-full">
            <ModuleSystemLayout />
          </div>
        )}

        {activeTab === "upgrades" && (
          <div className="w-full p-3 overflow-y-auto bg-zinc-950/60 backdrop-blur-sm">
            <UpgradeOverview />
          </div>
        )}

        {activeTab === "creator" && (
          <div className="w-full overflow-y-auto bg-zinc-950/60 backdrop-blur-sm">
            <ModuleCreator />
          </div>
        )}

        {activeTab === "research" && (
          <div className="w-full overflow-y-auto bg-zinc-950/60 backdrop-blur-sm">
            <ResearchCenter />
          </div>
        )}

        {activeTab === "communication" && (
          <div className="w-full">
            <CommunicationSystemLayout />
          </div>
        )}

        {activeTab === "resources" && (
          <div className="w-full p-3 overflow-y-auto bg-zinc-950/60 backdrop-blur-sm">
            <ResourceGuide />
          </div>
        )}
      </div>
    </div>
  );
}
