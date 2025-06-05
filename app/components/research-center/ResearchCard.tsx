import React from "react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import {
  ResearchTech,
  ResearchCategory,
  ResearchStatus,
  canResearch,
} from "../../data/researchTechs";
import { startResearch } from "../../lib/features/shipSystemsSlice";

interface ResearchCardProps {
  tech: ResearchTech;
  completedResearch: string[];
  currentResearch: any;
  onSelect: () => void;
}

export function ResearchCard({
  tech,
  completedResearch,
  currentResearch,
  onSelect,
}: ResearchCardProps) {
  const dispatch = useAppDispatch();
  const resources = useAppSelector((s) => s.shipSystems.resources.inventory);
  const researchPoints = useAppSelector(
    (s) => s.shipSystems.researchPoints || 0
  );

  const getResearchStatus = (): ResearchStatus => {
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

  const getTierInfo = (tier: number) => {
    switch (tier) {
      case 0:
        return { name: "기초", color: "zinc", glow: "zinc-500" };
      case 1:
        return { name: "발전", color: "blue", glow: "blue-500" };
      case 2:
        return { name: "고급", color: "purple", glow: "purple-500" };
      case 3:
        return { name: "최첨단", color: "pink", glow: "pink-500" };
      case 4:
        return { name: "실험적", color: "red", glow: "red-500" };
      case 5:
        return { name: "이론적", color: "amber", glow: "amber-500" };
      default:
        return { name: `T${tier}`, color: "zinc", glow: "zinc-500" };
    }
  };

  const getStatusColor = (status: ResearchStatus) => {
    switch (status) {
      case ResearchStatus.COMPLETED:
        return {
          bg: "from-emerald-500/20 to-green-500/20",
          border: "emerald-500/50",
          text: "emerald-300",
        };
      case ResearchStatus.IN_PROGRESS:
        return {
          bg: "from-blue-500/20 to-cyan-500/20",
          border: "blue-500/50",
          text: "blue-300",
        };
      case ResearchStatus.AVAILABLE:
        return {
          bg: "from-purple-500/20 to-violet-500/20",
          border: "purple-500/50",
          text: "purple-300",
        };
      case ResearchStatus.LOCKED:
        return {
          bg: "from-zinc-800/60 to-zinc-900/60",
          border: "zinc-700/50",
          text: "zinc-500",
        };
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

  const canStartResearch = () => {
    const status = getResearchStatus();
    if (status !== ResearchStatus.AVAILABLE) return false;
    if (currentResearch) return false;
    if (researchPoints < tech.cost.researchPoints) return false;

    if (tech.cost.requiredResources) {
      return Object.entries(tech.cost.requiredResources).every(
        ([resource, required]) => (resources[resource] || 0) >= required
      );
    }

    return true;
  };

  const handleStartResearch = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canStartResearch()) {
      alert("연구를 시작할 수 없습니다. 조건을 확인해주세요.");
      return;
    }

    try {
      dispatch(
        startResearch({
          techId: tech.id,
          totalPoints: tech.cost.researchPoints,
        })
      );
      alert(`${tech.nameKo} 연구를 시작했습니다!`);
    } catch (error) {
      alert(`연구 시작에 실패했습니다: ${error}`);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  const status = getResearchStatus();
  const tierInfo = getTierInfo(tech.tier);
  const statusColors = getStatusColor(status);
  const canStart = canStartResearch();

  return (
    <div
      onClick={onSelect}
      className={`group relative p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 cursor-pointer ${
        status === ResearchStatus.LOCKED ? "opacity-60" : "hover:shadow-lg"
      } bg-gradient-to-br ${statusColors.bg} border-${statusColors.border}`}
    >
      {/* Status Indicator */}
      <div className="absolute top-3 right-3">
        <div className="text-xl">{getStatusIcon(status)}</div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getCategoryIcon(tech.category)}</span>
          <div
            className={`px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${
              tierInfo.color === "zinc"
                ? "from-zinc-600 to-zinc-700"
                : tierInfo.color === "blue"
                ? "from-blue-600 to-blue-700"
                : tierInfo.color === "purple"
                ? "from-purple-600 to-purple-700"
                : tierInfo.color === "pink"
                ? "from-pink-600 to-pink-700"
                : tierInfo.color === "red"
                ? "from-red-600 to-red-700"
                : "from-amber-600 to-amber-700"
            } shadow-lg`}
          >
            {tierInfo.name}
          </div>
        </div>
      </div>

      {/* Tech Name */}
      <h3
        className={`font-bold text-lg mb-2 transition-colors ${
          status !== ResearchStatus.LOCKED
            ? `text-zinc-100 group-hover:text-${
                statusColors.text.split("-")[0]
              }-300`
            : "text-zinc-400"
        }`}
      >
        {tech.nameKo}
      </h3>

      {/* Description */}
      <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
        {tech.description}
      </p>

      {/* Stats */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-400">연구 비용</span>
          <span className="text-purple-400 font-medium">
            {tech.cost.researchPoints} RP
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-400">소요 시간</span>
          <span className="text-blue-400 font-medium">
            {formatTime(tech.cost.timeRequired)}
          </span>
        </div>
      </div>

      {/* Required Resources */}
      {tech.cost.requiredResources && (
        <div className="mb-4">
          <div className="text-xs text-zinc-400 mb-2">필요 자원</div>
          <div className="grid grid-cols-2 gap-1">
            {Object.entries(tech.cost.requiredResources)
              .slice(0, 4)
              .map(([resource, required]) => {
                const available = resources[resource] || 0;
                const sufficient = available >= required;

                return (
                  <div
                    key={resource}
                    className={`text-xs px-2 py-1 rounded ${
                      sufficient
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    <div className="truncate">{resource}</div>
                    <div className="font-medium">
                      {available}/{required}
                    </div>
                  </div>
                );
              })}
          </div>
          {Object.keys(tech.cost.requiredResources).length > 4 && (
            <div className="text-xs text-zinc-500 mt-1">
              +{Object.keys(tech.cost.requiredResources).length - 4}개 더
            </div>
          )}
        </div>
      )}

      {/* Prerequisites */}
      {tech.prerequisites.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-zinc-400 mb-2">선행 연구</div>
          <div className="space-y-1">
            {tech.prerequisites.slice(0, 2).map((prereq) => {
              const isCompleted = completedResearch.includes(prereq);
              return (
                <div
                  key={prereq}
                  className={`text-xs px-2 py-1 rounded ${
                    isCompleted
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {isCompleted ? "✓" : "✗"} {prereq}
                </div>
              );
            })}
            {tech.prerequisites.length > 2 && (
              <div className="text-xs text-zinc-500">
                +{tech.prerequisites.length - 2}개 더
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleStartResearch}
        disabled={!canStart}
        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
          canStart
            ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
        }`}
      >
        {status === ResearchStatus.COMPLETED
          ? "완료됨"
          : status === ResearchStatus.IN_PROGRESS
          ? "진행 중"
          : status === ResearchStatus.LOCKED
          ? "잠김"
          : canStart
          ? "연구 시작"
          : "조건 미충족"}
      </button>

      {/* Hover Glow Effect */}
      {status !== ResearchStatus.LOCKED && (
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${statusColors.bg}`}
        />
      )}
    </div>
  );
}
