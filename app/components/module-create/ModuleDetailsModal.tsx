import React from "react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { CompleteModuleInfo, ModuleCategory } from "../../data/shipModules";
import { installModule } from "../../lib/features/shipSystemsSlice";
import { getUnlocksByResearch } from "../../data/researchTechs";

interface ModuleDetailsModalProps {
  module: CompleteModuleInfo;
  onClose: () => void;
}

export function ModuleDetailsModal({
  module,
  onClose,
}: ModuleDetailsModalProps) {
  const dispatch = useAppDispatch();
  const resources = useAppSelector((s) => s.shipSystems.resources.inventory);
  const completedResearch = useAppSelector(
    (s) => s.shipSystems.completedResearch
  );

  const getCategoryIcon = (category: ModuleCategory) => {
    switch (category) {
      case ModuleCategory.POWER:
        return "⚡";
      case ModuleCategory.NAVIGATION:
        return "🚀";
      case ModuleCategory.EXPLORATION:
        return "🔭";
      case ModuleCategory.COMMUNICATION:
        return "📡";
      case ModuleCategory.DEFENSE:
        return "🛡️";
      case ModuleCategory.RESOURCE:
        return "📦";
      default:
        return "❓";
    }
  };

  const getCategoryName = (category: ModuleCategory) => {
    switch (category) {
      case ModuleCategory.POWER:
        return "Power System";
      case ModuleCategory.NAVIGATION:
        return "Navigation System";
      case ModuleCategory.EXPLORATION:
        return "Exploration System";
      case ModuleCategory.COMMUNICATION:
        return "Communication System";
      case ModuleCategory.DEFENSE:
        return "Defense System";
      case ModuleCategory.RESOURCE:
        return "Resource Management";
      default:
        return "Other";
    }
  };

  const getTierInfo = (tier: number) => {
    switch (tier) {
      case 0:
        return {
          name: "Basic",
          color: "from-zinc-600 to-zinc-700",
          textColor: "text-zinc-300",
        };
      case 1:
        return {
          name: "Improved",
          color: "from-blue-600 to-blue-700",
          textColor: "text-blue-300",
        };
      case 2:
        return {
          name: "Advanced",
          color: "from-purple-600 to-purple-700",
          textColor: "text-purple-300",
        };
      case 3:
        return {
          name: "Top Tier",
          color: "from-amber-600 to-amber-700",
          textColor: "text-amber-300",
        };
      default:
        return {
          name: `Tier ${tier}`,
          color: "from-zinc-600 to-zinc-700",
          textColor: "text-zinc-300",
        };
    }
  };

  const canCreateModule = () => {
    // 자원 요구량 확인
    const hasResources = Object.entries(module.requiredResources).every(
      ([resource, required]) => (resources[resource] || 0) >= required
    );

    // 연구 요구사항 확인
    const hasResearch =
      !module.requiredResearch ||
      completedResearch.includes(module.requiredResearch);

    // 모듈이 연구로 해금되는지 확인
    const unlockedItems = getUnlocksByResearch(completedResearch);
    const isUnlocked =
      !module.requiredResearch || unlockedItems.includes(module.id);

    return hasResources && hasResearch && isUnlocked;
  };

  const handleCreateModule = async () => {
    if (!canCreateModule()) {
      alert("The conditions for creating the module are not met.");
      return;
    }

    try {
      await dispatch(installModule({ moduleId: module.id })).unwrap();
      onClose();
      alert(`${module.nameKo} module has been successfully created!`);
    } catch (error) {
      alert(`Module creation failed: ${error}`);
    }
  };

  const tierInfo = getTierInfo(module.tier);
  const canCreate = canCreateModule();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-950/95 backdrop-blur-xl rounded-3xl border border-zinc-700/50 max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative p-6 border-b border-zinc-700/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">
                  {getCategoryIcon(module.category)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-100 mb-1">
                  {module.nameKo}
                </h2>
                <p className="text-zinc-400 text-sm">{module.nameEn}</p>
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
                  {getCategoryName(module.category)}
                </div>
              </div>
              <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                <div className="text-zinc-400 text-sm mb-1">Durability</div>
                <div className="text-emerald-400 font-bold text-lg">
                  {module.durability}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
              <h3 className="text-lg font-semibold mb-3 text-zinc-200">
                Description
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                {module.description}
              </p>
            </div>

            {/* Energy Consumption */}
            <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
              <h3 className="text-lg font-semibold mb-3 text-amber-300">
                에너지 사용량
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">Base</span>
                <span className="text-amber-400 font-bold">
                  {module.energyConsumption.base} PU
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-zinc-300">Maximum</span>
                <span className="text-amber-400 font-bold">
                  {module.energyConsumption.max} PU
                </span>
              </div>
            </div>

            {/* Required Resources */}
            <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
              <h3 className="text-lg font-semibold mb-4 text-zinc-200">
                필요 자원
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(module.requiredResources).map(
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

            {/* Research Requirement */}
            {module.requiredResearch && (
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                <h3 className="text-lg font-semibold mb-2 text-blue-300">
                  Required Research
                </h3>
                <p className="text-blue-200">{module.requiredResearch}</p>
              </div>
            )}

            {/* Upgrade Effects */}
            {module.upgradeEffects && (
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                <h3 className="text-lg font-semibold mb-2 text-purple-300">
                  Upgrade Effects
                </h3>
                <p className="text-purple-200">{module.upgradeEffects}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-700/50 bg-zinc-900/50">
          <div className="flex gap-4">
            <button
              onClick={handleCreateModule}
              disabled={!canCreate}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                canCreate
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {canCreate ? "Create Module" : "Create Unavailable"}
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
