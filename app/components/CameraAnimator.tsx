'use client'

import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { StarData } from '../data/starData'
import { useAppSelector } from '../lib/hooks'

interface CameraAnimatorProps {

}

// Easing function for smooth animation
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export const CameraAnimator: React.FC<CameraAnimatorProps> = () => {
  const { camera, controls, viewport } = useThree()
  const { position } = useAppSelector(state => state.camera)
  const previousPosition = useRef<Vector3>(new Vector3())
  const animationRef = useRef<{
    isAnimating: boolean;
    startPosition: Vector3;
    targetPosition: Vector3;
    startTime: number;
    duration: number;
  } | null>(null)

  useEffect(() => {
    const currentPosition = previousPosition.current.clone()
    const targetPosition = new Vector3(position.x, position.y, position.z)

    // 현재 위치와 타겟 위치가 다를 때만 애니메이션 시작
    if (currentPosition.distanceTo(targetPosition) > 0.1) {
      animationRef.current = {
        isAnimating: true,
        startPosition: currentPosition,
        targetPosition,
        startTime: Date.now(),
        duration: 3000
      }
      previousPosition.current.copy(targetPosition)
    }
  }, [position, camera])

  useFrame(() => {
    if (!animationRef.current || !animationRef.current.isAnimating) return

    const now = Date.now()
    const elapsed = now - animationRef.current.startTime
    const progress = Math.min(elapsed / animationRef.current.duration, 1)

    if (progress >= 1) {
      // 애니메이션 완료
      camera.lookAt(animationRef.current.targetPosition)
      animationRef.current.isAnimating = false
      
      // 컨트롤이 있다면 타겟도 업데이트
      if (controls && typeof controls === 'object' && controls !== null) {
        const controlsObj = controls as any
        console.log('CameraAnimator: Updating controls target', animationRef.current.targetPosition)
        if ('target' in controlsObj && 'update' in controlsObj) {
          controlsObj.target.copy(animationRef.current.targetPosition)
          controlsObj.update(1)
        }
      }
    } else {
      // 애니메이션 진행 중
      const easedProgress = easeInOutCubic(progress)
      const currentPos = animationRef.current.startPosition.clone().lerp(
        animationRef.current.targetPosition,
        easedProgress
      )
      
      camera.lookAt(currentPos)
      
      // 컨트롤이 있다면 업데이트
      if (controls && typeof controls === 'object' && controls !== null) {
        const controlsObj = controls as any
        if ('update' in controlsObj) {
          controlsObj.target.copy(currentPos)
          controlsObj.update()
        }
      }
    }
  })

  return null
} 