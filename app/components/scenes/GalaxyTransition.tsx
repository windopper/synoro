'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Group } from 'three'
import { StarData } from '../../data/starData'
import Star from './Star'
import { PlanetSystem } from '../PlanetSystem'
import { PlanetData } from '../../data/planetData'
import { StarConnections } from './StarConnections'

interface GalaxyTransitionProps {
  currentStar: StarData | null
  allStars: StarData[]
  onAnimationStart?: () => void
  onAnimationComplete?: () => void
  onStarHover?: (star: StarData | null, position: { x: number; y: number }) => void
  onStarClick?: (star: StarData, position: { x: number; y: number }) => void
  onPlanetHover?: (planet: PlanetData | null, position: { x: number; y: number }) => void
  onPlanetClick?: (planet: PlanetData) => void
}

export const GalaxyTransition: React.FC<GalaxyTransitionProps> = ({
  currentStar,
  allStars,
  onAnimationStart,
  onAnimationComplete,
  onStarHover,
  onStarClick,
  onPlanetHover,
  onPlanetClick
}) => {
  const groupRef = useRef<Group>(null)
  const { camera } = useThree()
  
  // 애니메이션 상태
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'fade-out-planets' | 'zoom-out' | 'fade-in-stars' | 'complete'>('idle')
  const [planetFadeProgress, setPlanetFadeProgress] = useState(1) // 1 = 행성 보임, 0 = 행성 숨김
  const [zoomProgress, setZoomProgress] = useState(0) // 0 = 현재 위치, 1 = 갤럭시 뷰 위치
  const [starFadeProgress, setStarFadeProgress] = useState(0) // 0 = 별들 숨김, 1 = 별들 보임
  
  // 카메라 애니메이션 변수
  const [initialCameraPosition] = useState(() => camera.position.clone())
  const [targetCameraPosition] = useState(() => new Vector3(0, 0, 50)) // 갤럭시 뷰 기본 위치
  
  // 애니메이션 시작
  useEffect(() => {
    if (currentStar && animationPhase === 'idle') {
      setAnimationPhase('fade-out-planets')
      onAnimationStart?.()
    }
  }, [currentStar, animationPhase, onAnimationStart])

  // 애니메이션 진행
  useFrame((state, delta) => {
    if (animationPhase === 'idle' || !currentStar) return

    const animationSpeed = 2.5 // 애니메이션 속도 조절

    switch (animationPhase) {
      case 'fade-out-planets':
        // 1단계: 행성계 페이드 아웃
        setPlanetFadeProgress(prev => {
          const newProgress = Math.max(0, prev - delta * animationSpeed)
          if (newProgress <= 0) {
            setAnimationPhase('zoom-out')
          }
          return newProgress
        })
        break

      case 'zoom-out':
        // 2단계: 갤럭시 뷰로 줌 아웃
        setZoomProgress(prev => {
          const newProgress = Math.min(1, prev + delta * animationSpeed * 0.8) // 조금 더 천천히
          
          // 카메라 위치 보간
          const currentPos = new Vector3().lerpVectors(
            initialCameraPosition,
            targetCameraPosition,
            easeInOutCubic(newProgress)
          )
          camera.position.copy(currentPos)
          
          // 카메라가 원점을 바라보도록 설정
          camera.lookAt(0, 0, 0)
          
          if (newProgress >= 1) {
            setAnimationPhase('fade-in-stars')
          }
          return newProgress
        })
        break

      case 'fade-in-stars':
        // 3단계: 별들 페이드 인
        setStarFadeProgress(prev => {
          const newProgress = Math.min(1, prev + delta * animationSpeed * 1.2) // 조금 더 빠르게
          
          if (newProgress >= 1) {
            setAnimationPhase('complete')
            onAnimationComplete?.()
          }
          return newProgress
        })
        break
    }
  })

  // 애니메이션 리셋
  useEffect(() => {
    if (!currentStar) {
      setAnimationPhase('idle')
      setPlanetFadeProgress(1)
      setZoomProgress(0)
      setStarFadeProgress(0)
    }
  }, [currentStar])

  // Easing 함수
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  return (
    <group ref={groupRef}>
      {/* 행성계 렌더링 (페이드 아웃 애니메이션 적용) */}
      {currentStar && (animationPhase === 'fade-out-planets' || animationPhase === 'idle') && (
        <PlanetSystem
          star={currentStar}
          onPlanetHover={onPlanetHover}
          onPlanetClick={onPlanetClick}
          opacity={planetFadeProgress}
        />
      )}

      {/* 별들 렌더링 (페이드 인 애니메이션 적용) */}
      {(animationPhase === 'fade-in-stars' || animationPhase === 'complete') && allStars.map((star) => (
        <Star
          key={star.id}
          star={star}
          opacity={starFadeProgress}          onHover={animationPhase === 'complete' ? (onStarHover || (() => {})) : () => {}} // 애니메이션 완료 후에만 호버 활성화
          onClick={animationPhase === 'complete' ? (onStarClick || (() => {})) : () => {}} // 애니메이션 완료 후에만 클릭 활성화
        />
      ))}

      {/* 별들 간의 연결선 (애니메이션 완료 후에만 표시) */}
      {animationPhase === 'complete' && (
        <StarConnections 
          stars={allStars} 
          opacity={starFadeProgress}
        />
      )}
    </group>
  )
}
