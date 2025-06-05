"use client";
import React from "react";
import {
  RESOURCE_DATABASE,
  ResourceCategory,
  ResourceRarity,
  getResourcesByCategory,
  getResourcesByRarity,
} from "../../data/resourceTypes";

interface ResourceOverviewProps {
  className?: string;
}

const RARITY_COLORS = {
  [ResourceRarity.COMMON]: "text-zinc-400",
  [ResourceRarity.UNCOMMON]: "text-emerald-400",
  [ResourceRarity.RARE]: "text-cyan-400",
  [ResourceRarity.VERY_RARE]: "text-violet-400",
  [ResourceRarity.LEGENDARY]: "text-amber-400",
  [ResourceRarity.UNIQUE]: "text-rose-400",
};

const CATEGORY_COLORS = {
  [ResourceCategory.STELLAR_ENERGY]:
    "border-amber-400/50 bg-amber-400/5 hover:bg-amber-400/10",
  [ResourceCategory.STELLAR_MATTER]:
    "border-orange-400/50 bg-orange-400/5 hover:bg-orange-400/10",
  [ResourceCategory.GASES]:
    "border-cyan-400/50 bg-cyan-400/5 hover:bg-cyan-400/10",
  [ResourceCategory.METALS]:
    "border-zinc-400/50 bg-zinc-400/5 hover:bg-zinc-400/10",
  [ResourceCategory.CRYSTALS]:
    "border-violet-400/50 bg-violet-400/5 hover:bg-violet-400/10",
  [ResourceCategory.EXOTIC_MATTER]:
    "border-pink-400/50 bg-pink-400/5 hover:bg-pink-400/10",
  [ResourceCategory.QUANTUM]:
    "border-emerald-400/50 bg-emerald-400/5 hover:bg-emerald-400/10",
  [ResourceCategory.DARK_MATTER]:
    "border-rose-400/50 bg-rose-400/5 hover:bg-rose-400/10",
};

const CATEGORY_NAMES = {
  [ResourceCategory.STELLAR_ENERGY]: "Stellar Energy",
  [ResourceCategory.STELLAR_MATTER]: "Stellar Matter",
  [ResourceCategory.GASES]: "Gases",
  [ResourceCategory.METALS]: "Metals",
  [ResourceCategory.CRYSTALS]: "Crystals",
  [ResourceCategory.EXOTIC_MATTER]: "Exotic Matter",
  [ResourceCategory.QUANTUM]: "Quantum Matter",
  [ResourceCategory.DARK_MATTER]: "Dark Matter",
};

const RARITY_NAMES = {
  [ResourceRarity.COMMON]: "Common",
  [ResourceRarity.UNCOMMON]: "Uncommon",
  [ResourceRarity.RARE]: "Rare",
  [ResourceRarity.VERY_RARE]: "Very Rare",
  [ResourceRarity.LEGENDARY]: "Legendary",
  [ResourceRarity.UNIQUE]: "Unique",
};

export default function ResourceOverview({
  className = "",
}: ResourceOverviewProps) {
  const [selectedCategory, setSelectedCategory] =
    React.useState<ResourceCategory | null>(null);
  const [selectedRarity, setSelectedRarity] =
    React.useState<ResourceRarity | null>(null);

  const getFilteredResources = () => {
    let resources = Object.values(RESOURCE_DATABASE);

    if (selectedCategory) {
      resources = resources.filter((r) => r.category === selectedCategory);
    }

    if (selectedRarity) {
      resources = resources.filter((r) => r.rarity === selectedRarity);
    }

    return resources;
  };

  const filteredResources = getFilteredResources();

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Resource Codex
        </h2>
        <p className="text-zinc-400 text-lg">
          Discover all resources found across the universe
        </p>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto animate-pulse"></div>
      </div>

      {/* Filter Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Category Filter */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            Filter by Category
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedCategory === null
                  ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-400/50 text-white shadow-lg shadow-cyan-400/20"
                  : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 border border-zinc-700/50"
              }`}
            >
              All Categories
            </button>
            {Object.values(ResourceCategory).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? `${CATEGORY_COLORS[category]} border text-white shadow-lg`
                    : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 border border-zinc-700/50"
                }`}
              >
                {CATEGORY_NAMES[category]}
              </button>
            ))}
          </div>
        </div>

        {/* Rarity Filter */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
            Filter by Rarity
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedRarity(null)}
              className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedRarity === null
                  ? "bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-400/50 text-white shadow-lg shadow-violet-400/20"
                  : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 border border-zinc-700/50"
              }`}
            >
              All Rarities
            </button>
            {Object.values(ResourceRarity).map((rarity) => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(rarity)}
                className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedRarity === rarity
                    ? "bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-400/50 text-white shadow-lg shadow-violet-400/20"
                    : `bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 ${RARITY_COLORS[rarity]}`
                }`}
              >
                {RARITY_NAMES[rarity]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300">
          <div className="text-3xl font-bold text-white mb-1">
            {filteredResources.length}
          </div>
          <div className="text-sm text-zinc-400">Total Resources</div>
          <div className="w-full h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 animate-pulse"></div>
          </div>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300">
          <div className="text-3xl font-bold text-emerald-400 mb-1">
            {
              filteredResources.filter(
                (r) =>
                  r.rarity === ResourceRarity.COMMON ||
                  r.rarity === ResourceRarity.UNCOMMON
              ).length
            }
          </div>
          <div className="text-sm text-zinc-400">Common Resources</div>
          <div className="w-full h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-green-400 animate-pulse"></div>
          </div>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300">
          <div className="text-3xl font-bold text-cyan-400 mb-1">
            {
              filteredResources.filter((r) => r.rarity === ResourceRarity.RARE)
                .length
            }
          </div>
          <div className="text-sm text-zinc-400">Rare Resources</div>
          <div className="w-full h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse"></div>
          </div>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300">
          <div className="text-3xl font-bold text-violet-400 mb-1">
            {
              filteredResources.filter(
                (r) =>
                  r.rarity === ResourceRarity.VERY_RARE ||
                  r.rarity === ResourceRarity.LEGENDARY ||
                  r.rarity === ResourceRarity.UNIQUE
              ).length
            }
          </div>
          <div className="text-sm text-zinc-400">Legendary+ Resources</div>
          <div className="w-full h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-400 to-purple-400 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Resource List */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-semibold text-white">
            Resource Database
          </h3>
          <div className="px-3 py-1 bg-zinc-800/50 rounded-full border border-zinc-700/50">
            <span className="text-sm text-zinc-400">
              {filteredResources.length} items
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className={`bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                CATEGORY_COLORS[resource.category]
              }`}
            >
              {/* Resource Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-xl mb-1">
                    {resource.nameKo}
                  </h4>
                  <p className="text-sm text-zinc-400 font-mono">
                    {resource.nameEn}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <div
                    className={`text-sm font-semibold px-2 py-1 rounded-lg bg-black/20 ${
                      RARITY_COLORS[resource.rarity]
                    }`}
                  >
                    {RARITY_NAMES[resource.rarity]}
                  </div>
                  <div className="text-xs text-zinc-500 px-2 py-1 bg-zinc-800/50 rounded">
                    {CATEGORY_NAMES[resource.category]}
                  </div>
                </div>
              </div>

              {/* Resource Description */}
              <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
                {resource.description}
              </p>

              {/* Resource Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-lg">
                  <span className="text-zinc-400 text-sm">Base Value:</span>
                  <span className="text-amber-400 font-semibold">
                    {resource.baseValue}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-lg">
                  <span className="text-zinc-400 text-sm">Drop Rate:</span>
                  <span className="text-emerald-400 font-semibold">
                    {resource.baseProbability}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-lg">
                  <span className="text-zinc-400 text-sm">Max Yield:</span>
                  <span className="text-cyan-400 font-semibold">
                    {resource.maxYieldPerHour}/hr
                  </span>
                </div>
              </div>

              {/* Generation Conditions */}
              <div className="mt-4 pt-4 border-t border-zinc-800/50">
                <div className="text-xs text-zinc-500 mb-3 font-medium">
                  Generation Conditions:
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {resource.stellarConditions.spectralClasses.map((sc) => (
                    <span
                      key={sc}
                      className="px-2 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-xs text-zinc-300 font-mono"
                    >
                      {sc}-Class
                    </span>
                  ))}
                </div>
                <div className="text-xs text-zinc-500 p-2 bg-zinc-800/30 rounded-lg font-mono">
                  Temperature:{" "}
                  {resource.stellarConditions.temperatureRange[0].toLocaleString()}{" "}
                  -{" "}
                  {resource.stellarConditions.temperatureRange[1].toLocaleString()}
                  K
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
