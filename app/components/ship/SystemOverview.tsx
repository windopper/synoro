"use client";
import React from "react";

interface SystemOverviewProps {
  hull: number;
  shield: number;
}

export default function SystemOverview({ hull, shield }: SystemOverviewProps) {
  return (
    <div className="relative border border-gray-700/40 bg-gray-900/40 p-4 rounded hover:border-gray-600/60 hover:bg-gray-800/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-2 h-2 bg-red-400 animate-pulse rounded-full" />
        <span className="text-sm font-mono text-gray-200 tracking-wide uppercase">System Overview</span>
        <div className="flex space-x-1 ml-auto">
          <div className="w-1 h-1 bg-gray-500 rounded-full" />
          <div className="w-1 h-1 bg-gray-600 rounded-full" />
          <div className="w-1 h-1 bg-gray-700 rounded-full" />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        {/* Hull Integrity */}
        <div className="flex-1 group relative">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-red-600 to-transparent rounded-full opacity-50" />
          <div className="pl-3">
            <div className="flex justify-between items-center mb-1">
              <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Hull Integrity</div>
              <div className="text-sm font-mono text-red-300">{hull.toFixed(1)}%</div>
            </div>
            <div className="w-full h-3 bg-gray-700/60 rounded overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  hull > 75 ? 'bg-green-500' : 
                  hull > 50 ? 'bg-yellow-400' : 
                  hull > 25 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${hull}%` }}
              />
            </div>
            <div className="text-xs font-mono text-gray-500 mt-1">
              {hull > 75 ? 'Excellent' : hull > 50 ? 'Good' : hull > 25 ? 'Damaged' : 'Critical'}
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-600 to-transparent" />
        
        {/* Shield Capacity */}
        <div className="flex-1 group relative">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-blue-600 to-transparent rounded-full opacity-50" />
          <div className="pl-3">
            <div className="flex justify-between items-center mb-1">
              <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Shield Capacity</div>
              <div className="text-sm font-mono text-blue-300">{shield.toFixed(1)}%</div>
            </div>
            <div className="w-full h-3 bg-gray-700/60 rounded overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  shield > 75 ? 'bg-blue-500' : 
                  shield > 50 ? 'bg-cyan-400' : 
                  shield > 25 ? 'bg-yellow-400' : 'bg-red-500'
                }`}
                style={{ width: `${shield}%` }}
              />
            </div>
            <div className="text-xs font-mono text-gray-500 mt-1">
              {shield > 75 ? 'Stable' : shield > 50 ? 'Moderate' : shield > 25 ? 'Weakened' : 'Failing'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "linear-gradient(rgba(156, 163, 175, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(156, 163, 175, 0.1) 1px, transparent 1px)",
            backgroundSize: "15px 15px",
          }}
        />
      </div>
    </div>
  );
}