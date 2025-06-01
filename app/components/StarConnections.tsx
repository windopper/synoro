'use client'

import React, { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { useAppSelector } from '../lib/hooks'
import { StarData } from '../data/starData'

interface StarConnectionsProps {
  stars: StarData[]
  opacity?: number
}

export const StarConnections: React.FC<StarConnectionsProps> = ({ stars, opacity = 1 }) => {
  const spaceship = useAppSelector(state => state.shipSystems)
  const starConnections = useAppSelector(state => state.starSystem.starConnections)

  // 별 ID로 별 데이터 찾기
  const getStarById = (id: string) => stars.find(star => star.id === id)

  if (!spaceship.currentStarId || starConnections.length === 0) {
    return null
  }

  return (
    <group>
      {starConnections.map((connection, index) => {
        const fromStar = getStarById(connection.fromStarId)
        const toStar = getStarById(connection.toStarId)
        
        if (!fromStar || !toStar) return null

        const points = [
          new THREE.Vector3(fromStar.position.x, fromStar.position.y, fromStar.position.z),
          new THREE.Vector3(toStar.position.x, toStar.position.y, toStar.position.z)
        ]

        return (
          <Line
            key={`${connection.fromStarId}-${connection.toStarId}-${index}`}
            points={points}
            color="#4a90e2"
            lineWidth={1}
            opacity={0.3 * opacity}
            transparent
            dashed
            dashSize={0.5}
            gapSize={0.3}
          />
        )
      })}
    </group>
  )
} 