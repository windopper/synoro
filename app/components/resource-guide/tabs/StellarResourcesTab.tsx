import React from "react";
import { RESOURCE_DATABASE } from "../../../data/resourceTypes";
import { getRarityColor, getRarityLabel } from "../utils";

export function StellarResourcesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-mono text-zinc-200 tracking-wide">
            항성 자원 도감
          </h3>
          <p className="text-sm font-mono text-zinc-400 mt-1">
            항성에서 채굴할 수 있는 특수 자원들입니다.
          </p>
        </div>
        <div className="text-sm font-mono text-zinc-400">
          총 {Object.keys(RESOURCE_DATABASE).length}개 자원
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Object.values(RESOURCE_DATABASE).map((resource) => (
          <div
            key={resource.id}
            className="bg-zinc-900/60 backdrop-blur-sm p-5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform-gpu"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-mono text-zinc-100 mb-1">
                  {resource.nameKo}
                </h4>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                  {resource.nameEn}
                </p>
              </div>
              <div
                className={`text-xs px-2 py-1 rounded font-mono border ${getRarityColor(
                  resource.rarity
                )}`}
              >
                {getRarityLabel(resource.rarity)}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm font-mono text-zinc-300 mb-4 leading-relaxed">
              {resource.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-zinc-800/50 p-3 rounded border border-zinc-700/50">
                <div className="text-xs font-mono text-zinc-400 mb-1">
                  기본 가치
                </div>
                <div className="text-sm font-mono text-yellow-400 font-bold">
                  {resource.baseValue.toLocaleString()}
                </div>
              </div>
              <div className="bg-zinc-800/50 p-3 rounded border border-zinc-700/50">
                <div className="text-xs font-mono text-zinc-400 mb-1">
                  기본 확률
                </div>
                <div className="text-sm font-mono text-emerald-400 font-bold">
                  {resource.baseProbability}%
                </div>
              </div>
              <div className="bg-zinc-800/50 p-3 rounded border border-zinc-700/50 col-span-2">
                <div className="text-xs font-mono text-zinc-400 mb-1">
                  최대 채취량
                </div>
                <div className="text-sm font-mono text-blue-400 font-bold">
                  {resource.maxYieldPerHour.toLocaleString()}/시간
                </div>
              </div>
            </div>

            {/* Stellar Conditions */}
            <div className="border-t border-zinc-700/50 pt-4">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3 flex items-center">
                <span className="w-1 h-1 bg-cyan-400 rounded-full mr-2"></span>
                생성 조건
              </div>

              {/* Spectral Classes */}
              <div className="mb-3">
                <div className="text-xs font-mono text-cyan-400 mb-2">
                  분광형
                </div>
                <div className="flex flex-wrap gap-1">
                  {resource.stellarConditions.spectralClasses.map((sc) => (
                    <span
                      key={sc}
                      className="text-xs px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded font-mono text-cyan-300"
                    >
                      {sc}형성
                    </span>
                  ))}
                </div>
              </div>

              {/* Temperature Range */}
              <div>
                <div className="text-xs font-mono text-orange-400 mb-1">
                  온도 범위
                </div>
                <div className="text-xs font-mono text-zinc-400 bg-zinc-800/30 px-2 py-1 rounded">
                  {resource.stellarConditions.temperatureRange[0].toLocaleString()}
                  K -{" "}
                  {resource.stellarConditions.temperatureRange[1].toLocaleString()}
                  K
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
