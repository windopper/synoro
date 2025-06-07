'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Group, Object3D } from 'three'
import { StarData } from '../../data/starData'
import Star from './Star'
import { PlanetSystem } from '../PlanetSystem'
import { PlanetData } from '../../data/planetData'

interface StarSystemTransitionProps {
  targetStar: StarData | null
  allStars: StarData[]
  onAnimationStart?: () => void
  onAnimationComplete?: () => void
  onPlanetHover?: (planet: PlanetData | null, position: { x: number; y: number }) => void
  onPlanetClick?: (planet: PlanetData) => void
}

export const StarSystemTransition: React.FC<StarSystemTransitionProps> = ({
  targetStar,
  allStars,
  onAnimationStart,
  onAnimationComplete,
  onPlanetHover,
  onPlanetClick
}) => {
  const groupRef = useRef<Group>(null)
  const { camera } = useThree()
  
  // 애니메이션 상태
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'fade-out' | 'zoom-in' | 'show-planets' | 'complete'>('idle')
  const [fadeProgress, setFadeProgress] = useState(1) // 1 = 완전히 보임, 0 = 완전히 투명
  const [zoomProgress, setZoomProgress] = useState(0) // 0 = 시작 위치, 1 = 목표 위치
  const [planetProgress, setPlanetProgress] = useState(0) // 0 = 행성 궤도 숨김, 1 = 행성 궤도 보임
  
  // 카메라 애니메이션 변수
  const [initialCameraPosition] = useState(() => camera.position.clone())
  const [targetCameraPosition] = useState(() => new Vector3())
  
  // 애니메이션 시작
  useEffect(() => {
    if (targetStar && animationPhase === 'idle') {
      // 목표 카메라 위치 설정 (항성에서 적당한 거리)
      targetCameraPosition.set(
        targetStar.position.x,
        targetStar.position.y + 5,
        targetStar.position.z + 15
      )
      
      setAnimationPhase('fade-out')
      onAnimationStart?.()
    }
  }, [targetStar, animationPhase, onAnimationStart, targetCameraPosition])

  // 애니메이션 진행
  useFrame((state, delta) => {
    if (animationPhase === 'idle' || !targetStar) return

    const animationSpeed = 2 // 애니메이션 속도 조절

    switch (animationPhase) {
      case 'fade-out':
        // 1단계: 다른 별들 페이드 아웃
        setFadeProgress(prev => {
          const newProgress = Math.max(0, prev - delta * animationSpeed)
          if (newProgress <= 0) {
            setAnimationPhase('zoom-in')
          }
          return newProgress
        })
        break

      case 'zoom-in':
        // 2단계: 목표 별로 줌인
        setZoomProgress(prev => {
          const newProgress = Math.min(1, prev + delta * animationSpeed)
          
          // 카메라 위치 보간
          const currentPos = new Vector3().lerpVectors(
            initialCameraPosition,
            targetCameraPosition,
            easeInOutCubic(newProgress)
          )
          camera.position.copy(currentPos)
          
          // 카메라가 항성을 바라보도록 설정
          camera.lookAt(targetStar.position.x, targetStar.position.y, targetStar.position.z)
          
          if (newProgress >= 1) {
            setAnimationPhase('show-planets')
          }
          return newProgress
        })
        break

      case 'show-planets':
        // 3단계: 행성 궤도 나타나기
        setPlanetProgress(prev => {
          const newProgress = Math.min(1, prev + delta * animationSpeed * 0.8) // 조금 더 천천히
          
          if (newProgress >= 1) {
            setAnimationPhase('complete')
            onAnimationComplete?.()
          }
          return newProgress
        })
        break
    }
  })

  // 애니메이션 리셋 (targetStar가 null이 되면)
  useEffect(() => {
    if (!targetStar) {
      setAnimationPhase('idle')
      setFadeProgress(1)
      setZoomProgress(0)
      setPlanetProgress(0)
    }
  }, [targetStar])

  // Easing 함수
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  return (
    <group ref={groupRef}>
      {/* 모든 별들 렌더링 (페이드 아웃 애니메이션 적용) */}
      {animationPhase === 'fade-out' && allStars.map((star) => {
        const isTargetStar = targetStar && star.id === targetStar.id
        
        // 목표 별이 아닌 별들은 페이드 아웃
        const opacity = isTargetStar ? 1 : fadeProgress
        
        return (
          <Star
            key={star.id}
            star={star}
            opacity={opacity}
            onClick={() => {}} // 애니메이션 중에는 클릭 비활성화
          />
        ) 
      })}

      {animationPhase !== "fade-out" && targetStar && (
        <Star
          key={targetStar.id}
          star={targetStar}
          opacity={1}
        />
      )}

      {/* 행성계 렌더링 (애니메이션 완료 후 또는 행성 표시 단계에서) */}
      {targetStar && (animationPhase === 'show-planets' || animationPhase === 'complete') && (
        <PlanetSystem
          star={targetStar}
          onPlanetHover={onPlanetHover}
          onPlanetClick={onPlanetClick}
          animationProgress={planetProgress}
        />
      )}
    </group>
  )
}
