import React from "react";
import { ModuleCategory } from "../../data/shipModules";

interface CategorySelectorProps {
  selectedCategory: ModuleCategory | null;
  onCategoryChange: (category: ModuleCategory | null) => void;
}

export function CategorySelector({
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) {
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
        return "Power";
      case ModuleCategory.NAVIGATION:
        return "Navigation";
      case ModuleCategory.EXPLORATION:
        return "Exploration";
      case ModuleCategory.COMMUNICATION:
        return "Communication";
      case ModuleCategory.DEFENSE:
        return "Defense";
      case ModuleCategory.RESOURCE:
        return "Resource";
      default:
        return "Other";
    }
  };

  const categories = Object.values(ModuleCategory);

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 text-zinc-200">Category</h2>
      <div className="flex flex-wrap gap-3">
        {/* All Categories Button */}
        <button
          onClick={() => onCategoryChange(null)}
          className={`group relative px-4 py-3 rounded-xl transition-all duration-300 ${
            selectedCategory === null
              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 shadow-lg shadow-cyan-500/25"
              : "bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🌟</span>
            <span
              className={`font-medium text-sm ${
                selectedCategory === null ? "text-cyan-300" : "text-zinc-300"
              }`}
            >
              All
            </span>
          </div>
          {selectedCategory === null && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse" />
          )}
        </button>

        {/* Category Buttons */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`group relative px-4 py-3 rounded-xl transition-all duration-300 ${
              selectedCategory === category
                ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 shadow-lg shadow-emerald-500/25"
                : "bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCategoryIcon(category)}</span>
              <span
                className={`font-medium text-sm ${
                  selectedCategory === category
                    ? "text-emerald-300"
                    : "text-zinc-300"
                }`}
              >
                {getCategoryName(category)}
              </span>
            </div>
            {selectedCategory === category && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
