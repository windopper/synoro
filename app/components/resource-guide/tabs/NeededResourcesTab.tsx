import React from "react";
import { getModuleById } from "../../../data/shipModules";
import {
  getResourceInfo,
  getDifficultyColor,
  getDifficultyLabel,
} from "../utils";

interface NeededResourcesTabProps {
  requiredResources: Map<
    string,
    { total: number; available: number; modules: string[] }
  >;
  selectedResource: string | null;
  setSelectedResource: (resource: string | null) => void;
}

export function NeededResourcesTab({
  requiredResources,
  selectedResource,
  setSelectedResource,
}: NeededResourcesTabProps) {
  if (requiredResources.size === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="text-xl font-mono text-zinc-200 mb-2">
          모든 자원 준비 완료
        </h3>
        <p className="text-zinc-400 font-mono">
          업그레이드에 필요한 자원이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-mono text-zinc-200 tracking-wide">
          필요 자원 목록
        </h3>
        <div className="text-sm font-mono text-zinc-400">
          총 {requiredResources.size}개 자원
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from(requiredResources.entries()).map(([resource, data]) => {
          const resourceInfo = getResourceInfo(resource);
          const isDeficient = data.available < data.total;
          const progressPercent = Math.min(
            (data.available / data.total) * 100,
            100
          );

          return (
            <div
              key={resource}
              className={`
                bg-zinc-900/60 backdrop-blur-sm p-5 rounded-lg border transition-all duration-300 cursor-pointer
                hover:shadow-lg hover:scale-[1.02] transform-gpu
                ${
                  selectedResource === resource
                    ? "border-cyan-500/50 bg-cyan-900/20 shadow-lg shadow-cyan-500/10"
                    : isDeficient
                    ? "border-red-500/30 hover:border-red-500/50"
                    : "border-emerald-500/30 hover:border-emerald-500/50"
                }
              `}
              onClick={() =>
                setSelectedResource(
                  selectedResource === resource ? null : resource
                )
              }
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-mono text-zinc-100 mb-2">
                    {resource}
                  </h4>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-sm font-mono font-bold ${
                        isDeficient ? "text-red-400" : "text-emerald-400"
                      }`}
                    >
                      {data.available.toLocaleString()}/
                      {data.total.toLocaleString()}
                    </span>
                    {resourceInfo && (
                      <span
                        className={`text-xs px-2 py-1 rounded font-mono border ${getDifficultyColor(
                          resourceInfo.difficulty
                        )} bg-zinc-800/50`}
                      >
                        {getDifficultyLabel(resourceInfo.difficulty)}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={`text-xs px-3 py-1.5 rounded-full font-mono uppercase tracking-wider font-semibold border ${
                    isDeficient
                      ? "bg-red-500/10 text-red-400 border-red-500/30"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  }`}
                >
                  {isDeficient ? "Need" : "Ready"}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span>진행률</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 rounded-full ${
                      isDeficient
                        ? "bg-gradient-to-r from-red-500 to-red-400 shadow-red-500/20"
                        : "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-emerald-500/20"
                    } shadow-lg`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Quick Module Info */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {data.modules.slice(0, 2).map((moduleId) => {
                    const moduleInfo = getModuleById(moduleId);
                    return (
                      <span
                        key={moduleId}
                        className="text-xs px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded font-mono text-purple-300"
                      >
                        {moduleInfo?.nameKo || moduleId}
                      </span>
                    );
                  })}
                  {data.modules.length > 2 && (
                    <span className="text-xs px-2 py-1 bg-zinc-600/30 rounded font-mono text-zinc-400">
                      +{data.modules.length - 2}
                    </span>
                  )}
                </div>

                {isDeficient && (
                  <div className="text-xs font-mono text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/30">
                    부족: {(data.total - data.available).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Detailed Resource Info */}
              {resourceInfo && selectedResource === resource && (
                <div className="mt-4 p-4 bg-zinc-800/60 rounded-lg border border-zinc-700/50">
                  <p className="text-sm font-mono text-zinc-300 mb-4 leading-relaxed">
                    {resourceInfo.description}
                  </p>

                  {/* Type & Category */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span
                      className={`text-xs px-2 py-1 rounded font-mono uppercase tracking-wider border ${
                        resourceInfo.type === "stellar"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                      }`}
                    >
                      {resourceInfo.type === "stellar"
                        ? "항성 자원"
                        : "제조 자원"}
                    </span>
                    <span className="text-xs px-2 py-1 bg-zinc-700/50 rounded font-mono text-zinc-300">
                      {resourceInfo.rarity}
                    </span>
                  </div>

                  {/* Sources */}
                  <div className="mb-4">
                    <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center">
                      <span className="w-1 h-1 bg-cyan-400 rounded-full mr-2"></span>
                      획득 방법
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {resourceInfo.sources.map(
                        (source: string, index: number) => (
                          <div
                            key={index}
                            className="text-sm font-mono text-cyan-300 bg-cyan-500/5 px-3 py-1 rounded"
                          >
                            • {source}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Manufacturing Requirements */}
                  {resourceInfo.type === "manufacturing" &&
                    (resourceInfo.requiredFacilities ||
                      resourceInfo.requiredTech) && (
                      <div className="mb-4">
                        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center">
                          <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                          필요 조건
                        </div>
                        {resourceInfo.requiredFacilities && (
                          <div className="mb-2">
                            <span className="text-xs font-mono text-yellow-400">
                              시설:{" "}
                            </span>
                            <span className="text-sm font-mono text-zinc-300">
                              {resourceInfo.requiredFacilities.join(", ")}
                            </span>
                          </div>
                        )}
                        {resourceInfo.requiredTech && (
                          <div>
                            <span className="text-xs font-mono text-yellow-400">
                              기술:{" "}
                            </span>
                            <span className="text-sm font-mono text-zinc-300">
                              {resourceInfo.requiredTech.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                  {/* Stellar Conditions */}
                  {resourceInfo.type === "stellar" &&
                    resourceInfo.stellarConditions && (
                      <div className="mb-4">
                        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center">
                          <span className="w-1 h-1 bg-orange-400 rounded-full mr-2"></span>
                          항성 조건
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-mono text-zinc-300">
                            <span className="text-orange-400">분광형:</span>{" "}
                            {resourceInfo.stellarConditions.spectralClasses.join(
                              ", "
                            )}
                          </div>
                          <div className="text-sm font-mono text-zinc-300">
                            <span className="text-orange-400">기본 확률:</span>{" "}
                            {resourceInfo.baseProbability}%
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Module Usage */}
                  <div>
                    <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center">
                      <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                      사용 모듈
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.modules.map((moduleId) => {
                        const moduleInfo = getModuleById(moduleId);
                        return (
                          <span
                            key={moduleId}
                            className="text-xs px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded font-mono text-purple-200"
                          >
                            {moduleInfo?.nameKo || moduleId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
