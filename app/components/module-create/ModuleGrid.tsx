import React from "react";
import { useAppSelector } from "../../lib/hooks";
import {
  ModuleCategory,
  POWER_MODULES,
  NAVIGATION_MODULES,
  EXPLORATION_MODULES,
  COMMUNICATION_MODULES,
  DEFENSE_MODULES,
  RESOURCE_MODULES,
  CompleteModuleInfo,
} from "../../data/shipModules";
import { getUnlocksByResearch } from "../../data/researchTechs";
import { ModuleCard } from "./ModuleCard";

interface ModuleGridProps {
  selectedCategory: ModuleCategory | null;
  installedModules: Record<string, any>;
  onModuleSelect: (module: CompleteModuleInfo) => void;
}

export function ModuleGrid({
  selectedCategory,
  installedModules,
  onModuleSelect,
}: ModuleGridProps) {
  const resources = useAppSelector((s) => s.shipSystems.resources.inventory);
  const completedResearch = useAppSelector(
    (s) => s.shipSystems.completedResearch
  );

  // 모든 모듈을 카테고리별로 그룹화
  const allModules = [
    ...POWER_MODULES,
    ...NAVIGATION_MODULES,
    ...EXPLORATION_MODULES,
    ...COMMUNICATION_MODULES,
    ...DEFENSE_MODULES,
    ...RESOURCE_MODULES,
  ];

  // 설치 가능한 모듈들 (이미 설치되지 않은 모듈들)
  const availableModules = allModules.filter(
    (module) => !installedModules[module.id]
  );

  const filteredModules = selectedCategory
    ? availableModules.filter((module) => module.category === selectedCategory)
    : availableModules;

  const canCreateModule = (module: CompleteModuleInfo) => {
    // 자원 요구량 확인
    const hasResources = Object.entries(module.requiredResources).every(
      ([resource, required]) => (resources[resource] || 0) >= required
    );

    // 연구 요구사항 확인
    const hasResearch =
      !module.requiredResearch ||
      completedResearch.includes(module.requiredResearch);

    // 모듈이 연구로 해금되는지 확인
    const unlockedItems = getUnlocksByResearch(completedResearch);
    const isUnlocked =
      !module.requiredResearch || unlockedItems.includes(module.id);

    return hasResources && hasResearch && isUnlocked;
  };

  if (filteredModules.length === 0) {
    return null; // EmptyState 컴포넌트에서 처리
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-zinc-200">
          사용 가능한 모듈 ({filteredModules.length}개)
        </h2>
        <div className="text-sm text-zinc-400">
          {filteredModules.filter(canCreateModule).length}개 생성 가능
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filteredModules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            canCreate={canCreateModule(module)}
            resources={resources}
            onSelect={() => onModuleSelect(module)}
          />
        ))}
      </div>
    </div>
  );
}
