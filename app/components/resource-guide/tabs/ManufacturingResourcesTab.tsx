import React, { useState } from "react";
import {
  ALL_MANUFACTURING_RESOURCES,
  ManufacturingCategory,
} from "../../../data/manufacturingResources";
import {
  getCategoryColor,
  getCategoryLabel,
  getDifficultyColor,
  getDifficultyLabel,
} from "../utils";

export function ManufacturingResourcesTab() {
  const [selectedCategory, setSelectedCategory] =
    useState<ManufacturingCategory | null>(null);

  const filteredResources = selectedCategory
    ? ALL_MANUFACTURING_RESOURCES.filter((r) => r.category === selectedCategory)
    : ALL_MANUFACTURING_RESOURCES;

  const categoryStats = Object.values(ManufacturingCategory).map(
    (category) => ({
      category,
      count: ALL_MANUFACTURING_RESOURCES.filter((r) => r.category === category)
        .length,
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-mono text-zinc-200 tracking-wide">
            제조 자원 도감
          </h3>
          <p className="text-sm font-mono text-zinc-400 mt-1">
            행성, 소행성 또는 우주 기지에서 제조할 수 있는 자원들입니다.
          </p>
        </div>
        <div className="text-sm font-mono text-zinc-400">
          {selectedCategory
            ? filteredResources.length
            : ALL_MANUFACTURING_RESOURCES.length}
          개 자원
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-2 text-xs font-mono rounded-lg border transition-all duration-300 ${
            selectedCategory === null
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
              : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:bg-zinc-700/50 hover:text-zinc-300"
          }`}
        >
          전체 ({ALL_MANUFACTURING_RESOURCES.length})
        </button>
        {categoryStats.map(({ category, count }) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-2 text-xs font-mono rounded-lg border transition-all duration-300 ${
              selectedCategory === category
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:bg-zinc-700/50 hover:text-zinc-300"
            }`}
          >
            {getCategoryLabel(category)} ({count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
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
                className={`text-xs px-2 py-1 rounded font-mono border ${getCategoryColor(
                  resource.category
                )}`}
              >
                {getCategoryLabel(resource.category)}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm font-mono text-zinc-300 mb-4 leading-relaxed">
              {resource.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-zinc-800/50 p-3 rounded border border-zinc-700/50">
                <div className="text-xs font-mono text-zinc-400 mb-1">
                  기본 가치
                </div>
                <div className="text-sm font-mono text-yellow-400 font-bold">
                  {resource.baseValue.toLocaleString()}
                </div>
              </div>
              {resource.manufacturingTime && (
                <div className="bg-zinc-800/50 p-3 rounded border border-zinc-700/50">
                  <div className="text-xs font-mono text-zinc-400 mb-1">
                    제조 시간
                  </div>
                  <div className="text-sm font-mono text-blue-400 font-bold">
                    {Math.floor(resource.manufacturingTime / 60)}분
                  </div>
                </div>
              )}
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <span
                className={`text-xs px-2 py-1 rounded font-mono border ${getDifficultyColor(
                  resource.difficulty
                )} bg-zinc-800/30`}
              >
                {getDifficultyLabel(resource.difficulty)}
              </span>
            </div>

            {/* Sources */}
            <div className="mb-4">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center">
                <span className="w-1 h-1 bg-cyan-400 rounded-full mr-2"></span>
                획득 방법
              </div>
              <div className="space-y-1">
                {resource.sources.map((source: string, index: number) => (
                  <div
                    key={index}
                    className="text-sm font-mono text-cyan-300 bg-cyan-500/5 px-2 py-1 rounded"
                  >
                    • {source}
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            {resource.prerequisites &&
              Object.keys(resource.prerequisites).length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center">
                    <span className="w-1 h-1 bg-orange-400 rounded-full mr-2"></span>
                    필요 재료
                  </div>
                  <div className="space-y-1">
                    {Object.entries(resource.prerequisites).map(
                      ([material, amount]) => (
                        <div
                          key={material}
                          className="text-sm font-mono text-orange-300 bg-orange-500/5 px-2 py-1 rounded"
                        >
                          • {material} x{amount}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Requirements */}
            {(resource.requiredFacilities || resource.requiredTech) && (
              <div className="border-t border-zinc-700/50 pt-4">
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  필요 조건
                </div>
                {resource.requiredFacilities && (
                  <div className="mb-2">
                    <span className="text-xs font-mono text-yellow-400">
                      시설:{" "}
                    </span>
                    <div className="text-sm font-mono text-zinc-300 mt-1">
                      {resource.requiredFacilities.map((facility, index) => (
                        <span
                          key={index}
                          className="inline-block bg-yellow-500/10 border border-yellow-500/30 px-2 py-1 rounded mr-1 mb-1"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {resource.requiredTech && (
                  <div>
                    <span className="text-xs font-mono text-yellow-400">
                      기술:{" "}
                    </span>
                    <div className="text-sm font-mono text-zinc-300 mt-1">
                      {resource.requiredTech.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-block bg-purple-500/10 border border-purple-500/30 px-2 py-1 rounded mr-1 mb-1"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gradient-to-br from-zinc-600 to-zinc-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-xl font-mono text-zinc-200 mb-2">
            자원이 없습니다
          </h3>
          <p className="text-zinc-400 font-mono">
            선택한 카테고리에 해당하는 자원이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
