'use client'

import React, { memo, useCallback, useState } from 'react'
import { Ship, Rocket, Info, Zap, ArrowLeft, Plane, Gauge } from 'lucide-react'
import { StarData } from '../../data/starData'

interface StarMenuProps {
  showMenu: boolean
  star: StarData | null
  position: { x: number; y: number }
  onClose: () => void
  onNavigateToStarWarp: () => void
  onNavigateToStarNormal: () => void
  onNavigateToSystem: () => void
  onViewStarInfo: () => void
  onExtractResources: () => void
}

const StarMenu: React.FC<StarMenuProps> = ({
  showMenu,
  star,
  position,
  onClose,
  onNavigateToStarWarp,
  onNavigateToStarNormal,
  onNavigateToSystem,
  onViewStarInfo,
  onExtractResources,
}) => {
  const [showShipMenu, setShowShipMenu] = useState(false)

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

  const handleShipButtonClick = () => {
    setShowShipMenu(true)
  }

  const handleBackToMain = () => {
    setShowShipMenu(false)
  }

  const handleNormalMovement = () => {
    onNavigateToStarNormal()
    handleBackToMain()
    onClose()
  }

  const handleWarpMovement = () => {
    onNavigateToStarWarp()
    handleBackToMain()
    onClose()
  }

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
            {star.isVisible ? star.name : "???"}
          </div>

          {star.isVisible ? (
            !showShipMenu ? (
              <>
                {/* Main menu buttons */}
                <div className="flex flex-row gap-1">
                  <button
                    onClick={handleShipButtonClick}
                    className="w-full px-1.5 py-1.5 bg-zinc-900/80 hover:bg-zinc-800/90 border border-gray-700/30 hover:border-gray-600/50 text-gray-200 text-xs rounded transition-colors flex items-center justify-center"
                  >
                    <Ship className="w-3 h-3" />
                  </button>

                  <button
                    onClick={onNavigateToSystem}
                    className="w-full px-1.5 py-1.5 bg-zinc-900/80 hover:bg-zinc-800/90 border border-gray-700/30 hover:border-gray-600/50 text-gray-200 text-xs rounded transition-colors flex items-center justify-center"
                  >
                    <Rocket className="w-3 h-3" />
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
                  </button>

                  <button
                    onClick={onViewStarInfo}
                    className="w-full px-1.5 py-1.5 bg-zinc-900/80 hover:bg-zinc-800/90 border border-gray-700/30 hover:border-gray-600/50 text-gray-200 text-xs rounded transition-colors flex items-center justify-center"
                  >
                    <Info className="w-3 h-3" />
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
              </>
            ) : (
              <>
                {/* Ship movement submenu */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={handleBackToMain}
                    className="p-1 hover:bg-zinc-800/50 rounded transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3 text-gray-400" />
                  </button>
                  <span className="text-xs text-gray-300 font-medium">함선 이동 방식 선택</span>
                </div>

                <div className="space-y-2">
                  {/* Normal Movement */}
                  <button
                    onClick={handleNormalMovement}
                    className="w-full p-3 bg-gradient-to-r from-blue-900/40 to-blue-800/40 hover:from-blue-800/50 hover:to-blue-700/50 border border-blue-700/30 hover:border-blue-600/50 text-blue-100 text-xs rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-800/40 rounded-lg">
                        <Plane className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">기본 이동</div>
                        <div className="text-xs text-blue-200/80">일반 속도로 이동</div>
                      </div>
                    </div>
                  </button>

                  {/* Warp Movement */}
                  <button
                    onClick={handleWarpMovement}
                    className="w-full p-3 bg-gradient-to-r from-purple-900/40 to-purple-800/40 hover:from-purple-800/50 hover:to-purple-700/50 border border-purple-700/30 hover:border-purple-600/50 text-purple-100 text-xs rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-800/40 rounded-lg">
                        <Gauge className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">워프 이동</div>
                        <div className="text-xs text-purple-200/80">고속 워프 드라이브</div>
                      </div>
                    </div>
                  </button>
                </div>
              </>
            )
          ) : (
            /* 비가시 별의 경우 표시되는 내용 */
            <>
              <div className="text-center py-8">
                <div className="text-2xl text-gray-500 mb-2">???</div>
                <div className="text-xs text-gray-400">
                  미탐지된 천체입니다
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  더 가까이 접근하여 탐지해 보세요
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-800/60">
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Constellation:</span>
                    <span className="text-gray-500">???</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="text-gray-500">???</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Magnitude:</span>
                    <span className="text-gray-500">???</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default memo(StarMenu)  