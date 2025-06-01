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
      {/* 중심 별 확대 렌더링 - 더 현실적인 디자인 */}
      <mesh position={starPosition}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial
          color={star.color}
          emissive={star.color}
          emissiveIntensity={0.4 * opacity}
          roughness={0}
          metalness={0}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>

      {/* 별 코로나 효과 */}
      <mesh position={starPosition}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial
          color={star.color}
          transparent
          opacity={0.15 * opacity}
        />
      </mesh>

      {/* 별 외부 글로우 */}
      <mesh position={starPosition}>
        <sphereGeometry args={[4.5, 16, 16]} />
        <meshBasicMaterial
          color={star.color}
          transparent
          opacity={0.05 * opacity}
        />
      </mesh>      {/* 행성들 */}
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
      })}      {/* 생명체 거주 가능 영역 - 더 우아한 디자인 */}
      <group>
        {/* 내부 거주 가능 영역 경계 */}
        <mesh position={starPosition} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[7.8, 8.2, 128]} />
          <meshBasicMaterial 
            color="#00ff99" 
            transparent 
            opacity={0.4 * animationProgress}
            side={2} // DoubleSide
          />
        </mesh>
        
        {/* 외부 거주 가능 영역 경계 */}
        <mesh position={starPosition} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[17.8, 18.2, 128]} />
          <meshBasicMaterial 
            color="#00ff99" 
            transparent 
            opacity={0.4 * animationProgress}
            side={2} // DoubleSide
          />
        </mesh>

        {/* 거주 가능 영역 배경 (매우 미세한 효과) */}
        <mesh position={starPosition} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[8, 18, 64]} />
          <meshBasicMaterial 
            color="#00ff99" 
            transparent 
            opacity={0.03 * animationProgress}
            side={2} // DoubleSide
          />
        </mesh>

        {/* 거주 가능 영역 중간선 (선택사항) */}
        <mesh position={starPosition} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[12.9, 13.1, 64]} />
          <meshBasicMaterial 
            color="#00ff99" 
            transparent 
            opacity={0.2 * animationProgress}
          />
        </mesh>
      </group>
      
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