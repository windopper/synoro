"use client";
import React from "react";
import type { EnergyManagement as EnergyState } from "../../lib/features/shipSystemsSlice";

interface EnergyManagementCardProps {
  energy: EnergyState;
}

export default function EnergyManagementCard({ energy }: EnergyManagementCardProps) {
  const efficiency = energy.distributionEfficiency;
  const storagePercent = (energy.currentStored / energy.totalStorage) * 100;

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
        <div className="w-2 h-2 bg-cyan-400 animate-pulse rounded-full shadow-cyan-400/50 shadow-sm" />
        <div className="flex-1">
          <h3 className="text-sm text-zinc-100 font-medium tracking-wide">
            에너지 관리
          </h3>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">
            ENERGY MANAGEMENT
          </p>
        </div>
      </div>

      {/* 에너지 지표들 - 콤팩트 */}
      <div className="space-y-3 relative z-10">
        {/* 생성량 */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-400 font-mono">생성량</span>
            <span className="text-sm text-emerald-400 font-mono font-medium">
              {energy.totalGeneration} MW
            </span>
          </div>
          <div className="h-1 bg-zinc-700/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
          </div>
        </div>

        {/* 소비량 */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-400 font-mono">소비량</span>
            <span className="text-sm text-orange-400 font-mono font-medium">
              {energy.totalConsumption} MW
            </span>
          </div>
          <div className="h-1 bg-zinc-700/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (energy.totalConsumption / energy.totalGeneration) * 100)}%` }}
            />
          </div>
        </div>

        {/* 저장량 */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-400 font-mono">저장량</span>
            <span className="text-sm text-cyan-300 font-mono font-medium">
              {energy.currentStored}/{energy.totalStorage}
            </span>
          </div>
          <div className="h-1.5 bg-zinc-700/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${storagePercent}%` }}
            />
          </div>
          <div className="text-xs text-zinc-500 font-mono">
            {storagePercent.toFixed(1)}% 사용 중
          </div>
        </div>

        {/* 효율성 인디케이터 */}
        <div className="pt-2 border-t border-zinc-700/30">
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-400 font-mono">효율성</span>
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                efficiency >= 0 ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-red-400 shadow-red-400/50'
              } shadow-sm`} />
              <span className={`text-sm font-mono font-medium ${
                efficiency >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {efficiency > 0 ? '+' : ''}{efficiency.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 