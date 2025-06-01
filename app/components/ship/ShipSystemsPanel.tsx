"use client";
import React from "react";
import { useState } from "react";
import { useAppSelector } from "../../lib/hooks";
import SystemOverview from "./SystemOverview";
import EnergyManagement from "./EnergyManagement";
import ResourceStatus from "./ResourceStatus";
import ModuleGrid from "./ModuleGrid";
import ModuleDetails from "./ModuleDetails";
import UpgradeOverview from "./UpgradeOverview";
import ResourceGuide from "./ResourceGuide";
import ModuleCreator from "./ModuleCreator";
import ResearchCenter from "./ResearchCenter";

type TabType = 'modules' | 'upgrades' | 'creator' | 'research' | 'resources';

export default function ShipSystemsPanel() {
  const shipSystems = useAppSelector((state) => state.shipSystems);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('modules');

  const tabs = [
    { id: 'modules' as TabType, label: '모듈 관리', icon: '⚙️' },
    { id: 'upgrades' as TabType, label: '업그레이드', icon: '⬆️' },
    { id: 'creator' as TabType, label: '모듈 생성', icon: '🔧' },
    { id: 'research' as TabType, label: '연구 센터', icon: '🔬' },
    { id: 'resources' as TabType, label: '자원 가이드', icon: '📋' }
  ];

  return (
    <div className="flex flex-col h-full text-gray-200 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "linear-gradient(rgba(156, 163, 175, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(156, 163, 175, 0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>
      
      {/* System Overview Section */}
      <div className="relative p-4 border-b border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-transparent" />
        <div className="relative">
          <SystemOverview
            hull={shipSystems.overallHullIntegrity}
            shield={shipSystems.overallShieldIntegrity}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative border-b border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/10 to-transparent" />
        <div className="relative flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3 text-sm font-mono uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-cyan-300 border-b-2 border-cyan-500/80 bg-cyan-900/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-cyan-500/20 to-cyan-600/10 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {activeTab === 'modules' && (
          <>
            {/* Left Panel - System Status */}
            <div className="w-1/3 p-4 overflow-y-auto border-r border-gray-700/50 space-y-4 relative">
              <div className="absolute inset-y-0 right-0 w-0.5 bg-gradient-to-b from-transparent via-gray-600 to-transparent" />
              
              <EnergyManagement energy={shipSystems.energy} />
              <ResourceStatus resources={shipSystems.resources} />
              <ModuleGrid
                modules={shipSystems.installedModules}
                selectedModuleId={selectedModuleId}
                onSelect={setSelectedModuleId}
              />
            </div>
            
            {/* Right Panel - Module Details */}
            <div className="w-2/3 p-4 overflow-y-auto relative">
              {selectedModuleId ? (
                <ModuleDetails moduleId={selectedModuleId} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-12 h-12 border border-gray-600 mx-auto mb-4 flex items-center justify-center rounded">
                      <div className="w-3 h-3 bg-gray-500 animate-pulse rounded-full" />
                    </div>
                    <div className="text-gray-400 font-mono text-sm uppercase tracking-wider mb-2">
                      Module Selection Required
                    </div>
                    <div className="text-gray-500 font-mono text-xs">
                      Select a module from the left panel to view details
                    </div>
                    <div className="flex justify-center mt-4">
                      <div className="flex space-x-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-1 bg-gray-500 rounded-full"
                            style={{
                              animationDelay: `${i * 0.3}s`,
                              animation: "pulse 2s infinite",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'upgrades' && (
          <div className="w-full p-4 overflow-y-auto">
            <UpgradeOverview />
          </div>
        )}

        {activeTab === 'creator' && (
          <div className="w-full overflow-y-auto">
            <ModuleCreator />
          </div>
        )}

        {activeTab === 'research' && (
          <div className="w-full overflow-y-auto">
            <ResearchCenter />
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="w-full p-4 overflow-y-auto">
            <ResourceGuide />
          </div>
        )}
      </div>
    </div>
  );
}
