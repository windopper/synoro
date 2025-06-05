"use client";
import React from "react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import {
  toggleModuleActive,
  updateModuleEnergyAllocation,
  repairModule,
  startModuleUpgrade
} from "../../lib/features/shipSystemsSlice";
import { getModuleById, getNextTierModule, ModuleCategory } from "../../data/shipModules";

interface ModuleDetailsViewProps {
  moduleId: string;
}

export default function ModuleDetailsView({ moduleId }: ModuleDetailsViewProps) {
  const dispatch = useAppDispatch();
  const module = useAppSelector(s => s.shipSystems.installedModules[moduleId]);
  const resources = useAppSelector(s => s.shipSystems.resources.inventory);
  const info = getModuleById(moduleId);
  const nextInfo = getNextTierModule(moduleId);

  if (!module || !info) return null;

  const icon = (() => {
    switch (info.category) {
      case ModuleCategory.POWER: return "⚡";
      case ModuleCategory.NAVIGATION: return "🚀";
      case ModuleCategory.EXPLORATION: return "🔭";
      case ModuleCategory.COMMUNICATION: return "📡";
      case ModuleCategory.DEFENSE: return "🛡️";
      case ModuleCategory.RESOURCE: return "📦";
      default: return "❓";
    }
  })();

  const handleToggle = () => dispatch(toggleModuleActive(moduleId));
  const handleAllocChange = (value: number) => {
    dispatch(updateModuleEnergyAllocation({ moduleId, allocation: value }));
  };
  const handleRepair = () => dispatch(repairModule({ moduleId, repairAmount: info.durability * 0.2 }));
  const handleUpgrade = () => dispatch(startModuleUpgrade({ moduleId }));
  const needEnergyAllocation = info.energyConsumption.base !== info.energyConsumption.max;

  const durabilityPercent = (module.currentDurability / info.durability) * 100;

  // 업그레이드 필요 자원 확인
  const canUpgrade = nextInfo && Object.entries(nextInfo.requiredResources).every(
    ([resource, required]) => (resources[resource] || 0) >= required
  );

  return (
    <div className="h-full overflow-y-auto bg-zinc-950/60 backdrop-blur-sm scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-emerald-500/50">
      <div className="p-4 space-y-4">
        {/* 모던 헤더 섹션 */}
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden">
          {/* 네온 그리드 패턴 */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: "linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center text-2xl">
                {icon}
              </div>
              <div className="space-y-1">
                <h1 className="text-lg text-zinc-100 font-medium tracking-wide font-mono">
                  {info.nameKo}
                </h1>
                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                  MODULE ID: {moduleId.slice(0, 12)}...
                </p>
              </div>
            </div>
            
            {/* 토글 버튼 */}
            <button
              onClick={handleToggle}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 font-mono ${
                module.isActive
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 shadow-emerald-500/20 shadow-md"
                  : "bg-zinc-700/60 text-zinc-400 border border-zinc-600/50 hover:bg-zinc-600/60 hover:text-zinc-300"
              }`}
            >
              {module.isActive ? "활성화됨" : "비활성화됨"}
            </button>
          </div>
        </div>

        {/* 설명 카드 */}
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 backdrop-blur-sm">
          <h2 className="text-base text-zinc-100 font-medium mb-3 font-mono tracking-wide">
            모듈 설명
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {info.description}
          </p>
        </div>

        {/* 내구성 상태 카드 */}
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base text-zinc-100 font-medium font-mono tracking-wide">
              내구성 상태
            </h2>
            <span className="text-sm text-zinc-200 font-mono font-medium">
              {module.currentDurability}/{info.durability}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="h-2 bg-zinc-700/60 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  durabilityPercent > 75 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" :
                  durabilityPercent > 50 ? "bg-gradient-to-r from-yellow-500 to-yellow-400" :
                  durabilityPercent > 25 ? "bg-gradient-to-r from-orange-500 to-orange-400" : "bg-gradient-to-r from-red-500 to-red-400"
                }`}
                style={{ width: `${durabilityPercent}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-zinc-400 font-mono">
                운영 상태
              </span>
              <span className="text-xs text-zinc-300 font-mono">
                {durabilityPercent.toFixed(1)}%
              </span>
            </div>
            
            {durabilityPercent < 90 && (
              <button
                onClick={handleRepair}
                className="w-full mt-3 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 py-2 rounded-lg font-medium text-sm hover:bg-cyan-500/30 transition-all duration-200 font-mono"
              >
                수리하기
              </button>
            )}
          </div>
        </div>

        {/* 에너지 배분 카드 */}
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 backdrop-blur-sm">
          <h2 className="text-base text-zinc-100 font-medium mb-3 font-mono tracking-wide">
            에너지 배분
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400 font-mono">
                전력 소비량
              </span>
              <span className="text-sm text-zinc-200 font-mono font-medium">
                {needEnergyAllocation 
                  ? `${info.energyConsumption.base} ~ ${info.energyConsumption.max} MW`
                  : `${info.energyConsumption.base} MW`
                }
              </span>
            </div>
            
            {needEnergyAllocation && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400 font-mono">
                    현재 배분율
                  </span>
                  <span className="text-sm text-emerald-400 font-mono font-medium">
                    {module.energyAllocation}%
                  </span>
                </div>
                
                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={module.energyAllocation}
                    onChange={(e) => handleAllocChange(Number(e.target.value))}
                    disabled={!module.isActive}
                    className="w-full h-2 bg-zinc-700/60 rounded-full appearance-none cursor-pointer slider disabled:cursor-not-allowed"
                  />
                  <div
                    className="absolute top-0 left-0 h-2 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full pointer-events-none transition-all duration-200"
                    style={{ width: `${module.energyAllocation}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 업그레이드 섹션 */}
        {nextInfo && (
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 backdrop-blur-sm">
            <h2 className="text-base text-zinc-100 font-medium mb-3 font-mono tracking-wide">
              업그레이드 정보
            </h2>
            
            <div className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <div className="text-sm text-purple-300 font-medium mb-2 font-mono">
                  업그레이드 대상: {nextInfo.nameKo}
                </div>
                <p className="text-xs text-purple-200/70">
                  {nextInfo.description}
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm text-zinc-200 font-medium font-mono">
                  필요 자원
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(nextInfo.requiredResources).map(([resource, required]) => {
                    const available = resources[resource] || 0;
                    const hasEnough = available >= required;
                    
                    return (
                      <div
                        key={resource}
                        className={`p-3 rounded-lg border ${
                          hasEnough 
                            ? 'border-emerald-500/30 bg-emerald-500/10' 
                            : 'border-red-500/30 bg-red-500/10'
                        }`}
                      >
                        <div className="text-xs text-zinc-400 uppercase tracking-wide font-mono">
                          {resource}
                        </div>
                        <div className={`text-sm font-mono font-medium ${
                          hasEnough ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {available}/{required}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <button
                onClick={handleUpgrade}
                disabled={!canUpgrade}
                className={`w-full py-3 rounded-lg font-medium text-sm transition-all duration-200 font-mono ${
                  canUpgrade
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 shadow-emerald-500/20 shadow-md"
                    : "bg-zinc-700/60 text-zinc-500 border border-zinc-600/50 cursor-not-allowed"
                }`}
              >
                {canUpgrade ? "업그레이드 시작" : "자원 부족"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 