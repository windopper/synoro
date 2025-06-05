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
} from "../../data/shipModules";

interface EmptyStateProps {
  selectedCategory: ModuleCategory | null;
}

export function EmptyState({ selectedCategory }: EmptyStateProps) {
  const installedModules = useAppSelector(
    (s) => s.shipSystems.installedModules
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

  const getCategoryName = (category: ModuleCategory) => {
    switch (category) {
      case ModuleCategory.POWER:
        return "Power System";
      case ModuleCategory.NAVIGATION:
        return "Navigation System";
      case ModuleCategory.EXPLORATION:
        return "Exploration System";
      case ModuleCategory.COMMUNICATION:
        return "Communication System";
      case ModuleCategory.DEFENSE:
        return "Defense System";
      case ModuleCategory.RESOURCE:
        return "Resource Management";
      default:
        return "Other";
    }
  };

  // 모듈이 있으면 EmptyState를 표시하지 않음
  if (filteredModules.length > 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
        <span className="text-4xl">🔍</span>
      </div>

      <h3 className="text-2xl font-bold mb-3 text-zinc-200">
        No modules available for creation
      </h3>

      <p className="text-zinc-400 text-center max-w-md leading-relaxed">
        {selectedCategory
          ? `${getCategoryName(
              selectedCategory
            )} category has no modules available or all modules are already
            installed.`
          : "All modules are already installed."}
      </p>

      {selectedCategory && (
        <div className="mt-6 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
          <p className="text-zinc-300 text-sm">
            💡 Select a different category or conduct research to unlock new
            modules.
          </p>
        </div>
      )}
    </div>
  );
}
