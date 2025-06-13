'use client'

import React, { useMemo } from 'react'
import { Planet } from './Planet'
import { PlanetData, PlanetSystemData, generatePlanetSystem } from '../data/planetData'
import { StarData } from '../data/starData'

interface PlanetSystemProps {
  star: StarData;
  onPlanetHover?: (planet: PlanetData | null, position: { x: number; y: number }) => void;
  onPlanetClick?: (planet: PlanetData) => void;
  animationProgress?: number;
  opacity?: number;
}

export const PlanetSystem: React.FC<PlanetSystemProps> = ({
  star,
  onPlanetHover,
  onPlanetClick,
  animationProgress = 1,
  opacity = 1
}) => {
  // 행성계 생성 (별마다 고유한 시드로 일관성 있게 생성)
  const planetSystem = useMemo(() => {
    return generatePlanetSystem(star.name, star.id)
  }, [star.id, star.name])

  const starPosition: [number, number, number] = [
    star.position.x,
    star.position.y,
    star.position.z
  ]
  return (
    <group>
      {/* 행성들 */}
      {planetSystem.planets.map((planet, index) => {
        // 각 행성이 순차적으로 나타나도록 지연 적용
        const planetDelay = index * 0.1
        const planetOpacity = Math.max(0, Math.min(1, (animationProgress - planetDelay) * 2)) * opacity
        
        return planetOpacity > 0 ? (
          <Planet
            key={planet.id}
            planet={planet}
            starPosition={starPosition}
            onHover={onPlanetHover}
            onClick={onPlanetClick}
            opacity={planetOpacity}
          />
        ) : null
      })}      
      {/* 생명체 거주 가능 영역 - 더 우아한 디자인 */}
      
      {/* 별빛 조명 효과 */}
      <pointLight 
        position={starPosition} 
        color={star.color}
        intensity={2}
        distance={50}
        decay={2}
      />
      
      {/* 주변 조명 */}
      <ambientLight intensity={0.1} />
    </group>
  )
} 