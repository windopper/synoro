'use client'

import React from "react"
import {
  motion,
  AnimatePresence,
} from "framer-motion"
import { StarData } from "../data/starData"

interface StarTooltipProps {
  star: StarData;
  position: { x: number; y: number };
  visible: boolean;
}

export const StarTooltip: React.FC<StarTooltipProps> = ({ 
  star, 
  position, 
  visible 
}) => {
  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${(distance * 63241).toFixed(0)} AU`
    } else if (distance < 1000) {
      return `${distance.toFixed(1)} ly`
    } else {
      return `${(distance / 1000).toFixed(1)} kly`
    }
  }

  const formatTemperature = (temp: number) => {
    return `${temp.toLocaleString()} K`
  }

  const formatMagnitude = (mag: number) => {
    return mag.toFixed(2)
  }

  // Smart positioning to prevent tooltip from going off-screen
  const getTooltipPosition = () => {
    const tooltipWidth = 200 // Estimated tooltip width
    const tooltipHeight = 120 // Estimated tooltip height
    const offset = 15 // Distance from cursor
    
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    let left = position.x + offset
    let top = position.y - offset
    let arrowPosition = 'left' // Default arrow on left side
    
    // Adjust horizontal position if tooltip would go off right edge
    if (left + tooltipWidth > viewportWidth) {
      left = position.x - tooltipWidth - offset
      arrowPosition = 'right'
    }
    
    // Adjust vertical position if tooltip would go off top edge
    if (top < 0) {
      top = position.y + offset
      arrowPosition = top < position.y ? 'top' : arrowPosition
    }
    
    // Adjust vertical position if tooltip would go off bottom edge
    if (top + tooltipHeight > viewportHeight) {
      top = position.y - tooltipHeight - offset
      arrowPosition = 'bottom'
    }
    
    // Ensure tooltip doesn't go off left edge
    if (left < 0) {
      left = offset
      arrowPosition = 'left'
    }
    
    return { left, top, arrowPosition }
  }

  const tooltipPosition = getTooltipPosition()

  return (
    <AnimatePresence mode="popLayout">
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
            },
          }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: "fixed",
            left: tooltipPosition.left,
            top: tooltipPosition.top,
            zIndex: 50,
            pointerEvents: "none",
          }}
          className="relative rounded-md bg-gray-900/95 backdrop-blur border border-gray-700 shadow-xl"
        >
          {/* Arrow pointing to the star */}
          <div 
            className={`absolute w-2 h-2 bg-gray-900/95 border rotate-45 ${
              tooltipPosition.arrowPosition === 'left' ? '-left-1 top-4 border-r-0 border-b-0' :
              tooltipPosition.arrowPosition === 'right' ? '-right-1 top-4 border-l-0 border-t-0' :
              tooltipPosition.arrowPosition === 'top' ? 'left-4 -top-1 border-b-0 border-r-0' :
              'left-4 -bottom-1 border-t-0 border-l-0'
            } border-gray-700`}
          />
          <div className="px-3 py-2 space-y-1">
            {/* Star name */}
            <div className="font-medium text-white text-sm">
              {star.name}
            </div>
            
            {/* Basic info */}
            <div className="text-xs text-gray-300 space-y-0.5">
              <div className="flex justify-between gap-3">
                <span className="text-gray-400">Magnitude:</span>
                <span>{formatMagnitude(star.apparentMagnitude)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-400">Distance:</span>
                <span>{formatDistance(star.distance)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-400">Type:</span>
                <span>{star.spectralClass}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-400">Temp:</span>
                <span>{formatTemperature(star.temperature)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 