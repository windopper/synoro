"use client";
import React from "react";
import type { ResourceManagement } from "../../lib/features/shipSystemsSlice";

interface ResourceStatusProps {
  resources: ResourceManagement;
}

export default function ResourceStatus({ resources }: ResourceStatusProps) {
  const { inventory, currentCapacity, maxCapacity, specialSlots } = resources;
  const percent = Math.min(100, (currentCapacity / maxCapacity) * 100);
  const inventoryEntries = Object.entries(inventory);

  return (
    <div className="relative border border-gray-700/40 bg-gray-900/40 p-3 rounded hover:border-gray-600/60 hover:bg-gray-800/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-2 h-2 bg-orange-400 animate-pulse rounded-full" />
        <h4 className="text-sm font-mono text-gray-200 tracking-wide uppercase">Resource Management</h4>
      </div>
      
      {/* Inventory */}
      {inventoryEntries.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Inventory</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {inventoryEntries.map(([res, amt]) => (
              <div key={res} className="group relative border border-gray-700/30 bg-gray-800/20 p-2 rounded hover:border-gray-600/50 transition-all duration-200">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-400 via-orange-500 to-transparent rounded-full opacity-50" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-gray-400 uppercase">{res}</span>
                  <span className="text-sm font-mono text-orange-300">{amt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Storage capacity */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Storage Capacity</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-gray-400">Used Space</span>
          <span className="text-sm font-mono text-green-300">{currentCapacity}/{maxCapacity}</span>
        </div>
        <div className="w-full h-2 bg-gray-700/60 rounded-sm overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              percent < 75 ? 'bg-green-500' : 
              percent < 90 ? 'bg-yellow-400' : 'bg-red-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="text-xs font-mono text-gray-500">{percent.toFixed(1)}% Utilized</div>
      </div>
      
      {/* Special slots */}
      {Object.entries(specialSlots).map(([slot, info]) => {
        const usedPct = Math.min(100, (info.used / info.capacity) * 100);
        return (
          <div key={slot} className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                {slot.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-400">Slots</span>
              <span className="text-sm font-mono text-blue-300">{info.used}/{info.capacity}</span>
            </div>
            <div className="w-full h-2 bg-gray-700/60 rounded-sm overflow-hidden">
              <div 
                className="h-full bg-blue-400 transition-all duration-500"
                style={{ width: `${usedPct}%` }}
              />
            </div>
            <div className="text-xs font-mono text-gray-500">{usedPct.toFixed(0)}% Occupied</div>
          </div>
        );
      })}
      
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