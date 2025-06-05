import React from "react";

interface ViewModeToggleProps {
  viewMode: "list" | "tree";
  onViewModeChange: (mode: "list" | "tree") => void;
}

export function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) {
  return (
    <div className="flex bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-1">
      <button
        onClick={() => onViewModeChange("list")}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          viewMode === "list"
            ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
        }`}
      >
        📋 List
      </button>
      <button
        onClick={() => onViewModeChange("tree")}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          viewMode === "tree"
            ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
        }`}
      >
        🌳 Tree
      </button>
    </div>
  );
}
