"use client";
import React from "react";
import { useAppSelector } from "../../lib/hooks";
import { getModuleById, getNextTierModule, ModuleCategory } from "../../data/shipModules";

export default function UpgradeOverview() {
  const installedModules = useAppSelector(s => s.shipSystems.installedModules);
  const resources = useAppSelector(s => s.shipSystems.resources.inventory);

  // Find upgradeable modules
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
    <div className="max-w-7xl mx-auto space-y-4 p-4 bg-zinc-950/95 backdrop-blur-sm">
      {/* Header */}
      <div className="border-b border-zinc-700/50 pb-3">
        <h2 className="text-lg font-mono text-zinc-100 tracking-wide flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-cyan-400 animate-pulse rounded-full" />
          <span>Module Upgrade Overview</span>
        </h2>
        <p className="text-xs font-mono text-zinc-400 mt-1">
          Review available upgrades and required resources
        </p>
      </div>

      {/* Upgrade Statistics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900/60 p-3 rounded-md border border-zinc-700/30 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-cyan-400 text-sm">✓</span>
            <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Ready</span>
          </div>
          <div className="text-xl font-mono text-cyan-300 font-bold">
            {upgradeableModules.filter(item => item?.canUpgrade).length}
          </div>
        </div>
        
        <div className="bg-zinc-900/60 p-3 rounded-md border border-zinc-700/30 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-amber-400 text-sm">⏳</span>
            <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Blocked</span>
          </div>
          <div className="text-xl font-mono text-amber-300 font-bold">
            {upgradeableModules.filter(item => item && !item.canUpgrade).length}
          </div>
        </div>
        
        <div className="bg-zinc-900/60 p-3 rounded-md border border-zinc-700/30 hover:border-purple-500/40 transition-colors">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-purple-400 text-sm">📊</span>
            <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Total</span>
          </div>
          <div className="text-xl font-mono text-purple-300 font-bold">
            {upgradeableModules.length}
          </div>
        </div>
      </div>

      {/* Upgrade List */}
      <div className="space-y-3">
        <h3 className="text-sm font-mono text-zinc-200 tracking-wide font-semibold">
          Recommended Upgrade Order
        </h3>
        
        {upgradeableModules.length === 0 ? (
          <div className="bg-zinc-900/60 p-4 rounded-md border border-zinc-700/30 text-center">
            <div className="text-zinc-400 font-mono text-sm">No upgradeable modules available</div>
          </div>
        ) : (
          upgradeableModules.map((item, index) => {
            if (!item) return null;
            
            const { moduleId, module, info, nextInfo, canUpgrade, missingResources, priority } = item;
            
            return (
              <div 
                key={moduleId}
                className={`bg-zinc-900/60 p-3 rounded-md border transition-all duration-200 ${
                  canUpgrade 
                    ? 'border-cyan-500/30 hover:border-cyan-500/60 shadow-cyan-500/10 shadow-lg' 
                    : 'border-zinc-700/30 hover:border-zinc-600/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="text-lg">{getCategoryIcon(info.category)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono text-zinc-200 font-medium">{info.nameKo}</span>
                        <span className="text-xs px-1.5 py-0.5 bg-zinc-700/50 rounded font-mono text-zinc-400">
                          T{info.tier}
                        </span>
                        <span className="text-zinc-500 text-xs">→</span>
                        <span className="text-sm font-mono text-purple-300 font-medium">{nextInfo.nameKo}</span>
                        <span className="text-xs px-1.5 py-0.5 bg-purple-600/30 rounded font-mono text-purple-200">
                          T{nextInfo.tier}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-zinc-500 mt-0.5">
                        Priority: {getPriorityLabel(priority)}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`text-xs px-2 py-1 rounded font-mono uppercase tracking-wider font-semibold ${
                    canUpgrade 
                      ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-red-600/20 text-red-300 border border-red-500/30'
                  }`}>
                    {canUpgrade ? 'Ready' : 'Blocked'}
                  </div>
                </div>

                {/* Requirements */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Resources */}
                  <div>
                    <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5 font-semibold">
                      Required Resources
                    </div>
                    <div className="space-y-1">
                      {Object.entries(nextInfo.requiredResources).map(([resource, required]) => {
                        const available = resources[resource] || 0;
                        const hasEnough = available >= required;
                        return (
                          <div key={resource} className="flex justify-between text-xs font-mono">
                            <span className="text-zinc-300">{resource}</span>
                            <span className={hasEnough ? 'text-cyan-400 font-semibold' : 'text-red-400 font-semibold'}>
                              {available}/{required}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5 font-semibold">
                      Upgrade Benefits
                    </div>
                    <div className="text-xs font-mono text-cyan-300">
                      {nextInfo.upgradeEffects || 'Performance Enhancement'}
                    </div>
                    {nextInfo.upgradeCost && (
                      <div className="text-xs font-mono text-purple-300 mt-1 font-semibold">
                        Cost: {nextInfo.upgradeCost} RP
                      </div>
                    )}
                  </div>
                </div>

                {/* Missing Resources Warning */}
                {!canUpgrade && missingResources.length > 0 && (
                  <div className="mt-3 p-2 bg-red-900/20 rounded border border-red-700/30">
                    <div className="text-xs font-mono text-red-300 mb-1 font-semibold">Missing Resources:</div>
                    <div className="flex flex-wrap gap-1">
                      {missingResources.map(({ resource, missing }) => (
                        <span key={resource} className="text-xs px-2 py-0.5 bg-red-700/30 rounded font-mono text-red-200 font-medium">
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

// Calculate upgrade priority
function calculateUpgradePriority(module: any, info: any, nextInfo: any): number {
  let priority = 0;
  
  // Lower tier gets higher priority
  priority += (3 - info.tier) * 20;
  
  // Lower durability gets higher priority
  const durabilityPercent = (module.currentDurability / info.durability) * 100;
  priority += (100 - durabilityPercent) * 0.5;
  
  // Category weights
  switch (info.category) {
    case ModuleCategory.POWER:
      priority += 30; // Power systems are always important
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

// Priority labels
function getPriorityLabel(priority: number): string {
  if (priority >= 80) return "Very High";
  if (priority >= 60) return "High";
  if (priority >= 40) return "Medium";
  if (priority >= 20) return "Low";
  return "Very Low";
} 