"use client";
import React from "react";
import type { InstalledModule } from "../../lib/features/shipSystemsSlice";
import { getModuleById, ModuleCategory } from "../../data/shipModules";

interface ModuleCardProps {
  module: InstalledModule;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ModuleCard({ module, isSelected, onSelect }: ModuleCardProps) {
  const info = getModuleById(module.id);
  const icon = (() => {
    switch (info?.category) {
      case ModuleCategory.POWER: return "⚡";
      case ModuleCategory.NAVIGATION: return "🚀";
      case ModuleCategory.EXPLORATION: return "🔭";
      case ModuleCategory.COMMUNICATION: return "📡";
      case ModuleCategory.DEFENSE: return "🛡️";
      case ModuleCategory.RESOURCE: return "📦";
      default: return "❓";
    }
  })();
  
  const statusColor = (() => {
    switch (module.status) {
      case "NORMAL": return "border-green-500/60";
      case "DAMAGED": return "border-yellow-400/60";
      case "DISABLED": return "border-gray-600/60";
      case "UPGRADING": return "border-blue-400/60";
      case "REPAIRING": return "border-blue-300/60";
      case "ENERGY_SHORTAGE": return "border-red-500/60";
      default: return "border-gray-700/60";
    }
  })();

  const statusIndicatorColor = (() => {
    switch (module.status) {
      case "NORMAL": return "bg-green-400";
      case "DAMAGED": return "bg-yellow-400";
      case "DISABLED": return "bg-gray-500";
      case "UPGRADING": return "bg-blue-400";
      case "REPAIRING": return "bg-blue-300";
      case "ENERGY_SHORTAGE": return "bg-red-500";
      default: return "bg-gray-600";
    }
  })();

  const durabilityPercent = (module.currentDurability / (info?.durability || 1)) * 100;

  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer border ${statusColor} bg-gray-900/40 p-3 rounded hover:border-gray-600/60 hover:bg-gray-800/30 transition-all duration-300 ${isSelected ? 'bg-gray-800/60 border-gray-500/80' : ''}`}
    >
      {/* Connection line indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-500 via-gray-600 to-transparent rounded-full ${isSelected ? 'opacity-100' : 'opacity-50'}`} />
      
      {/* Module header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-1.5 h-1.5 ${statusIndicatorColor} rounded-full ${module.status === 'NORMAL' ? 'animate-pulse' : ''}`} />
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-gray-500 rounded-full" />
          <div className="w-1 h-1 bg-gray-600 rounded-full" />
        </div>
      </div>
      
      {/* Module name */}
      <div className="mb-2">
        <div className="text-sm font-mono text-gray-100 tracking-wide truncate">
          {info?.nameKo || module.id}
        </div>
        <div className="text-xs font-mono text-gray-500 uppercase tracking-wider">
          MODULE_ID: {module.id.slice(0, 8)}
        </div>
      </div>
      
      {/* Durability bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Durability</span>
          <span className="text-xs font-mono text-gray-300">{durabilityPercent.toFixed(0)}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-700/60 rounded-sm overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${durabilityPercent > 50 ? 'bg-green-500' : durabilityPercent > 25 ? 'bg-yellow-400' : 'bg-red-500'}`}
            style={{ width: `${durabilityPercent}%` }}
          />
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "linear-gradient(rgba(156, 163, 175, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(156, 163, 175, 0.1) 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />
      </div>
    </div>
  );
}