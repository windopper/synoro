import React from "react";
import { useAppDispatch } from "../../lib/hooks";
import { CompleteModuleInfo, ModuleCategory } from "../../data/shipModules";
import { installModule } from "../../lib/features/shipSystemsSlice";

interface ModuleCardProps {
  module: CompleteModuleInfo;
  canCreate: boolean;
  resources: Record<string, number>;
  onSelect: () => void;
}

export function ModuleCard({
  module,
  canCreate,
  resources,
  onSelect,
}: ModuleCardProps) {
  const dispatch = useAppDispatch();

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

  const getTierInfo = (tier: number) => {
    switch (tier) {
      case 0:
        return { name: "기본", color: "zinc", glow: "zinc-500" };
      case 1:
        return { name: "개선", color: "blue", glow: "blue-500" };
      case 2:
        return { name: "고급", color: "purple", glow: "purple-500" };
      case 3:
        return { name: "최고급", color: "amber", glow: "amber-500" };
      default:
        return { name: `T${tier}`, color: "zinc", glow: "zinc-500" };
    }
  };

  const tierInfo = getTierInfo(module.tier);

  const handleCreateModule = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canCreate) {
      alert("모듈 생성에 필요한 조건이 충족되지 않았습니다.");
      return;
    }

    try {
      await dispatch(installModule({ moduleId: module.id })).unwrap();
      alert(`${module.nameKo} 모듈이 성공적으로 생성되었습니다!`);
    } catch (error) {
      alert(`모듈 생성에 실패했습니다: ${error}`);
    }
  };

  const getMissingResources = () => {
    return Object.entries(module.requiredResources).filter(
      ([resource, required]) => (resources[resource] || 0) < required
    );
  };

  const missingResources = getMissingResources();

  return (
    <div
      onClick={onSelect}
      className={`group relative p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 cursor-pointer ${
        canCreate
          ? "bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border-zinc-700/50 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/25"
          : "bg-gradient-to-br from-zinc-900/60 to-zinc-950/60 border-zinc-800/50 opacity-75"
      }`}
    >
      {/* Status Indicator */}
      <div className="absolute top-3 right-3">
        <div
          className={`w-3 h-3 rounded-full ${
            canCreate
              ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
              : "bg-red-500 shadow-lg shadow-red-500/50"
          }`}
        />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getCategoryIcon(module.category)}</span>
          <div
            className={`px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${
              tierInfo.color === "zinc"
                ? "from-zinc-600 to-zinc-700"
                : tierInfo.color === "blue"
                ? "from-blue-600 to-blue-700"
                : tierInfo.color === "purple"
                ? "from-purple-600 to-purple-700"
                : "from-amber-600 to-amber-700"
            } shadow-lg`}
          >
            {tierInfo.name}
          </div>
        </div>
      </div>

      {/* Module Name */}
      <h3 className="font-bold text-lg mb-2 text-zinc-100 group-hover:text-emerald-300 transition-colors">
        {module.nameKo}
      </h3>

      {/* Description */}
      <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
        {module.description}
      </p>

      {/* Stats */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-400">에너지</span>
          <span className="text-amber-400 font-medium">
            {module.energyConsumption.base}-{module.energyConsumption.max} PU
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-400">내구도</span>
          <span className="text-emerald-400 font-medium">
            {module.durability}
          </span>
        </div>
      </div>

      {/* Required Resources */}
      <div className="mb-4">
        <div className="text-xs text-zinc-400 mb-2">필요 자원</div>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(module.requiredResources)
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
        {Object.keys(module.requiredResources).length > 4 && (
          <div className="text-xs text-zinc-500 mt-1">
            +{Object.keys(module.requiredResources).length - 4}개 더
          </div>
        )}
      </div>

      {/* Missing Resources Warning */}
      {missingResources.length > 0 && (
        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="text-red-400 text-xs font-medium mb-1">자원 부족</div>
          <div className="text-red-300 text-xs">
            {missingResources
              .slice(0, 2)
              .map(([resource]) => resource)
              .join(", ")}
            {missingResources.length > 2 &&
              ` +${missingResources.length - 2}개`}
          </div>
        </div>
      )}

      {/* Research Requirement */}
      {module.requiredResearch && (
        <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="text-blue-400 text-xs font-medium mb-1">
            필요 연구
          </div>
          <div className="text-blue-300 text-xs truncate">
            {module.requiredResearch}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleCreateModule}
        disabled={!canCreate}
        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
          canCreate
            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
        }`}
      >
        {canCreate ? "모듈 생성" : "생성 불가"}
      </button>

      {/* Hover Glow Effect */}
      {canCreate && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </div>
  );
}
