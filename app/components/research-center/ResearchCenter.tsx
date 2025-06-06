"use client";
import React, { useState } from "react";
import { useAppSelector } from "../../lib/hooks";
import { ResearchCategory, ResearchTech } from "../../data/researchTechs";
import { CategorySelector } from "./CategorySelector";
import { ViewModeToggle } from "./ViewModeToggle";
import { CurrentResearchPanel } from "./CurrentResearchPanel";
import { ResearchGrid } from "./ResearchGrid";
import { ResearchTree } from "./ResearchTree";
import { ResearchDetailsModal } from "./ResearchDetailsModal";
import { EmptyState } from "./EmptyState";
import { createPortal } from "react-dom";

export default function ResearchCenter() {
  const researchPoints = useAppSelector(
    (s) => s.shipSystems.researchPoints || 0
  );
  const currentResearch = useAppSelector(
    (s) => s.shipSystems.currentResearch || null
  );

  const [selectedCategory, setSelectedCategory] =
    useState<ResearchCategory | null>(null);
  const [selectedTech, setSelectedTech] = useState<ResearchTech | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "tree">("list");

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-2xl">🔬</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Research Center
                </h1>
                <p className="text-zinc-400 text-sm">
                  Research new technologies to unlock advanced modules and
                  features
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Research Points */}
              <div className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl">
                <div className="text-xs text-purple-300 mb-1">
                  Research Points
                </div>
                <div className="text-lg font-bold text-purple-400">
                  {researchPoints} RP
                </div>
              </div>

              {/* View Mode Toggle */}
              <ViewModeToggle
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          </div>
        </div>

        {/* Current Research Panel */}
        <CurrentResearchPanel currentResearch={currentResearch} />

        {/* Category Selector */}
        <CategorySelector
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Research Content */}
        {viewMode === "list" ? (
          <ResearchGrid
            selectedCategory={selectedCategory}
            onTechSelect={(tech) => {
              setSelectedTech(tech);
              setShowDetails(true);
            }}
          />
        ) : (
          <ResearchTree
            selectedCategory={selectedCategory}
            onTechSelect={(tech) => {
              setSelectedTech(tech);
              setShowDetails(true);
            }}
          />
        )}

        {/* Empty State */}
        <EmptyState selectedCategory={selectedCategory} />

        {/* Research Details Modal */}
        {showDetails && selectedTech && createPortal(
          <ResearchDetailsModal
            tech={selectedTech}
            onClose={() => {
              setShowDetails(false);
              setSelectedTech(null);
            }}
          />
        , document.body)}
      </div>
    </div>
  );
}
