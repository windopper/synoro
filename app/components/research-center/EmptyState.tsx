import React from "react";
import { useAppSelector } from "../../lib/hooks";
import { ResearchCategory, ALL_RESEARCH_TECHS } from "../../data/researchTechs";

interface EmptyStateProps {
  selectedCategory: ResearchCategory | null;
}

export function EmptyState({ selectedCategory }: EmptyStateProps) {
  const completedResearch = useAppSelector(
    (s) => s.shipSystems.completedResearch || []
  );

  const filteredTechs = selectedCategory
    ? ALL_RESEARCH_TECHS.filter((tech) => tech.category === selectedCategory)
    : ALL_RESEARCH_TECHS;

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

  // 연구할 기술이 있으면 EmptyState를 표시하지 않음
  if (filteredTechs.length > 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
        <span className="text-4xl">🔬</span>
      </div>

      <h3 className="text-2xl font-bold mb-3 text-zinc-200">
        No researchable technologies
      </h3>

      <p className="text-zinc-400 text-center max-w-md leading-relaxed">
        {selectedCategory
          ? `${getCategoryName(
              selectedCategory
            )} category has no researchable technologies.`
          : "All technologies are completed or conditions are not met."}
      </p>

      {selectedCategory && (
        <div className="mt-6 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
          <p className="text-zinc-300 text-sm">
            💡 Select a different category or complete prerequisite research to
            unlock new technologies.
          </p>
        </div>
      )}

      {!selectedCategory && completedResearch.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
          <p className="text-emerald-300 text-sm text-center">
            🎉 Congratulations! All research is complete.
          </p>
        </div>
      )}
    </div>
  );
}
