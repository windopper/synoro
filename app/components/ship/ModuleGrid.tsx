"use client";
import React from "react";
import ModuleCard from "./ModuleCard";
import type { InstalledModule } from "../../lib/features/shipSystemsSlice";

interface ModuleGridProps {
  modules: { [moduleId: string]: InstalledModule };
  selectedModuleId: string | null;
  onSelect: (id: string) => void;
}

export default function ModuleGrid({
  modules,
  selectedModuleId,
  onSelect,
}: ModuleGridProps) {
  const moduleArray = Object.values(modules);

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-2 h-2 bg-purple-400 animate-pulse rounded-full" />
        <h4 className="text-sm font-mono text-gray-200 tracking-wide uppercase">
          Module Array
        </h4>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent" />
        <span className="text-xs font-mono text-gray-500">
          {moduleArray.length} MODULES
        </span>
      </div>

      {/* Grid */}
      {moduleArray.length === 0 ? (
        <div className="flex items-center justify-center h-24 border border-gray-700/40 bg-gray-900/20 rounded">
          <div className="text-center">
            <div className="w-6 h-6 border border-gray-600 mx-auto mb-2 flex items-center justify-center rounded">
              <div className="w-2 h-2 bg-gray-500 animate-pulse rounded-full" />
            </div>
            <div className="text-gray-500 font-mono text-xs uppercase tracking-wider">
              No Modules Installed
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {moduleArray.map((mod) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              isSelected={mod.id === selectedModuleId}
              onSelect={() => onSelect(mod.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
