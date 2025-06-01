'use client'

import React from 'react'
import { PlanetData } from '../data/planetData'

interface PlanetTooltipProps {
  planet: PlanetData;
  position: { x: number; y: number };
  visible: boolean;
}

export const PlanetTooltip: React.FC<PlanetTooltipProps> = ({
  planet,
  position,
  visible
}) => {
  if (!visible) return null

  const getPlanetTypeIcon = (type: PlanetData['type']) => {
    switch (type) {
      case 'rocky': return '🪨'
      case 'gas_giant': return '🌪️'
      case 'ice_giant': return '❄️'
      case 'dwarf': return '⚫'
      default: return '🪐'
    }
  }

  const getPlanetTypeLabel = (type: PlanetData['type']) => {
    switch (type) {
      case 'rocky': return '암석형 행성'
      case 'gas_giant': return '가스 거인'
      case 'ice_giant': return '얼음 거인'
      case 'dwarf': return '왜소 행성'
      default: return '행성'
    }
  }

  return (
    <div 
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${Math.min(position.x + 15, window.innerWidth - 320)}px`,
        top: `${Math.max(position.y - 10, 10)}px`,
      }}
    >
      <div className="bg-black/90 backdrop-blur-sm border border-purple-500/50 rounded-lg p-3 text-white shadow-lg max-w-xs">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg">{getPlanetTypeIcon(planet.type)}</span>
          <div>
            <h3 className="font-bold text-sm text-blue-300">{planet.name}</h3>
            <p className="text-xs text-gray-400">{getPlanetTypeLabel(planet.type)}</p>
          </div>
        </div>
        
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">크기:</span>
            <span className="text-purple-300">{planet.size.toFixed(2)} 단위</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">궤도 반지름:</span>
            <span className="text-blue-300">{planet.orbitRadius.toFixed(1)} AU</span>
          </div>
          {planet.moons && planet.moons > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400">위성:</span>
              <span className="text-green-300">{planet.moons}개</span>
            </div>
          )}
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-300 leading-relaxed">{planet.description}</p>
        </div>
      </div>
    </div>
  )
} 