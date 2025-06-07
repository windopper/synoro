"use client";
import { StarData } from "@/app/data/starData";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useAppSelector } from "@/app/lib/hooks";

// Camera controller with position-based zoom and WASD movement
export function CameraController({
  showPlanetSystem,
  selectedStar,
}: {
  showPlanetSystem: boolean;
  selectedStar: StarData | null;
}) {
  const { camera, controls } = useThree();
  const keysPressed = useRef<Set<string>>(new Set());
  const shipPosition = useAppSelector(state => state.shipSystems.position);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (showPlanetSystem && selectedStar) {
        // In planet system mode: move toward/away from the target star
        const target = new THREE.Vector3(
          selectedStar.position.x,
          selectedStar.position.y,
          selectedStar.position.z
        );
        const direction = target.clone().sub(camera.position).normalize();

        const zoomSpeed = 1.5;
        const moveDistance = event.deltaY > 0 ? -zoomSpeed : zoomSpeed;

        const newPosition = camera.position.clone();
        newPosition.addScaledVector(direction, moveDistance);

        // Apply planet system distance limits
        const distanceToTarget = newPosition.distanceTo(target);
        const minDistance = 20;
        const maxDistance = 150;

        if (
          distanceToTarget >= minDistance &&
          distanceToTarget <= maxDistance
        ) {
          camera.position.copy(newPosition);
        }
      } else {
        // In galaxy mode: move along camera's forward direction
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        const zoomSpeed = 2;
        const moveDistance = event.deltaY > 0 ? zoomSpeed : -zoomSpeed;

        const newPosition = camera.position.clone();
        newPosition.addScaledVector(direction, moveDistance);

        // Apply galaxy mode distance limits
        const minDistance = 1;
        const maxDistance = 1000;
        const distanceFromOrigin = newPosition.length();

        if (
          distanceFromOrigin >= minDistance &&
          distanceFromOrigin <= maxDistance
        ) {
          camera.position.copy(newPosition);
        }
      }
    };

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
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      if (canvas) {
        canvas.removeEventListener("wheel", handleWheel);
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [camera, showPlanetSystem, selectedStar]);

  // Handle continuous movement with useFrame
  useFrame((state, delta) => {
    if (keysPressed.current.size === 0) return;

    const moveSpeed = showPlanetSystem ? 1.5 : 3;
    const moveDelta = moveSpeed * delta * 60; // Normalize for 60fps

    // Get camera directions
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    const movement = new THREE.Vector3();

    // Calculate movement based on pressed keys
    if (keysPressed.current.has("w")) {
      movement.add(forward.clone().multiplyScalar(moveDelta));
    }
    if (keysPressed.current.has("s")) {
      movement.add(forward.clone().multiplyScalar(-moveDelta));
    }
    if (keysPressed.current.has("a")) {
      movement.add(right.clone().multiplyScalar(-moveDelta));
    }
    if (keysPressed.current.has("d")) {
      movement.add(right.clone().multiplyScalar(moveDelta));
    }

    // 스페이스바 누르면 본래 위치로 이동
    if (keysPressed.current.has(" ")) {
      if (controls && "target" in controls && "update" in controls) {
        (controls.target as THREE.Vector3).set(shipPosition.x, shipPosition.y, shipPosition.z);
        (controls as any).update(1);
      }
    }

    if (movement.length() > 0) {
      const newPosition = camera.position.clone().add(movement);

      if (showPlanetSystem && selectedStar) {
        // Apply planet system distance limits
        const target = new THREE.Vector3(
          selectedStar.position.x,
          selectedStar.position.y,
          selectedStar.position.z
        );
        const distanceToTarget = newPosition.distanceTo(target);
        const minDistance = 20;
        const maxDistance = 150;

        if (
          distanceToTarget >= minDistance &&
          distanceToTarget <= maxDistance
        ) {
          camera.position.copy(newPosition);
        }
      } else {
        // Apply galaxy mode distance limits
        const minDistance = 1;
        const maxDistance = 1000;
        const distanceFromOrigin = newPosition.length();

        if (
          distanceFromOrigin >= minDistance &&
          distanceFromOrigin <= maxDistance
        ) {
          camera.position.copy(newPosition);
        }
      }
    }
  });

  return null;
}
