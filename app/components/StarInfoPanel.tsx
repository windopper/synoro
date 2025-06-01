'use client'

import React from 'react'
import { StarData } from '../data/starData'

interface StarInfoPanelProps {
  star: StarData
  onClose: () => void
}

export const StarInfoPanel: React.FC<StarInfoPanelProps> = ({ star, onClose }) => {
  return (
    <div className="absolute top-4 right-4 z-10 max-w-sm">
      <div className="bg-black/90 backdrop-blur-sm rounded-xl p-4 text-white border border-gray-700">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold">{star.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400">Constellation:</span>
              <div className="text-blue-300">
                {star.constellation}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Spectral Class:</span>
              <div className="text-purple-300">
                {star.spectralClass}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400">Size:</span>
              <div className="text-blue-300">
                {star.size}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Distance:</span>
              <div className="text-purple-300">
                {star.distance}
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-700">
            <p className="text-gray-300 leading-relaxed">
              {star.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
