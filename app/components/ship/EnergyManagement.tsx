"use client";
import React from "react";
import type { EnergyManagement as EnergyState } from "../../lib/features/shipSystemsSlice";

interface EnergyManagementProps {
  energy: EnergyState;
}

export default function EnergyManagement({ energy }: EnergyManagementProps) {
  const efficiency = energy.distributionEfficiency;
  const storagePercent = (energy.currentStored / energy.totalStorage) * 100;

  return (
    <div className="relative border border-gray-700/40 bg-gray-900/40 p-3 rounded hover:border-gray-600/60 hover:bg-gray-800/30 transition-all duration-300">
      {/* Header with indicator */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-2 h-2 bg-blue-400 animate-pulse rounded-full" />
        <h4 className="text-sm font-mono text-gray-200 tracking-wide uppercase">Energy Management</h4>
      </div>
      
      {/* Energy metrics */}
      <div className="space-y-3">
        <div className="group relative">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Generation</span>
            <span className="text-sm font-mono text-green-400">{energy.totalGeneration} MW</span>
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-green-500 to-transparent rounded-full opacity-50" />
        </div>
        
        <div className="group relative">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Consumption</span>
            <span className="text-sm font-mono text-orange-400">{energy.totalConsumption} MW</span>
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-400 via-orange-500 to-transparent rounded-full opacity-50" />
        </div>
        
        <div className="group relative">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Storage</span>
            <span className="text-sm font-mono text-blue-300">{energy.currentStored}/{energy.totalStorage}</span>
          </div>
          <div className="w-full h-2 bg-gray-700/60 rounded-sm overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
              style={{ width: `${storagePercent}%` }}
            />
          </div>
          <div className="text-xs font-mono text-gray-500 mt-1">{storagePercent.toFixed(1)}% Capacity</div>
        </div>
        
        {/* Efficiency indicator */}
        <div className="pt-2 border-t border-gray-700/30">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Efficiency</span>
            <span className={`text-sm font-mono ${efficiency >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {efficiency > 0 ? '+' : ''}{efficiency.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "linear-gradient(rgba(156, 163, 175, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(156, 163, 175, 0.1) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />
      </div>
    </div>
  );
}