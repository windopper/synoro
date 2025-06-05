"use client";
import React from "react";
import type { InstalledModule } from "../../lib/features/shipSystemsSlice";
import { getModuleById, ModuleCategory } from "../../data/shipModules";

interface ModuleListItemProps {
  module: InstalledModule;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ModuleListItem({
  module,
  isSelected,
  onSelect,
}: ModuleListItemProps) {
  const info = getModuleById(module.id);
  
  if (!info) return null;

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

  const durabilityPercent = (module.currentDurability / info.durability) * 100;
  const statusColor = module.isActive ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-zinc-500';

  return (
    <button
      onClick={onSelect}
      className={`w-full p-3 text-left transition-all duration-200 relative group ${
        isSelected 
          ? 'bg-emerald-500/10 border-r-2 border-emerald-400' 
          : 'hover:bg-zinc-800/60'
      }`}
    >
      {/* 선택된 상태의 네온 효과 */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-emerald-400/10 to-transparent pointer-events-none" />
      )}
      
      <div className="flex items-center space-x-3 relative z-10">
        {/* 모듈 아이콘 */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all duration-200 ${
          isSelected 
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
            : 'bg-zinc-700/60 text-zinc-400 group-hover:bg-zinc-600/60 group-hover:text-zinc-300'
        }`}>
          {icon}
        </div>

        {/* 모듈 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`text-sm font-medium truncate font-mono ${
              isSelected ? 'text-emerald-200' : 'text-zinc-200'
            }`}>
              {info.nameKo}
            </h4>
            <div className="flex items-center space-x-2">
              {/* 상태 인디케이터 */}
              <div className={`w-1.5 h-1.5 rounded-full ${statusColor} shadow-sm`} />
              {/* 활성/비활성 배지 */}
              <div className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                module.isActive 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-zinc-700/60 text-zinc-400'
              }`}>
                {module.isActive ? '활성' : '비활성'}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {/* 모듈 ID */}
            <p className={`text-xs truncate font-mono ${
              isSelected ? 'text-emerald-300/70' : 'text-zinc-500'
            }`}>
              ID: {module.id.slice(0, 12)}...
            </p>

            {/* 내구성 바 */}
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-1 bg-zinc-700/60 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    durabilityPercent > 75 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                    durabilityPercent > 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                    durabilityPercent > 25 ? 'bg-gradient-to-r from-orange-500 to-orange-400' : 'bg-gradient-to-r from-red-500 to-red-400'
                  }`}
                  style={{ width: `${durabilityPercent}%` }}
                />
              </div>
              <span className={`text-xs font-mono font-medium ${
                isSelected ? 'text-emerald-300/70' : 'text-zinc-500'
              }`}>
                {durabilityPercent.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
} 