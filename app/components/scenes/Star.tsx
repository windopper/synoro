"use client";

import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
  useEffect,
} from "react";
import { Mesh, Color, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { StarData } from "../../data/starData";
import { MeshReflectorMaterial, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

interface StarProps {
  star: StarData;
  onClick?: (star: StarData, position: { x: number; y: number }) => void;
  opacity?: number;
}

const sphereGeometry = new THREE.SphereGeometry(1, 4, 4);
const sphereMaterial = new THREE.MeshStandardMaterial({
  emissive: 'lightgreen',
  emissiveIntensity: 1,
  opacity: 1,
  toneMapped: false,
  wireframe: true,
});

const Star: React.FC<StarProps> = React.memo(
  ({ star, onClick, opacity = 1 }) => {
    const meshRef = useRef<Mesh>(null);
    const { gl } = useThree();
    const [scannedEffect, setScannedEffect] = useState(false);
    const scanStartTime = useRef(0);

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

    const starSize = useMemo(() => {
      // Simplified size calculation
      const baseSizeFromMagnitude = Math.max(
        0.35,
        1.5 - star.apparentMagnitude * 0.2
      );
      return baseSizeFromMagnitude * star.size * 0.8; // Smaller overall size
    }, [star.apparentMagnitude, star.size]);

    // 스캔 효과가 활성화된 경우
    if (scannedEffect) {
      return (
        <group position={[star.position.x, star.position.y, star.position.z]}>
          <instancedMesh args={[sphereGeometry, sphereMaterial, 1]} />
        </group>
      );
    }

    return (
      <group position={[star.position.x, star.position.y, star.position.z]}>
        {/* Main star sphere - simplified geometry */}
        <sprite
          ref={meshRef}
          onClick={handleClick}
          scale={1} // Reduced scale effect
        >
          <dodecahedronGeometry args={[0.5, 1]} />
          {/* <meshStandardMaterial
            emissive={star.color}
            emissiveIntensity={1}
            opacity={1}
            toneMapped={false}
          /> */}
          <spriteMaterial
            color={star.color}
            opacity={1}
            toneMapped={false}
            transparent={true}
          />
        </sprite>
      </group>
    );
  }
);

Star.displayName = "Star";

export default memo(Star);
