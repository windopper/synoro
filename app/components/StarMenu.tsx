'use client'

import React, { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

export const StarMenu: React.FC<StarMenuProps> = ({
  showMenu,
  star,
  position,
  onClose,
  onMoveSpaceshipTo,
  onNavigateToSystem,
  onViewStarInfo,
  onExtractResources,
}) => {
  // Smart positioning for menu (similar to tooltip)
  const getMenuPosition = useCallback(() => {
    if (!showMenu) return { left: 0, top: 0, arrowPosition: 'left' }
    
    const menuWidth = 280 // Estimated menu width (increased for new design)
    const menuHeight = 280 // Estimated menu height (increased for new design and resource button)
    const offset = 15 // Distance from cursor
    
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    let left = position.x + offset
    let top = position.y - offset
    let arrowPosition = 'left' // Default arrow on left side
    
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

  return (
    <AnimatePresence mode="popLayout">
      {showMenu && star && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-0"
        >
          {/* 메뉴 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black/20"
            onClick={onClose}
          />

          {/* 메뉴 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
              },
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: "fixed",
              left: menuPositionData.left,
              top: menuPositionData.top,
              zIndex: 50,
            }}            className="relative rounded-lg bg-black/90 backdrop-blur-xl border border-gray-800/50 shadow-2xl overflow-hidden"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black/30 pointer-events-none" />
            
            {/* Arrow pointing to the star */}
            <div
              className={`absolute w-2 h-2 bg-black/90 border rotate-45 ${
                menuPositionData.arrowPosition === "left"
                  ? "-left-1 top-6 border-r-0 border-b-0"
                  : menuPositionData.arrowPosition === "right"
                  ? "-right-1 top-6 border-l-0 border-t-0"
                  : menuPositionData.arrowPosition === "top"
                  ? "left-6 -top-1 border-b-0 border-r-0"
                  : "left-6 -bottom-1 border-t-0 border-l-0"
              } border-gray-800/50`}
            />

            <div className="relative px-4 py-3 space-y-3">              {/* Star name */}
              <div className="font-semibold text-white text-base border-b border-gray-800/70 pb-2.5 tracking-wide">
                {star.name}
              </div>              {/* Menu buttons */}
              <div className="space-y-2">                <button
                  onClick={onMoveSpaceshipTo}
                  className="group w-full px-4 py-2.5 bg-gray-800/80 hover:bg-gray-700/90 border border-gray-700/50 hover:border-gray-600 text-white text-sm rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-gray-500/20 hover:scale-[1.02] transform"
                >
                  <Ship className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">함선 이동</span>
                </button>

                <button
                  onClick={onNavigateToSystem}
                  className="group w-full px-4 py-2.5 bg-gray-800/80 hover:bg-gray-700/90 border border-gray-700/50 hover:border-gray-600 text-white text-sm rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-gray-500/20 hover:scale-[1.02] transform"
                >
                  <Rocket className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">항성계로 이동하기</span>
                </button>

                <button
                  onClick={onExtractResources}
                  className={`group w-full px-4 py-2.5 border text-sm rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-gray-500/20 hover:scale-[1.02] transform ${
                    star?.stellarResources 
                      ? 'bg-amber-800/80 hover:bg-amber-700/90 border-amber-700/50 hover:border-amber-600 text-white'
                      : 'bg-gray-700/50 border-gray-600/50 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!star?.stellarResources}
                >
                  <Zap className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">자원 획득</span>
                  {!star?.stellarResources && <span className="text-xs ml-1">(불가능)</span>}
                </button>

                <button
                  onClick={onViewStarInfo}
                  className="group w-full px-4 py-2.5 bg-gray-800/80 hover:bg-gray-700/90 border border-gray-700/50 hover:border-gray-600 text-white text-sm rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-gray-500/20 hover:scale-[1.02] transform"
                >
                  <Info className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">정보 확인</span>
                </button>
              </div>{/* Basic star info (similar to tooltip) */}
              <div className="pt-3 border-t border-gray-800/70">
                <div className="text-sm text-gray-300 space-y-1.5">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-gray-500 font-medium">Constellation:</span>
                    <span className="text-gray-200 font-mono">{star.constellation}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-gray-500 font-medium">Type:</span>
                    <span className="text-gray-200 font-mono">{star.spectralClass}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-gray-500 font-medium">Magnitude:</span>
                    <span className="text-gray-200 font-mono">{star.apparentMagnitude.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
