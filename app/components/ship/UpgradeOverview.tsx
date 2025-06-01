"use client";
import React from "react";
import { useAppSelector } from "../../lib/hooks";
import { getModuleById, getNextTierModule, ModuleCategory } from "../../data/shipModules";

export default function UpgradeOverview() {
  const installedModules = useAppSelector(s => s.shipSystems.installedModules);
  const resources = useAppSelector(s => s.shipSystems.resources.inventory);

  // 업그레이드 가능한 모듈들 찾기
  const upgradeableModules = Object.entries(installedModules)
    .map(([moduleId, module]) => {
      const info = getModuleById(moduleId);
      const nextInfo = getNextTierModule(moduleId);
      if (!info || !nextInfo) return null;

      const canUpgrade = Object.entries(nextInfo.requiredResources).every(
        ([resource, required]) => (resources[resource] || 0) >= required
      );

      const missingResources = Object.entries(nextInfo.requiredResources)
        .filter(([resource, required]) => (resources[resource] || 0) < required)
        .map(([resource, required]) => ({
          resource,
          required,
          available: resources[resource] || 0,
          missing: required - (resources[resource] || 0)
        }));

      return {
        moduleId,
        module,
        info,
        nextInfo,
        canUpgrade,
        missingResources,
        priority: calculateUpgradePriority(module, info, nextInfo)
      };
    })
    .filter(item => item !== null)
    .sort((a, b) => b!.priority - a!.priority);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-700/50 pb-4">
        <h2 className="text-xl font-mono text-gray-100 tracking-wide flex items-center space-x-3">
          <div className="w-2 h-2 bg-purple-400 animate-pulse rounded-full" />
          <span>모듈 업그레이드 개요</span>
        </h2>
        <p className="text-sm font-mono text-gray-400 mt-2">
          사용 가능한 업그레이드와 필요한 자원을 확인하세요
        </p>
      </div>

      {/* Upgrade Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/40 p-4 rounded border border-gray-700/30">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-400">✓</span>
            <span className="text-sm font-mono text-gray-200 uppercase tracking-wider">Ready to Upgrade</span>
          </div>
          <div className="text-2xl font-mono text-green-300">
            {upgradeableModules.filter(item => item?.canUpgrade).length}
          </div>
        </div>
        
        <div className="bg-gray-800/40 p-4 rounded border border-gray-700/30">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-400">⏳</span>
            <span className="text-sm font-mono text-gray-200 uppercase tracking-wider">Requires Resources</span>
          </div>
          <div className="text-2xl font-mono text-yellow-300">
            {upgradeableModules.filter(item => item && !item.canUpgrade).length}
          </div>
        </div>
        
        <div className="bg-gray-800/40 p-4 rounded border border-gray-700/30">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-gray-400">📊</span>
            <span className="text-sm font-mono text-gray-200 uppercase tracking-wider">Total Modules</span>
          </div>
          <div className="text-2xl font-mono text-gray-300">
            {upgradeableModules.length}
          </div>
        </div>
      </div>

      {/* Upgrade List */}
      <div className="space-y-4">
        <h3 className="text-lg font-mono text-gray-200 tracking-wide">
          추천 업그레이드 순서
        </h3>
        
        {upgradeableModules.length === 0 ? (
          <div className="bg-gray-800/40 p-6 rounded border border-gray-700/30 text-center">
            <div className="text-gray-400 font-mono">업그레이드 가능한 모듈이 없습니다</div>
          </div>
        ) : (
          upgradeableModules.map((item, index) => {
            if (!item) return null;
            
            const { moduleId, module, info, nextInfo, canUpgrade, missingResources, priority } = item;
            
            return (
              <div 
                key={moduleId}
                className={`bg-gray-800/40 p-4 rounded border transition-all duration-300 ${
                  canUpgrade 
                    ? 'border-green-500/30 hover:border-green-500/50' 
                    : 'border-gray-700/30 hover:border-gray-600/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getCategoryIcon(info.category)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono text-gray-300">{info.nameKo}</span>
                        <span className="text-xs px-2 py-1 bg-gray-700/50 rounded font-mono text-gray-400">
                          T{info.tier}
                        </span>
                        <span className="text-gray-500">→</span>
                        <span className="text-sm font-mono text-purple-300">{nextInfo.nameKo}</span>
                        <span className="text-xs px-2 py-1 bg-purple-600/30 rounded font-mono text-purple-200">
                          T{nextInfo.tier}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-gray-500 mt-1">
                        Priority: {getPriorityLabel(priority)}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`text-xs px-3 py-1 rounded font-mono uppercase tracking-wider ${
                    canUpgrade 
                      ? 'bg-green-600/30 text-green-300 border border-green-500/30'
                      : 'bg-red-600/30 text-red-300 border border-red-500/30'
                  }`}>
                    {canUpgrade ? 'Ready' : 'Blocked'}
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Resources */}
                  <div>
                    <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                      Required Resources
                    </div>
                    <div className="space-y-1">
                      {Object.entries(nextInfo.requiredResources).map(([resource, required]) => {
                        const available = resources[resource] || 0;
                        const hasEnough = available >= required;
                        return (
                          <div key={resource} className="flex justify-between text-xs font-mono">
                            <span className="text-gray-300">{resource}</span>
                            <span className={hasEnough ? 'text-green-400' : 'text-red-400'}>
                              {available}/{required}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                      Upgrade Benefits
                    </div>
                    <div className="text-xs font-mono text-green-300">
                      {nextInfo.upgradeEffects || '성능 향상'}
                    </div>
                    {nextInfo.upgradeCost && (
                      <div className="text-xs font-mono text-cyan-300 mt-1">
                        Cost: {nextInfo.upgradeCost} RP
                      </div>
                    )}
                  </div>
                </div>

                {/* Missing Resources Warning */}
                {!canUpgrade && missingResources.length > 0 && (
                  <div className="mt-3 p-3 bg-red-900/20 rounded border border-red-700/30">
                    <div className="text-xs font-mono text-red-300 mb-1">부족한 자원:</div>
                    <div className="flex flex-wrap gap-2">
                      {missingResources.map(({ resource, missing }) => (
                        <span key={resource} className="text-xs px-2 py-1 bg-red-700/30 rounded font-mono text-red-200">
                          {resource}: -{missing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// 업그레이드 우선순위 계산
function calculateUpgradePriority(module: any, info: any, nextInfo: any): number {
  let priority = 0;
  
  // 낮은 티어일수록 우선순위 높음
  priority += (3 - info.tier) * 20;
  
  // 내구도가 낮을수록 우선순위 높음
  const durabilityPercent = (module.currentDurability / info.durability) * 100;
  priority += (100 - durabilityPercent) * 0.5;
  
  // 카테고리별 가중치
  switch (info.category) {
    case ModuleCategory.POWER:
      priority += 30; // 전력 시스템은 항상 중요
      break;
    case ModuleCategory.DEFENSE:
      priority += 25;
      break;
    case ModuleCategory.NAVIGATION:
      priority += 20;
      break;
    default:
      priority += 10;
  }
  
  return Math.round(priority);
}

// 우선순위 라벨
function getPriorityLabel(priority: number): string {
  if (priority >= 80) return "매우 높음";
  if (priority >= 60) return "높음";
  if (priority >= 40) return "보통";
  if (priority >= 20) return "낮음";
  return "매우 낮음";
} 