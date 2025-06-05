"use client";
import React from "react";

interface SystemOverviewProps {
  hull: number;
  shield: number;
}

export default function SystemOverview({ hull, shield }: SystemOverviewProps) {
  return (
    <div className="relative border border-zinc-800/60 bg-zinc-950/90 backdrop-blur-sm p-5 rounded-lg hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-300 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-cyan-400 animate-pulse rounded-full shadow-lg shadow-cyan-400/50" />
          <span className="text-sm font-mono text-zinc-100 tracking-wider uppercase font-semibold">System Status</span>
        </div>
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
          <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
          <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Hull Integrity */}
        <div className="group relative p-3 rounded-md bg-zinc-900/40 border border-zinc-800/40 hover:border-zinc-700/60 transition-all duration-200">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-400 via-red-500 to-transparent rounded-full opacity-70" />
          <div className="pl-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Hull</div>
              <div className="text-sm font-mono text-zinc-200 font-semibold">{hull.toFixed(1)}%</div>
            </div>
            <div className="w-full h-2 bg-zinc-800/60 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ease-out ${
                  hull > 75 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-sm shadow-emerald-400/30' : 
                  hull > 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-sm shadow-yellow-400/30' : 
                  hull > 25 ? 'bg-gradient-to-r from-orange-500 to-orange-400 shadow-sm shadow-orange-400/30' : 
                  'bg-gradient-to-r from-red-500 to-red-400 shadow-sm shadow-red-400/30'
                }`}
                style={{ width: `${hull}%` }}
              />
            </div>
            <div className="text-xs font-mono text-zinc-500 mt-1.5">
              {hull > 75 ? 'Optimal' : hull > 50 ? 'Stable' : hull > 25 ? 'Damaged' : 'Critical'}
            </div>
          </div>
        </div>
        
        {/* Shield Capacity */}
        <div className="group relative p-3 rounded-md bg-zinc-900/40 border border-zinc-800/40 hover:border-zinc-700/60 transition-all duration-200">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-cyan-500 to-transparent rounded-full opacity-70" />
          <div className="pl-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Shield</div>
              <div className="text-sm font-mono text-zinc-200 font-semibold">{shield.toFixed(1)}%</div>
            </div>
            <div className="w-full h-2 bg-zinc-800/60 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ease-out ${
                  shield > 75 ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 shadow-sm shadow-cyan-400/30' : 
                  shield > 50 ? 'bg-gradient-to-r from-blue-500 to-blue-400 shadow-sm shadow-blue-400/30' : 
                  shield > 25 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-sm shadow-yellow-400/30' : 
                  'bg-gradient-to-r from-red-500 to-red-400 shadow-sm shadow-red-400/30'
                }`}
                style={{ width: `${shield}%` }}
              />
            </div>
            <div className="text-xs font-mono text-zinc-500 mt-1.5">
              {shield > 75 ? 'Active' : shield > 50 ? 'Stable' : shield > 25 ? 'Weak' : 'Offline'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 rounded-lg overflow-hidden">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "linear-gradient(rgba(244, 244, 245, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(244, 244, 245, 0.1) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />
      </div>
      
      {/* Glow effect */}
      <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}