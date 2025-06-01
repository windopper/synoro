'use client'

import React from 'react'
import { StarData } from '../data/starData'
import { useAppSelector } from '../lib/hooks'

interface StarCountInfoProps {
  stars: StarData[]
  showPlanetSystem: boolean
  selectedStar: StarData | null
  isAnimating: boolean
  allStars: StarData[]
}

export const StarCountInfo: React.FC<StarCountInfoProps> = ({
  stars,
  showPlanetSystem,
  selectedStar,
  isAnimating,
  allStars
}) => {
  const spaceship = useAppSelector(state => state.shipSystems)

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white border border-gray-800">
        {!showPlanetSystem ? (
          <>
            <div className="text-sm font-medium">
              {stars.length} stars rendered
            </div>
            <div className="text-xs text-gray-400">Static View Mode</div>
            {spaceship.currentStarId && (
              <div className="text-xs text-green-400 mt-2 border-t border-gray-700 pt-2">
                <div className="font-medium">함선 위치:</div>
                <div>
                  {allStars.find((s) => s.id === spaceship.currentStarId)
                    ?.name || "Unknown"}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-sm font-medium">Planet System View</div>
            <div className="text-xs text-gray-400">
              Star: {selectedStar?.name}
            </div>
            {isAnimating && (
              <div className="text-xs text-yellow-400">Traveling...</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
