import React from "react";
import { useAppSelector } from "../../lib/hooks";
import {
  ResearchCategory,
  ALL_RESEARCH_TECHS,
  ResearchTech,
  ResearchStatus,
  canResearch,
} from "../../data/researchTechs";
import { ResearchCard } from "./ResearchCard";

interface ResearchGridProps {
  selectedCategory: ResearchCategory | null;
  onTechSelect: (tech: ResearchTech) => void;
}

export function ResearchGrid({
  selectedCategory,
  onTechSelect,
}: ResearchGridProps) {
  const completedResearch = useAppSelector(
    (s) => s.shipSystems.completedResearch || []
  );
  const currentResearch = useAppSelector(
    (s) => s.shipSystems.currentResearch || null
  );

  const filteredTechs = selectedCategory
    ? ALL_RESEARCH_TECHS.filter((tech) => tech.category === selectedCategory)
    : ALL_RESEARCH_TECHS;

  if (filteredTechs.length === 0) {
    return null; // EmptyState에서 처리
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-zinc-200">
          Research Technologies ({filteredTechs.length} items)
        </h2>
        <div className="text-sm text-zinc-400">
          {
            filteredTechs.filter((tech) => {
              return (
                canResearch(tech.id, completedResearch) && !currentResearch
              );
            }).length
          }
          Researchable Technologies
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filteredTechs.map((tech) => (
          <ResearchCard
            key={tech.id}
            tech={tech}
            completedResearch={completedResearch}
            currentResearch={currentResearch}
            onSelect={() => onTechSelect(tech)}
          />
        ))}
      </div>
    </div>
  );
}
