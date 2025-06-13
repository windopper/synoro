import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { StarData } from "@/app/data/starData";
import { PlanetSystem } from "../PlanetSystem";
import Star from "./Star";
import { CameraControls } from "@react-three/drei";
import { useAppSelector } from "@/app/lib/hooks";

interface SynoroSceneTransitionProps {
  allStars: StarData[];
  handleStarClick: (star: StarData, position: { x: number; y: number }) => void;
  cameraControlsRef: React.RefObject<CameraControls>;
}

export const SynoroSceneTransition = ({
  allStars,
  handleStarClick,
  cameraControlsRef,
}: SynoroSceneTransitionProps) => {
  const { gl, camera } = useThree();
  const currentStarId = useAppSelector(state => state.shipSystems.currentStarId)
  const currentStar = useAppSelector(state => state.starSystem.stars.find(star => star.id === currentStarId))
  const groupRef = useRef<Group>(null);
  
  useEffect(() => {
    const handleZoom = (e: { type: "control"; target: CameraControls }) => {
      const targetPosition = new Vector3();
      e.target.getTarget(targetPosition);
      const distance = targetPosition.distanceTo(camera.position);

      console.log("[DEBUG] distance", distance);
    };

    if (cameraControlsRef) {
      cameraControlsRef.current.addEventListener("control", handleZoom as any);
      return () => {
        cameraControlsRef.current?.removeEventListener("control", handleZoom as any);
      };
    }
  }, [cameraControlsRef]);

  return (
    <group ref={groupRef}>
      {currentStar && <PlanetSystem star={currentStar} opacity={1} />}
      {allStars.map((star) => {
        if (star.id === currentStarId) {
          return <Star key={star.id} star={star} opacity={1} onClick={handleStarClick} />
        }
        return <Star key={star.id} star={star} opacity={1} onClick={handleStarClick} />
      })}
    </group>
  )
};
