import React from "react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import {
  ResearchTech,
  ResearchCategory,
  ResearchStatus,
  canResearch,
  getResearchById,
} from "../../data/researchTechs";
import { startResearch } from "../../lib/features/shipSystemsSlice";

interface ResearchDetailsModalProps {
  tech: ResearchTech;
  onClose: () => void;
}

export function ResearchDetailsModal({
  tech,
  onClose,
}: ResearchDetailsModalProps) {
  const dispatch = useAppDispatch();
  const resources = useAppSelector((s) => s.shipSystems.resources.inventory);
  const researchPoints = useAppSelector(
    (s) => s.shipSystems.researchPoints || 0
  );
  const completedResearch = useAppSelector(
    (s) => s.shipSystems.completedResearch || []
  );
  const currentResearch = useAppSelector(
    (s) => s.shipSystems.currentResearch || null
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

  const getCategoryName = (category: ResearchCategory) => {
    switch (category) {
      case ResearchCategory.ENGINEERING:
        return "Engineering";
      case ResearchCategory.PHYSICS:
        return "Physics";
      case ResearchCategory.MATERIALS:
        return "Materials Science";
      case ResearchCategory.COMPUTER:
        return "Computer Science";
      case ResearchCategory.BIOLOGY:
        return "Biology";
      case ResearchCategory.ENERGY:
        return "Energy";
      default:
        return "Other";
    }
  };

  const getTierInfo = (tier: number) => {
    switch (tier) {
      case 0:
        return { name: "Basic", color: "from-zinc-600 to-zinc-700" };
      case 1:
        return { name: "Development", color: "from-blue-600 to-blue-700" };
      case 2:
        return { name: "Advanced", color: "from-purple-600 to-purple-700" };
      case 3:
        return { name: "Advanced", color: "from-pink-600 to-pink-700" };
      case 4:
        return { name: "Experimental", color: "from-red-600 to-red-700" };
      case 5:
        return { name: "Theoretical", color: "from-amber-600 to-amber-700" };
      default:
        return { name: `Tier ${tier}`, color: "from-zinc-600 to-zinc-700" };
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

  const handleStartResearch = async () => {
    if (!canStartResearch()) {
      alert("Cannot start research. Please check the conditions.");
      return;
    }

    try {
      dispatch(
        startResearch({
          techId: tech.id,
          totalPoints: tech.cost.researchPoints,
        })
      );
      onClose();
      alert(`${tech.nameKo} research started!`);
    } catch (error) {
      alert(`Research failed: ${error}`);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const status = getResearchStatus();
  const tierInfo = getTierInfo(tech.tier);
  const canStart = canStartResearch();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-950/95 backdrop-blur-xl rounded-3xl border border-zinc-700/50 max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative p-6 border-b border-zinc-700/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-3xl">
                  {getCategoryIcon(tech.category)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-100 mb-1">
                  {tech.nameKo}
                </h2>
                <p className="text-zinc-400 text-sm">{tech.nameEn}</p>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r ${tierInfo.color} mt-2`}
                >
                  {tierInfo.name}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                <div className="text-zinc-400 text-sm mb-1">Category</div>
                <div className="text-zinc-200 font-medium">
                  {getCategoryName(tech.category)}
                </div>
              </div>
              <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                <div className="text-zinc-400 text-sm mb-1">Status</div>
                <div className="text-zinc-200 font-medium">
                  {status === ResearchStatus.COMPLETED
                    ? "✅ Completed"
                    : status === ResearchStatus.IN_PROGRESS
                    ? "🔄 In Progress"
                    : status === ResearchStatus.AVAILABLE
                    ? "🔬 Available"
                    : "🔒 Locked"}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
              <h3 className="text-lg font-semibold mb-3 text-zinc-200">
                Description
              </h3>
              <p className="text-zinc-300 leading-relaxed mb-3">
                {tech.description}
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {tech.detailedDescription}
              </p>
            </div>

            {/* Research Cost */}
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-xl border border-purple-500/20">
              <h3 className="text-lg font-semibold mb-3 text-purple-300">
                Research Cost
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-zinc-300">Research Points</span>
                  <span className="text-purple-400 font-bold">
                    {tech.cost.researchPoints} RP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Time Required</span>
                  <span className="text-blue-400 font-bold">
                    {formatTime(tech.cost.timeRequired)}
                  </span>
                </div>
              </div>
            </div>

            {/* Required Resources */}
            {tech.cost.requiredResources && (
              <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                <h3 className="text-lg font-semibold mb-4 text-zinc-200">
                  Required Resources
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(tech.cost.requiredResources).map(
                    ([resource, required]) => {
                      const available = resources[resource] || 0;
                      const sufficient = available >= required;

                      return (
                        <div
                          key={resource}
                          className={`p-3 rounded-lg border ${
                            sufficient
                              ? "bg-emerald-500/10 border-emerald-500/30"
                              : "bg-red-500/10 border-red-500/30"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-zinc-200">
                              {resource}
                            </span>
                            <span
                              className={`font-bold ${
                                sufficient ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              {available}/{required}
                            </span>
                          </div>
                          {!sufficient && (
                            <div className="text-red-300 text-sm mt-1">
                              Insufficient: {required - available}
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {tech.prerequisites.length > 0 && (
              <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                <h3 className="text-lg font-semibold mb-4 text-zinc-200">
                  Prerequisites
                </h3>
                <div className="space-y-2">
                  {tech.prerequisites.map((prereq) => {
                    const prereqTech = getResearchById(prereq);
                    const isCompleted = completedResearch.includes(prereq);
                    return (
                      <div
                        key={prereq}
                        className={`p-3 rounded-lg border ${
                          isCompleted
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : "bg-red-500/10 border-red-500/30"
                        }`}
                      >
                        <span
                          className={
                            isCompleted ? "text-emerald-400" : "text-red-400"
                          }
                        >
                          {isCompleted ? "✓" : "✗"}{" "}
                          {prereqTech?.nameKo || prereq}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Effects */}
            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
              <h3 className="text-lg font-semibold mb-3 text-emerald-300">
                Research Effects
              </h3>
              <div className="space-y-2">
                {tech.effects.map((effect, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-emerald-400 text-sm"
                  >
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>{effect}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unlocks */}
            <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
              <h3 className="text-lg font-semibold mb-3 text-amber-300">
                Unlocks
              </h3>
              <div className="space-y-2">
                {tech.unlocks.map((unlock, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-amber-400 text-sm"
                  >
                    <span className="text-amber-500 mt-0.5">🔓</span>
                    <span>{unlock}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-700/50 bg-zinc-900/50">
          <div className="flex gap-4">
            <button
              onClick={handleStartResearch}
              disabled={!canStart}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                canStart
                  ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {status === ResearchStatus.COMPLETED
                ? "Completed"
                : status === ResearchStatus.IN_PROGRESS
                ? "In Progress"
                : status === ResearchStatus.LOCKED
                ? "Locked"
                : canStart
                ? "Start Research"
                : "Conditions Not Met"}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-500 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
