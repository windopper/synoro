"use client";
import { StarData } from "@/app/data/starData";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import { useAppSelector } from "@/app/lib/hooks";
import { CameraControls } from "@react-three/drei";

// Camera controller with position-based zoom and WASD movement
export function CameraController({
  showPlanetSystem,
  selectedStar,
  cameraControlsRef,
  }: {
  showPlanetSystem: boolean;
  selectedStar: StarData | null;
  cameraControlsRef: React.RefObject<CameraControls>;
}) {
  const { camera } = useThree();
  const keysPressed = useRef<Set<string>>(new Set());
  const shipPosition = useAppSelector(state => state.shipSystems.position);
  const { navigation } = useAppSelector(state => state.shipSystems);
  const [isNavigating, setIsNavigating] = useState(false);

  // useEffect(() => {
  //   if (navigation && !isNavigating) {
  //     console.log("navigation", navigation);
  //     const position = navigation.targetPosition;
  //     if (cameraControlsRef.current) {
  //       cameraControlsRef.current.setLookAt(
  //         position.x,
  //         position.y,
  //         position.z,
  //         shipPosition.x,
  //         shipPosition.y,
  //         shipPosition.z,
  //         true
  //       );
  //       setIsNavigating(true);
  //     }
  //   }

  //   if (!navigation && isNavigating) {
  //     if (cameraControlsRef.current) {
  //       cameraControlsRef.current.setTarget(shipPosition.x, shipPosition.y, shipPosition.z, true);
  //       setIsNavigating(false);
  //     }
  //   }
  // }, [navigation, isNavigating]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      console.log("key", key);
      if ([" "].includes(key)) {
        keysPressed.current.add(key);
        event.preventDefault();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ([" "].includes(key)) {
        keysPressed.current.delete(key);
        event.preventDefault();
      }
    };

    // Add event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [camera, showPlanetSystem, selectedStar]);

  // Handle continuous movement with useFrame
  useFrame((state, delta) => {
    if (keysPressed.current.size === 0) return;

    // 스페이스바 누르면 본래 위치로 이동
    if (keysPressed.current.has(" ")) {
      if (cameraControlsRef.current) {
        cameraControlsRef.current.setTarget(shipPosition.x, shipPosition.y, shipPosition.z);
      }
    }
  });

  return null;
}
