"use client";
import React from "react";
import type { InstalledModule } from "../../lib/features/shipSystemsSlice";
import { getModuleById, ModuleCategory } from "../../data/shipModules";
import ModuleListItem from "./ModuleListItem";

interface ModuleListCardProps {
  modules: { [moduleId: string]: InstalledModule };
  selectedModuleId: string | null;
  onSelectModule: (id: string) => void;
}

export default function ModuleListCard({
  modules,
  selectedModuleId,
  onSelectModule,
}: ModuleListCardProps) {
  const moduleArray = Object.values(modules);

  return (
    <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-lg backdrop-blur-sm relative overflow-hidden">
      {/* 네온 그리드 패턴 */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />
      </div>

      {/* 콤팩트한 헤더 */}
      <div className="p-3 border-b border-zinc-700/50 bg-zinc-800/60 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-400 animate-pulse rounded-full shadow-purple-400/50 shadow-sm" />
          <div className="flex-1">
            <h3 className="text-sm text-zinc-100 font-medium tracking-wide">
              모듈 배열
            </h3>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              MODULE ARRAY
            </p>
          </div>
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2 py-1">
            <span className="text-xs text-emerald-300 font-mono font-medium">
              {moduleArray.length}개
            </span>
          </div>
        </div>
      </div>

      {/* 모듈 목록 */}
      <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-emerald-500/50 relative z-10">
        {moduleArray.length === 0 ? (
          <div className="flex items-center justify-center h-24 p-4">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-zinc-700/50 rounded-lg mx-auto flex items-center justify-center">
                <div className="w-4 h-4 bg-zinc-500/50 rounded-full animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="text-sm text-zinc-400 font-medium">
                  설치된 모듈 없음
                </div>
                <div className="text-xs text-zinc-500">
                  모듈을 설치하여 시작하세요
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-zinc-700/30">
            {moduleArray.map((module) => (
              <ModuleListItem
                key={module.id}
                module={module}
                isSelected={module.id === selectedModuleId}
                onSelect={() => onSelectModule(module.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 