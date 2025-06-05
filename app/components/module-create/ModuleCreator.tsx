"use client";
import React, { useState } from "react";
import { useAppSelector } from "../../lib/hooks";
import { ModuleCategory, CompleteModuleInfo } from "../../data/shipModules";
import { CategorySelector } from "./CategorySelector";
import { ModuleGrid } from "./ModuleGrid";
import { ModuleDetailsModal } from "./ModuleDetailsModal";
import { EmptyState } from "./EmptyState";

export default function ModuleCreator() {
  const installedModules = useAppSelector(
    (s) => s.shipSystems.installedModules
  );
  const [selectedCategory, setSelectedCategory] =
    useState<ModuleCategory | null>(null);
  const [selectedModule, setSelectedModule] =
    useState<CompleteModuleInfo | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <span className="text-2xl">🔧</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Module Creator
              </h1>
              <p className="text-zinc-400 text-sm">
                Create new modules to improve your ship's performance
              </p>
            </div>
          </div>
        </div>

        {/* Category Selector */}
        <CategorySelector
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Module Grid */}
        <ModuleGrid
          selectedCategory={selectedCategory}
          installedModules={installedModules}
          onModuleSelect={(module) => {
            setSelectedModule(module);
            setShowDetails(true);
          }}
        />

        {/* Empty State */}
        <EmptyState selectedCategory={selectedCategory} />

        {/* Module Details Modal */}
        {showDetails && selectedModule && (
          <ModuleDetailsModal
            module={selectedModule}
            onClose={() => {
              setShowDetails(false);
              setSelectedModule(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
