"use client";
import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { 
  ModuleCategory, 
  POWER_MODULES, 
  NAVIGATION_MODULES, 
  EXPLORATION_MODULES, 
  COMMUNICATION_MODULES, 
  DEFENSE_MODULES, 
  RESOURCE_MODULES,
  CompleteModuleInfo 
} from "../../data/shipModules";
import { installModule } from "../../lib/features/shipSystemsSlice";
import { getUnlocksByResearch } from "../../data/researchTechs";

export default function ModuleCreator() {
  const dispatch = useAppDispatch();
  const resources = useAppSelector(s => s.shipSystems.resources.inventory);
  const installedModules = useAppSelector(s => s.shipSystems.installedModules);
  const completedResearch = useAppSelector(s => s.shipSystems.completedResearch);
  
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory | null>(null);
  const [selectedModule, setSelectedModule] = useState<CompleteModuleInfo | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // 모든 모듈을 카테고리별로 그룹화
  const allModules = [
    ...POWER_MODULES,
    ...NAVIGATION_MODULES,
    ...EXPLORATION_MODULES,
    ...COMMUNICATION_MODULES,
    ...DEFENSE_MODULES,
    ...RESOURCE_MODULES
  ];

  const modulesByCategory = {
    [ModuleCategory.POWER]: POWER_MODULES,
    [ModuleCategory.NAVIGATION]: NAVIGATION_MODULES,
    [ModuleCategory.EXPLORATION]: EXPLORATION_MODULES,
    [ModuleCategory.COMMUNICATION]: COMMUNICATION_MODULES,
    [ModuleCategory.DEFENSE]: DEFENSE_MODULES,
    [ModuleCategory.RESOURCE]: RESOURCE_MODULES
  };

  // 설치 가능한 모듈들 (이미 설치되지 않은 모듈들)
  const availableModules = allModules.filter(module => 
    !installedModules[module.id]
  );

  const getCategoryIcon = (category: ModuleCategory) => {
    switch (category) {
      case ModuleCategory.POWER: return "⚡";
      case ModuleCategory.NAVIGATION: return "🚀";
      case ModuleCategory.EXPLORATION: return "🔭";
      case ModuleCategory.COMMUNICATION: return "📡";
      case ModuleCategory.DEFENSE: return "🛡️";
      case ModuleCategory.RESOURCE: return "📦";
      default: return "❓";
    }
  };

  const getCategoryName = (category: ModuleCategory) => {
    switch (category) {
      case ModuleCategory.POWER: return "동력 시스템";
      case ModuleCategory.NAVIGATION: return "항행 시스템";
      case ModuleCategory.EXPLORATION: return "탐사 시스템";
      case ModuleCategory.COMMUNICATION: return "통신 시스템";
      case ModuleCategory.DEFENSE: return "방어 시스템";
      case ModuleCategory.RESOURCE: return "자원 관리";
      default: return "기타";
    }
  };

  const getTierName = (tier: number) => {
    switch (tier) {
      case 0: return "기본형";
      case 1: return "개선형";
      case 2: return "고급형";
      case 3: return "최고급형";
      default: return `티어 ${tier}`;
    }
  };

  const canCreateModule = (module: CompleteModuleInfo) => {
    // 자원 요구량 확인
    const hasResources = Object.entries(module.requiredResources).every(
      ([resource, required]) => (resources[resource] || 0) >= required
    );

    // 연구 요구사항 확인
    const hasResearch = !module.requiredResearch || completedResearch.includes(module.requiredResearch);

    // 모듈이 연구로 해금되는지 확인
    const unlockedItems = getUnlocksByResearch(completedResearch);
    const isUnlocked = !module.requiredResearch || unlockedItems.includes(module.id);

    return hasResources && hasResearch && isUnlocked;
  };

  const getMissingResources = (module: CompleteModuleInfo) => {
    return Object.entries(module.requiredResources)
      .filter(([resource, required]) => (resources[resource] || 0) < required)
      .map(([resource, required]) => ({
        resource,
        required,
        available: resources[resource] || 0,
        missing: required - (resources[resource] || 0)
      }));
  };

  const handleCreateModule = async (module: CompleteModuleInfo) => {
    if (!canCreateModule(module)) {
      alert("모듈 생성에 필요한 조건이 충족되지 않았습니다.");
      return;
    }

    try {
      await dispatch(installModule({ moduleId: module.id })).unwrap();
      setSelectedModule(null);
      setShowDetails(false);
      alert(`${module.nameKo} 모듈이 성공적으로 생성되었습니다!`);
    } catch (error) {
      alert(`모듈 생성에 실패했습니다: ${error}`);
    }
  };

  const filteredModules = selectedCategory 
    ? availableModules.filter(module => module.category === selectedCategory)
    : availableModules;

  return (
    <div className="p-6 text-white h-full">
      <div className="max-w-full">
        <h1 className="text-2xl font-bold mb-4 text-blue-400">
          🔧 모듈 생성 센터
        </h1>
        
        <div className="mb-4">
          <p className="text-gray-300 text-sm">
            새로운 모듈을 직접 생성하여 함선의 성능을 향상시키세요.
          </p>
        </div>

        {/* 카테고리 선택 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">카테고리 선택</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
                              className={`p-3 rounded-lg border transition-all ${
                  selectedCategory === null
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                }`}
                          >
                <div className="text-xl mb-1">🌟</div>
                <div className="text-xs font-medium">전체</div>
              </button>
            {Object.values(ModuleCategory).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                                  className={`p-3 rounded-lg border transition-all ${
                    selectedCategory === category
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <div className="text-xl mb-1">{getCategoryIcon(category)}</div>
                  <div className="text-xs font-medium">{getCategoryName(category)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 모듈 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredModules.map(module => {
            const canCreate = canCreateModule(module);
            const missingResources = getMissingResources(module);

            return (
              <div 
                key={module.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  canCreate
                    ? "bg-gray-800 border-green-500 hover:bg-gray-700"
                    : "bg-gray-900 border-red-500 opacity-75"
                }`}
                onClick={() => {
                  setSelectedModule(module);
                  setShowDetails(true);
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getCategoryIcon(module.category)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      module.tier === 0 ? "bg-gray-600" :
                      module.tier === 1 ? "bg-blue-600" :
                      module.tier === 2 ? "bg-purple-600" : "bg-gold-600"
                    }`}>
                      {getTierName(module.tier)}
                    </span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    canCreate ? "bg-green-500" : "bg-red-500"
                  }`} />
                </div>

                <h3 className="font-semibold text-lg mb-2">{module.nameKo}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {module.description}
                </p>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-400">에너지 소모:</span>
                    <span className="ml-2 text-yellow-400">
                      {module.energyConsumption.base} - {module.energyConsumption.max} PU
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-400">내구도:</span>
                    <span className="ml-2 text-green-400">{module.durability}</span>
                  </div>

                  {/* 필요 자원 */}
                  <div className="text-sm">
                    <span className="text-gray-400">필요 자원:</span>
                    <div className="mt-1 space-y-1">
                      {Object.entries(module.requiredResources).map(([resource, required]) => {
                        const available = resources[resource] || 0;
                        const sufficient = available >= required;
                        
                        return (
                          <div key={resource} className={`flex justify-between ${
                            sufficient ? "text-green-400" : "text-red-400"
                          }`}>
                            <span>{resource}</span>
                            <span>{available}/{required}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {!canCreate && (
                    <div className="text-red-400 text-sm mt-2">
                      {missingResources.length > 0 && (
                        <div>자원 부족: {missingResources.map(r => r.resource).join(', ')}</div>
                      )}
                      {module.requiredResearch && (
                        <div>필요 연구: {module.requiredResearch}</div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateModule(module);
                  }}
                  disabled={!canCreate}
                  className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-all ${
                    canCreate
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {canCreate ? "모듈 생성" : "생성 불가"}
                </button>
              </div>
            );
          })}
        </div>

        {filteredModules.length === 0 && (
          <div className="col-span-full text-center py-8">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold mb-2">생성 가능한 모듈이 없습니다</h3>
            <p className="text-gray-400">
              {selectedCategory 
                ? `${getCategoryName(selectedCategory)} 카테고리에서 생성 가능한 모듈이 없거나 모든 모듈이 이미 설치되어 있습니다.`
                : "모든 모듈이 이미 설치되어 있습니다."
              }
            </p>
          </div>
        )}

        {/* 모듈 상세 정보 모달 */}
        {showDetails && selectedModule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg border border-gray-600 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedModule.nameKo}</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">기본 정보</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">영문명:</span>
                        <span className="ml-2">{selectedModule.nameEn}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">티어:</span>
                        <span className="ml-2">{getTierName(selectedModule.tier)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">카테고리:</span>
                        <span className="ml-2">{getCategoryName(selectedModule.category)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">내구도:</span>
                        <span className="ml-2">{selectedModule.durability}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">설명</h3>
                    <p className="text-gray-300">{selectedModule.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">에너지 사용량</h3>
                    <p className="text-yellow-400">
                      기본: {selectedModule.energyConsumption.base} PU, 
                      최대: {selectedModule.energyConsumption.max} PU
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">필요 자원</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedModule.requiredResources).map(([resource, required]) => {
                        const available = resources[resource] || 0;
                        const sufficient = available >= required;
                        
                        return (
                          <div key={resource} className={`flex justify-between p-2 rounded ${
                            sufficient ? "bg-green-900" : "bg-red-900"
                          }`}>
                            <span>{resource}</span>
                            <span className={sufficient ? "text-green-400" : "text-red-400"}>
                              {available}/{required}
                              {!sufficient && ` (부족: ${required - available})`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {selectedModule.requiredResearch && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">필요 연구</h3>
                      <p className="text-blue-400">{selectedModule.requiredResearch}</p>
                    </div>
                  )}

                  {selectedModule.upgradeEffects && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">업그레이드 효과</h3>
                      <p className="text-green-400">{selectedModule.upgradeEffects}</p>
                    </div>
                  )}

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={() => handleCreateModule(selectedModule)}
                      disabled={!canCreateModule(selectedModule)}
                      className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                        canCreateModule(selectedModule)
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-700 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {canCreateModule(selectedModule) ? "모듈 생성" : "생성 불가"}
                    </button>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="flex-1 py-3 px-6 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 