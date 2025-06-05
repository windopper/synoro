import React from "react";
import { getResearchById } from "../../data/researchTechs";

interface CurrentResearchPanelProps {
  currentResearch: {
    techId: string;
    currentPoints: number;
    totalPoints: number;
    startTime: number;
  } | null;
}

export function CurrentResearchPanel({
  currentResearch,
}: CurrentResearchPanelProps) {
  if (!currentResearch) return null;

  const tech = getResearchById(currentResearch.techId);
  const progress =
    (currentResearch.currentPoints / currentResearch.totalPoints) * 100;

  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <span className="text-lg">🔄</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-300">
              In Progress Research
            </h3>
            <p className="text-zinc-400 text-sm">
              {tech?.nameKo || "Unknown Research"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(progress)}%
          </div>
          <div className="text-xs text-zinc-400">
            {currentResearch.currentPoints}/{currentResearch.totalPoints} RP
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/25"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 animate-pulse" />
      </div>

      {/* Research Info */}
      {tech && (
        <div className="mt-4 p-3 bg-zinc-800/30 rounded-xl">
          <p className="text-zinc-300 text-sm">{tech.description}</p>
        </div>
      )}
    </div>
  );
}
