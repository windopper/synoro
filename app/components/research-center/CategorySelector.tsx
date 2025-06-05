import React from "react";
import { ResearchCategory } from "../../data/researchTechs";

interface CategorySelectorProps {
  selectedCategory: ResearchCategory | null;
  onCategoryChange: (category: ResearchCategory | null) => void;
}

export function CategorySelector({
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) {
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

  const categories = Object.values(ResearchCategory);

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 text-zinc-200">
        Research Categories
      </h2>
      <div className="flex flex-wrap gap-3">
        {/* All Categories Button */}
        <button
          onClick={() => onCategoryChange(null)}
          className={`group relative px-4 py-3 rounded-xl transition-all duration-300 ${
            selectedCategory === null
              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 shadow-lg shadow-purple-500/25"
              : "bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🌟</span>
            <span
              className={`font-medium text-sm ${
                selectedCategory === null ? "text-purple-300" : "text-zinc-300"
              }`}
            >
              All
            </span>
          </div>
          {selectedCategory === null && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse" />
          )}
        </button>

        {/* Category Buttons */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`group relative px-4 py-3 rounded-xl transition-all duration-300 ${
              selectedCategory === category
                ? "bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/50 shadow-lg shadow-violet-500/25"
                : "bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCategoryIcon(category)}</span>
              <span
                className={`font-medium text-sm ${
                  selectedCategory === category
                    ? "text-violet-300"
                    : "text-zinc-300"
                }`}
              >
                {getCategoryName(category)}
              </span>
            </div>
            {selectedCategory === category && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
