"use client";
import React, { useState } from "react";
import { useAppSelector } from "../../lib/hooks";
import { TabNavigation } from "./TabNavigation";
import { NeededResourcesTab } from "./tabs/NeededResourcesTab";
import { StellarResourcesTab } from "./tabs/StellarResourcesTab";
import { ManufacturingResourcesTab } from "./tabs/ManufacturingResourcesTab";
import { ResourceSummary } from "./ResourceSummary";
import { getNextTierModule } from "../../data/shipModules";

export type TabType = "needed" | "stellar" | "manufacturing";

export default function ResourceGuide() {
  const installedModules = useAppSelector(
    (s) => s.shipSystems.installedModules
  );
  const resources = useAppSelector((s) => s.shipSystems.resources.inventory);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("needed");

  // 모든 업그레이드에 필요한 자원들 수집
  const requiredResources = new Map<
    string,
    { total: number; available: number; modules: string[] }
  >();

  Object.entries(installedModules).forEach(([moduleId, module]) => {
    const nextInfo = getNextTierModule(moduleId);
    if (!nextInfo) return;

    Object.entries(nextInfo.requiredResources).forEach(([resource, amount]) => {
      const current = requiredResources.get(resource) || {
        total: 0,
        available: resources[resource] || 0,
        modules: [],
      };
      current.total += amount;
      current.modules.push(moduleId);
      requiredResources.set(resource, current);
    });
  });

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-2 h-2 bg-cyan-400 animate-pulse rounded-full shadow-lg shadow-cyan-400/50" />
            <h1 className="text-2xl font-mono text-zinc-100 tracking-wider font-bold">
              자원 시스템 가이드
            </h1>
          </div>
          <p className="text-sm font-mono text-zinc-400 ml-5">
            모든 자원의 획득 방법과 활용 정보를 확인하세요
          </p>
        </div>

        {/* Resource Summary */}
        <ResourceSummary requiredResources={requiredResources} />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-zinc-800 p-6">
          {activeTab === "needed" && (
            <NeededResourcesTab
              requiredResources={requiredResources}
              selectedResource={selectedResource}
              setSelectedResource={setSelectedResource}
            />
          )}

          {activeTab === "stellar" && <StellarResourcesTab />}

          {activeTab === "manufacturing" && <ManufacturingResourcesTab />}
        </div>
      </div>
    </div>
  );
}
