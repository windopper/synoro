"use client";
import React from "react";
import type { ResourceManagement } from "../../lib/features/shipSystemsSlice";

interface ResourceStatusCardProps {
  resources: ResourceManagement;
}

export default function ResourceStatusCard({ resources }: ResourceStatusCardProps) {
  const { inventory, currentCapacity, maxCapacity, specialSlots } = resources;
  const utilizationPercent = Math.min(100, (currentCapacity / maxCapacity) * 100);
  const inventoryEntries = Object.entries(inventory);

  return (
    <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-lg p-3 hover:border-emerald-500/40 hover:bg-zinc-800/60 transition-all duration-300 backdrop-blur-sm relative overflow-hidden">
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
      <div className="flex items-center space-x-2 mb-3 relative z-10">
        <div className="w-2 h-2 bg-amber-400 animate-pulse rounded-full shadow-amber-400/50 shadow-sm" />
        <div className="flex-1">
          <h3 className="text-sm text-zinc-100 font-medium tracking-wide">
            자원 관리
          </h3>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">
            RESOURCE MANAGEMENT
          </p>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        {/* 저장 공간 */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-400 font-mono">저장 공간</span>
            <span className="text-sm text-zinc-100 font-mono font-medium">
              {currentCapacity}/{maxCapacity}
            </span>
          </div>
          <div className="h-1.5 bg-zinc-700/60 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                utilizationPercent < 75 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 
                utilizationPercent < 90 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${utilizationPercent}%` }}
            />
          </div>
          <div className="text-xs text-zinc-500 font-mono">
            {utilizationPercent.toFixed(1)}% 사용 중
          </div>
        </div>

        {/* 인벤토리 */}
        {inventoryEntries.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-3 bg-emerald-400 rounded-full" />
              <span className="text-xs text-zinc-300 font-medium">
                인벤토리
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {inventoryEntries.map(([resource, amount]) => (
                <div 
                  key={resource} 
                  className="bg-zinc-900/60 rounded-md p-2 border border-zinc-700/30 hover:border-emerald-500/30 transition-colors duration-200"
                >
                  <div className="space-y-1">
                    <div className="text-xs text-zinc-400 uppercase tracking-wide font-mono">
                      {resource}
                    </div>
                    <div className="text-sm text-emerald-400 font-mono font-medium">
                      {amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 특수 슬롯 */}
        {Object.entries(specialSlots).map(([slot, info]) => {
          const usedPercent = Math.min(100, (info.used / info.capacity) * 100);
          return (
            <div key={slot} className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-3 bg-cyan-400 rounded-full" />
                <span className="text-xs text-zinc-300 font-medium">
                  {slot.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400 font-mono">슬롯</span>
                <span className="text-sm text-zinc-100 font-mono">
                  {info.used}/{info.capacity}
                </span>
              </div>
              <div className="h-1 bg-zinc-700/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${usedPercent}%` }}
                />
              </div>
              <div className="text-xs text-zinc-500 font-mono">
                {usedPercent.toFixed(0)}% 점유
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 