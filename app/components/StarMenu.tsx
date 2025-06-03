'use client'

import React, { memo, useCallback } from 'react'
import { Ship, Rocket, Info, Zap } from 'lucide-react'
import { StarData } from '../data/starData'

interface StarMenuProps {
  showMenu: boolean
  star: StarData | null
  position: { x: number; y: number }
  onClose: () => void
  onMoveSpaceshipTo: () => void
  onNavigateToSystem: () => void
  onViewStarInfo: () => void
  onExtractResources: () => void
}

const StarMenu: React.FC<StarMenuProps> = ({
  showMenu,
  star,
  position,
  onClose,
  onMoveSpaceshipTo,
  onNavigateToSystem,
  onViewStarInfo,
  onExtractResources,
}) => {
  // Smart positioning for menu
  const getMenuPosition = useCallback(() => {
    if (!showMenu) return { left: 0, top: 0, arrowPosition: 'left' }
    
    const menuWidth = 220 // Reduced width for compact design
    const menuHeight = 240 // Reduced height
    const offset = 12
    
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    let left = position.x + offset
    let top = position.y - offset
    let arrowPosition = 'left'
    
    // Adjust horizontal position if menu would go off right edge
    if (left + menuWidth > viewportWidth) {
      left = position.x - menuWidth - offset
      arrowPosition = 'right'
    }
    
    // Adjust vertical position if menu would go off top edge
    if (top < 0) {
      top = position.y + offset
      arrowPosition = top < position.y ? 'top' : arrowPosition
    }
    
    // Adjust vertical position if menu would go off bottom edge
    if (top + menuHeight > viewportHeight) {
      top = position.y - menuHeight - offset
      arrowPosition = 'bottom'
    }
    
    // Ensure menu doesn't go off left edge
    if (left < 0) {
      left = offset
      arrowPosition = 'left'
    }
    
    return { left, top, arrowPosition }
  }, [position, showMenu])

  const menuPositionData = getMenuPosition()

  if (!showMenu || !star) return null

  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 z-20 bg-black/10"
        onClick={onClose}
      />

      {/* Menu */}
      <div
        style={{
          position: "fixed",
          left: menuPositionData.left,
          top: menuPositionData.top,
          zIndex: 50,
        }}
        className="relative w-52 bg-zinc-950/95 backdrop-blur-sm border border-gray-700/40 shadow-xl rounded overflow-hidden"
      >
        {/* Arrow pointing to the star */}
        <div
          className={`absolute w-1.5 h-1.5 bg-zinc-950 border rotate-45 ${
            menuPositionData.arrowPosition === "left"
              ? "-left-0.5 top-4 border-r-0 border-b-0"
              : menuPositionData.arrowPosition === "right"
              ? "-right-0.5 top-4 border-l-0 border-t-0"
              : menuPositionData.arrowPosition === "top"
              ? "left-4 -top-0.5 border-b-0 border-r-0"
              : "left-4 -bottom-0.5 border-t-0 border-l-0"
          } border-gray-700/40`}
        />

        <div className="p-3 space-y-2">
          {/* Star name */}
          <div className="text-xs font-mono text-gray-100 border-b border-gray-800/60 pb-2 truncate">
            {star.name}
          </div>

          {/* Menu buttons */}
          <div className="flex flex-row gap-1">
            <button
              onClick={onMoveSpaceshipTo}
              className="w-full px-1.5 py-1.5 bg-zinc-900/80 hover:bg-zinc-800/90 border border-gray-700/30 hover:border-gray-600/50 text-gray-200 text-xs rounded transition-colors flex items-center justify-center"
            >
              <Ship className="w-3 h-3" />
              {/* <span>함선 이동</span> */}
            </button>

            <button
              onClick={onNavigateToSystem}
              className="w-full px-1.5 py-1.5 bg-zinc-900/80 hover:bg-zinc-800/90 border border-gray-700/30 hover:border-gray-600/50 text-gray-200 text-xs rounded transition-colors flex items-center justify-center"
            >
              <Rocket className="w-3 h-3" />
              {/* <span>항성계로 이동</span> */}
            </button>

            <button
              onClick={onExtractResources}
              className={`w-full px-1.5 py-1.5 border text-xs rounded transition-colors flex items-center justify-center ${
                star?.stellarResources 
                  ? 'bg-amber-900/80 hover:bg-amber-800/90 border-amber-700/40 hover:border-amber-600/60 text-amber-100'
                  : 'bg-gray-800/50 border-gray-700/20 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!star?.stellarResources}
            >
              <Zap className="w-3 h-3" />
              {/* <span>자원 획득{!star?.stellarResources && ' (불가)'}</span> */}
            </button>

            <button
              onClick={onViewStarInfo}
              className="w-full px-1.5 py-1.5 bg-zinc-900/80 hover:bg-zinc-800/90 border border-gray-700/30 hover:border-gray-600/50 text-gray-200 text-xs rounded transition-colors flex items-center justify-center"
            >
              <Info className="w-3 h-3" />
              {/* <span>정보 확인</span> */}
            </button>
          </div>

          {/* Basic star info */}
          <div className="pt-2 border-t border-gray-800/60">
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Constellation:</span>
                <span className="text-gray-300 font-mono text-xs">{star.constellation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="text-gray-300 font-mono text-xs">{star.spectralClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Magnitude:</span>
                <span className="text-gray-300 font-mono text-xs">{star.apparentMagnitude.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(StarMenu)  