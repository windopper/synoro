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

interface ModuleDetailsProps {
  moduleId: string;
}

export default function ModuleDetails({ moduleId }: ModuleDetailsProps) {
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
    <div className="relative border border-gray-700/40 bg-gray-900/40 p-4 rounded hover:border-gray-600/60 hover:bg-gray-800/30 transition-all duration-300">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(156, 163, 175, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(156, 163, 175, 0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative space-y-4">
        {/* Header section */}
        <div className="relative border-b border-gray-700/50 pb-3">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gray-400 animate-pulse rounded-full" />
              <span className="text-2xl">{icon}</span>
              <div>
                <h3 className="text-lg font-mono text-gray-100 tracking-wide">
                  {info.nameKo}
                </h3>
                <div className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                  MODULE_ID: {moduleId.slice(0, 12)}
                </div>
              </div>
            </div>
            <button
              onClick={handleToggle}
              className={`group relative px-4 py-2 text-xs font-mono uppercase tracking-wider rounded transition-all duration-300 ${
                module.isActive
                  ? "bg-green-600/80 text-green-100 hover:bg-green-500/80 border border-green-500/50"
                  : "bg-gray-600/80 text-gray-300 hover:bg-gray-500/80 border border-gray-500/50"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">
                {module.isActive ? "Active" : "Inactive"}
              </span>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-500 via-gray-600 to-transparent rounded-full" />
          <p className="text-gray-300 text-sm leading-relaxed pl-4 font-mono">
            {info.description}
          </p>
        </div>

        {/* Durability section */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            <span className="text-sm font-mono text-gray-200 tracking-wide uppercase">
              Durability Status
            </span>
          </div>
          <div className="flex justify-between text-sm font-mono">
            <span className="text-gray-400">Integrity</span>
            <span className="text-gray-100">
              {module.currentDurability}/{info.durability}
            </span>
          </div>
          <div className="w-full h-3 bg-gray-700/60 rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                durabilityPercent > 75
                  ? "bg-green-500"
                  : durabilityPercent > 50
                  ? "bg-yellow-400"
                  : durabilityPercent > 25
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${durabilityPercent}%` }}
            />
          </div>
          <div className="text-xs font-mono text-gray-500">
            {durabilityPercent.toFixed(1)}% Operational
          </div>
        </div>

        {/* Energy allocation section */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-sm font-mono text-gray-200 tracking-wide uppercase">
              Energy Allocation
            </span>
          </div>
          <div className="flex justify-between text-sm font-mono">
            {needEnergyAllocation ? (
              <span className="flex items-center space-x-2">
                <span className="text-gray-400">Power Distribution</span>
                <span className="text-gray-300">
                  {info.energyConsumption.base} / {info.energyConsumption.max}
                </span>
              </span>
            ) : (
              <>
                <span className="text-gray-400">Power Distribution</span>
                <span className="text-gray-300">
                  {info.energyConsumption.base}&nbsp;MW
                </span>
              </>
            )}
            {needEnergyAllocation && (
              <span className="text-blue-300">{module.energyAllocation}%</span>
            )}
          </div>
          {needEnergyAllocation && (
            <div className="relative">
              <input
                type="range"
                min={0}
                max={100}
                value={module.energyAllocation}
                onChange={(e) => handleAllocChange(Number(e.target.value))}
                className="w-full h-3 bg-gray-700/60 rounded-lg appearance-none cursor-pointer slider"
                disabled={!module.isActive || !needEnergyAllocation}
              />
              <div
                className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600/20 via-blue-500/40 to-blue-400/20 rounded-lg pointer-events-none"
                style={{ width: `${module.energyAllocation}%` }}
              />
            </div>
          )}
        </div>

        {/* Upgrade Requirements section - 새로 추가 */}
        {nextInfo && (
          <div className="space-y-3 border-t border-gray-700/50 pt-4">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-sm font-mono text-gray-200 tracking-wide uppercase">
                Upgrade Requirements
              </span>
            </div>
            <div className="bg-gray-800/40 p-3 rounded border border-gray-700/30">
              <div className="text-sm font-mono text-gray-300 mb-2">
                Upgrade to:{" "}
                <span className="text-purple-300">{nextInfo.nameKo}</span>
              </div>

              {/* Research Requirements */}
              {nextInfo.requiredResearch && (
                <div className="mb-3">
                  <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                    Required Research
                  </div>
                  <div className="text-sm font-mono text-yellow-300">
                    {nextInfo.requiredResearch}
                  </div>
                </div>
              )}

              {/* Resource Requirements */}
              <div className="mb-3">
                <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                  Required Resources
                </div>
                <div className="space-y-1">
                  {Object.entries(nextInfo.requiredResources).map(
                    ([resource, required]) => {
                      const available = resources[resource] || 0;
                      const hasEnough = available >= required;
                      return (
                        <div
                          key={resource}
                          className="flex justify-between items-center text-sm font-mono"
                        >
                          <span className="text-gray-300">{resource}</span>
                          <span
                            className={`${
                              hasEnough ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {available}/{required}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* RP Cost */}
              {nextInfo.upgradeCost && (
                <div className="mb-3">
                  <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                    RP Cost
                  </div>
                  <div className="text-sm font-mono text-cyan-300">
                    {nextInfo.upgradeCost} RP
                  </div>
                </div>
              )}

              {/* Upgrade Effects */}
              {nextInfo.upgradeEffects && (
                <div>
                  <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                    Upgrade Effects
                  </div>
                  <div className="text-sm font-mono text-green-300">
                    {nextInfo.upgradeEffects}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            onClick={handleRepair}
            disabled={module.currentDurability >= info.durability}
            className="group relative flex-1 px-4 py-2 bg-blue-600/80 text-blue-100 text-sm font-mono uppercase tracking-wider rounded transition-all duration-300 hover:bg-blue-500/80 disabled:bg-gray-600/50 disabled:text-gray-400 border border-blue-500/50 disabled:border-gray-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
            <span className="relative">Repair Module</span>
          </button>
          {nextInfo && (
            <button
              onClick={handleUpgrade}
              disabled={!canUpgrade}
              className={`group relative flex-1 px-4 py-2 text-sm font-mono uppercase tracking-wider rounded transition-all duration-300 border ${
                canUpgrade
                  ? "bg-purple-600/80 text-purple-100 hover:bg-purple-500/80 border-purple-500/50"
                  : "bg-gray-600/50 text-gray-400 border-gray-500/30 cursor-not-allowed"
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 rounded ${
                  canUpgrade ? "group-hover:opacity-100" : ""
                }`}
              />
              <span className="relative">
                {canUpgrade
                  ? `Upgrade to ${nextInfo.nameKo}`
                  : "Insufficient Resources"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}