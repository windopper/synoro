"use client";
import React from "react";
import type { 
  EnergyManagement as EnergyState, 
  ResourceManagement, 
  InstalledModule 
} from "../../lib/features/shipSystemsSlice";
import EnergyManagementCard from "./EnergyManagementCard";
import ResourceStatusCard from "./ResourceStatusCard";
import ModuleListCard from "./ModuleListCard";

interface ModuleSystemSidebarProps {
  energy: EnergyState;
  resources: ResourceManagement;
  modules: { [moduleId: string]: InstalledModule };
  selectedModuleId: string | null;
  onSelectModule: (id: string) => void;
}

export default function ModuleSystemSidebar({
  energy,
  resources,
  modules,
  selectedModuleId,
  onSelectModule,
}: ModuleSystemSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* 콤팩트한 헤더 */}
      <div className="flex-shrink-0 p-4 border-b border-zinc-700/50 bg-zinc-900/60 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-emerald-400 animate-pulse rounded-full shadow-emerald-400/50 shadow-md" />
          <h2 className="text-base text-zinc-100 font-medium tracking-wide">
            시스템 개요
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-zinc-600 to-transparent" />
        </div>
      </div>

      {/* 스크롤 가능한 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-emerald-500/50">
        {/* 에너지 관리 카드 */}
        <EnergyManagementCard energy={energy} />

        {/* 자원 상태 카드 */}
        <ResourceStatusCard resources={resources} />

        {/* 모듈 목록 카드 */}
        <ModuleListCard
          modules={modules}
          selectedModuleId={selectedModuleId}
          onSelectModule={onSelectModule}
        />
      </div>
    </div>
  );
} 