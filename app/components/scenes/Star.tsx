"use client";

import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
  useEffect,
} from "react";
import { Mesh, Color, Vector3, Sprite, SpriteMaterial, Group } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { StarData } from "../../data/starData";
import * as THREE from "three";
import { updateMeshScaleForMinScreenSize, updateStarSparkle } from "@/app/utils/mesh";

interface StarProps {
  star: StarData;
  onClick?: (star: StarData, position: { x: number; y: number }) => void;
  opacity?: number;
}

const sphereMaterial = new THREE.MeshStandardMaterial({
  emissive: "lightgreen",
  emissiveIntensity: 1,
  opacity: 1,
  toneMapped: false,
  wireframe: true,
});

const Star: React.FC<StarProps> = React.memo(
  ({ star, onClick, opacity = 1 }) => {
    const meshRef = useRef<Mesh>(null);
    const sparkleRef = useRef<Sprite>(null);
    const groupRef = useRef<Group>(null);
    const { gl, camera } = useThree();
    const [scannedEffect, setScannedEffect] = useState(false);
    const scanStartTime = useRef(0);

    const starSize = star.size * 0.01;

    const sphereGeometry = new THREE.SphereGeometry(starSize, 4, 4);

    useFrame(() => {
      if (meshRef.current) {
        updateMeshScaleForMinScreenSize(meshRef.current, camera as THREE.PerspectiveCamera, gl, 1);
        updateStarSparkle(
          groupRef.current as THREE.Object3D,
          meshRef.current as THREE.Mesh,
          camera as THREE.PerspectiveCamera,
          10
        );
      }

      if (groupRef.current && groupRef.current.userData?.sparkleSprite) {
        updateMeshScaleForMinScreenSize(groupRef.current.userData.sparkleSprite, camera as THREE.PerspectiveCamera, gl, 20);
      }
    });

    useEffect(() => {
      if (star.isScanned) {
        setScannedEffect(true);
        scanStartTime.current = Date.now();
        const timeout = setTimeout(() => {
          setScannedEffect(false);
        }, 3000); // 3초로 연장
        return () => clearTimeout(timeout);
      }
    }, [star.isScanned]);

    const handleClick = useCallback(
      (event: any) => {
        event.stopPropagation();

        // Get mouse position from the click event
        const rect = gl.domElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        onClick?.(star, { x, y });
      },
      [star, onClick, gl]
    );

    // 스캔 효과가 활성화된 경우
    if (scannedEffect) {
      return (
        <group position={[star.position.x, star.position.y, star.position.z]}>
          <instancedMesh args={[sphereGeometry, sphereMaterial, 1]} />
        </group>
      );
    }

    return (
      <group
        position={[star.position.x, star.position.y, star.position.z]}
        onClick={handleClick}
        ref={groupRef}
      >
        <mesh ref={meshRef}>
          {/* Main star sphere - simplified geometry */}
          <dodecahedronGeometry args={[starSize, 1]} />
          <meshPhongMaterial
            emissive={star.color}
            emissiveIntensity={1}
            color={star.color}
            opacity={opacity}
            toneMapped={false}
            transparent={true}
          />
        </mesh>
      </group>
    );
  }
);

Star.displayName = "Star";

export default memo(Star);
