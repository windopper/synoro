import React from "react";
import { useAppSelector } from "../../lib/hooks";
import {
  ResearchCategory,
  ALL_RESEARCH_TECHS,
  ResearchTech,
  ResearchStatus,
  canResearch,
  buildResearchTree,
} from "../../data/researchTechs";

interface ResearchTreeProps {
  selectedCategory: ResearchCategory | null;
  onTechSelect: (tech: ResearchTech) => void;
}

export function ResearchTree({
  selectedCategory,
  onTechSelect,
}: ResearchTreeProps) {
  const completedResearch = useAppSelector(
    (s) => s.shipSystems.completedResearch || []
  );
  const currentResearch = useAppSelector(
    (s) => s.shipSystems.currentResearch || null
  );

  const getResearchStatus = (tech: ResearchTech): ResearchStatus => {
    if (completedResearch.includes(tech.id)) {
      return ResearchStatus.COMPLETED;
    }
    if (currentResearch?.techId === tech.id) {
      return ResearchStatus.IN_PROGRESS;
    }
    if (canResearch(tech.id, completedResearch)) {
      return ResearchStatus.AVAILABLE;
    }
    return ResearchStatus.LOCKED;
  };

  const getCategoryIcon = (category: ResearchCategory) => {
    switch (category) {
      case ResearchCategory.ENGINEERING:
        return "🔧";
      case ResearchCategory.PHYSICS:
        return "⚛️";
      case ResearchCategory.MATERIALS:
        return "🧪";
      case ResearchCategory.COMPUTER:
        return "💻";
      case ResearchCategory.BIOLOGY:
        return "🧬";
      case ResearchCategory.ENERGY:
        return "⚡";
      default:
        return "🔬";
    }
  };

  const getTierName = (tier: number) => {
    switch (tier) {
      case 0:
        return "기초";
      case 1:
        return "발전";
      case 2:
        return "고급";
      case 3:
        return "최첨단";
      case 4:
        return "실험적";
      case 5:
        return "이론적";
      default:
        return `티어 ${tier}`;
    }
  };

  const getStatusIcon = (status: ResearchStatus) => {
    switch (status) {
      case ResearchStatus.COMPLETED:
        return "✅";
      case ResearchStatus.IN_PROGRESS:
        return "🔄";
      case ResearchStatus.AVAILABLE:
        return "🔬";
      case ResearchStatus.LOCKED:
        return "🔒";
    }
  };

  const getStatusColor = (status: ResearchStatus) => {
    switch (status) {
      case ResearchStatus.COMPLETED:
        return "border-emerald-500/50 bg-emerald-500/10";
      case ResearchStatus.IN_PROGRESS:
        return "border-blue-500/50 bg-blue-500/10";
      case ResearchStatus.AVAILABLE:
        return "border-purple-500/50 bg-purple-500/10";
      case ResearchStatus.LOCKED:
        return "border-zinc-700/50 bg-zinc-800/30";
    }
  };

  const researchTree = buildResearchTree();
  const filteredTree = new Map();

  // 카테고리 필터링
  researchTree.forEach((techs, tier) => {
    const filtered = techs.filter(
      (tech: ResearchTech) =>
        !selectedCategory || tech.category === selectedCategory
    );
    if (filtered.length > 0) {
      filteredTree.set(tier, filtered);
    }
  });

  if (filteredTree.size === 0) {
    return null; // EmptyState에서 처리
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-zinc-200">Research Tree</h2>
        <div className="text-sm text-zinc-400">Tier-based Classification</div>
      </div>

      <div className="space-y-8">
        {Array.from(filteredTree.entries()).map(([tier, techs]) => (
          <div key={tier} className="relative">
            {/* Tier Header */}
            <div className="mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">{tier}</span>
              </div>
              <h3 className="text-lg font-semibold text-purple-300">
                {getTierName(tier)} Research
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
            </div>

            {/* Tech Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {(techs as ResearchTech[]).map((tech) => {
                const status = getResearchStatus(tech);
                return (
                  <div
                    key={tech.id}
                    onClick={() => onTechSelect(tech)}
                    className={`group relative p-3 rounded-xl border cursor-pointer transition-all duration-300 ${getStatusColor(
                      status
                    )} ${
                      status !== ResearchStatus.LOCKED
                        ? "hover:scale-105 hover:shadow-lg"
                        : "opacity-60"
                    }`}
                  >
                    {/* Category Icon */}
                    <div className="text-center mb-2">
                      <span className="text-2xl">
                        {getCategoryIcon(tech.category)}
                      </span>
                    </div>

                    {/* Tech Name */}
                    <div className="text-sm font-medium text-center mb-2 text-zinc-200 line-clamp-2">
                      {tech.nameKo}
                    </div>

                    {/* Cost */}
                    <div className="text-xs text-center text-zinc-400 mb-2">
                      {tech.cost.researchPoints} RP
                    </div>

                    {/* Status Icon */}
                    <div className="text-center">
                      <span className="text-lg">{getStatusIcon(status)}</span>
                    </div>

                    {/* Hover Effect */}
                    {status !== ResearchStatus.LOCKED && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Connection Lines (visual enhancement) */}
            {tier > 0 && (
              <div className="absolute -top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
