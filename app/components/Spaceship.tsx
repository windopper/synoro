'use client'

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { useAppSelector } from '../lib/hooks'

export const Spaceship: React.FC = () => {
  const meshRef = useRef<Mesh>(null)
  const spaceship = useAppSelector(state => state.shipSystems)

  // 함선을 회전시켜 동적인 느낌을 줍니다
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.z += 0.005
    }
  })

  if (!spaceship.currentStarId) {
    return null
  }

  return (
    <mesh
      ref={meshRef}
      position={[
        spaceship.position.x + 2, // 별 옆에 위치
        spaceship.position.y + 1,
        spaceship.position.z + 1
      ]}
      scale={[0.5, 0.5, 0.5]}
    >
      {/* 간단한 함선 모양 */}
      <coneGeometry args={[0.3, 1, 6]} />
      <meshStandardMaterial 
        color="#00ff88" 
        emissive="#004422"
        emissiveIntensity={0.3}
      />
      
      {/* 함선 주변의 빛나는 효과 */}
      <pointLight
        color="#00ff88"
        intensity={0.5}
        distance={10}
        decay={2}
      />
    </mesh>
  )
} 