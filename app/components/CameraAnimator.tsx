'use client'

import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useAppSelector } from '../lib/hooks'
import { CameraControls } from '@react-three/drei'

interface CameraAnimatorProps {
  cameraControlsRef: React.RefObject<CameraControls | null>;
}

export const CameraAnimator: React.FC<CameraAnimatorProps> = ({ cameraControlsRef }) => {
  const { position } = useAppSelector(state => state.camera)
  const previousTarget = useRef<Vector3>(new Vector3())

  useEffect(() => {
    if (!cameraControlsRef || !cameraControlsRef.current) return

    const newTarget = new Vector3(position.x, position.y, position.z)
    
    // 이전 타겟과 새로운 타겟이 다를 때만 애니메이션 시작
    if (previousTarget.current.distanceTo(newTarget) > 0.1) {

      console.log("move to", newTarget);
      const currentCameraPosition = new Vector3()
      cameraControlsRef.current.getPosition(currentCameraPosition)
      // 현재 카메라 위치 가져오기
      cameraControlsRef.current.setLookAt(
        currentCameraPosition.x,
        currentCameraPosition.y,
        currentCameraPosition.z,
        newTarget.x,
        newTarget.y,
        newTarget.z,
        true
      );
      previousTarget.current.copy(newTarget)
    }
  }, [position, cameraControlsRef])

  return null
} 