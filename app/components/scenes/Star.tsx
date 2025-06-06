"use client";

import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
  useEffect,
} from "react";
import { Mesh } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { StarData } from "../../data/starData";

interface StarProps {
  star: StarData;
  onHover: (star: StarData | null, position: { x: number; y: number }) => void;
  onClick: (star: StarData, position: { x: number; y: number }) => void;
  opacity?: number;
}

const Star: React.FC<StarProps> = React.memo(
  ({ star, onHover, onClick, opacity = 1 }) => {
    const meshRef = useRef<Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    const { camera, gl } = useThree();
    const frameCount = useRef(0);

    // Simplified sparkle effect for performance
    const sparkleGeometry = useMemo(() => {
      if (star.apparentMagnitude >= 2) return null; // Only for bright stars

      const sparkles: number[] = [];
      const count = 8; // Reduced from 20 to 8
      for (let i = 0; i < count; i++) {
        const radius = 0.3 + Math.random() * 0.7; // Smaller radius
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        sparkles.push(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        );
      }
      return new Float32Array(sparkles);
    }, [star.apparentMagnitude]);

    useFrame((state) => {
      if (!meshRef.current) return;

      // Reduce animation frequency
      frameCount.current += 1;
      if (frameCount.current % 3 !== 0) return; // Only animate every 3rd frame

      // Simplified rotation
      meshRef.current.rotation.y += 0.002; // Reduced from 0.005

      // Simplified pulsing for very bright stars only
      if (star.apparentMagnitude < 0) {
        const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.02; // Reduced effect
        meshRef.current.scale.setScalar(scale);
      }

      // Simplified twinkling effect
      const material = meshRef.current.material as any;
      if (
        material.emissiveIntensity !== undefined &&
        star.apparentMagnitude < 1
      ) {
        material.emissiveIntensity =
          0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.1; // Reduced effect
      }
    });

    const handlePointerOver = useCallback(
      (event: any) => {
        event.stopPropagation();
        setHovered(true);
        gl.domElement.style.cursor = "pointer";

        // Get mouse position from the pointer event
        const rect = gl.domElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        onHover(star, { x, y });
      },
      [star, onHover, gl]
    );

    const handlePointerOut = useCallback(
      (event: any) => {
        event.stopPropagation();
        setHovered(false);
        gl.domElement.style.cursor = "default";
        onHover(null, { x: 0, y: 0 });
      },
      [onHover]
    );

    const handleClick = useCallback(
      (event: any) => {
        event.stopPropagation();
        setClicked(true);
        setTimeout(() => setClicked(false), 200);

        // Get mouse position from the click event
        const rect = gl.domElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        onClick(star, { x, y });
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

    const glowIntensity = useMemo(() => {
      // Simplified glow calculation
      return Math.max(0.1, 1.5 - star.apparentMagnitude * 0.3);
    }, [star.apparentMagnitude]);

    return (
      <group position={[star.position.x, star.position.y, star.position.z]}>
        {/* Main star sphere - simplified geometry */}
        <mesh
          ref={meshRef}
          // onPointerOver={handlePointerOver}
          // onPointerOut={handlePointerOut}
          onClick={handleClick}
          scale={hovered ? 1.2 : clicked ? 0.9 : 1} // Reduced scale effect
        >
          <sphereGeometry args={[starSize, 8, 8]} />{" "}
          {/* Reduced from 16,16 to 8,8 */}{" "}
          <meshBasicMaterial
            color={star.color}
            transparent
            opacity={0.9 * opacity}
          />
        </mesh>

        {/* Simplified glow effect - only for bright stars */}
        {star.apparentMagnitude < 3 && (
          <mesh scale={hovered ? 2 : 1.5}>
            <sphereGeometry args={[starSize * 1.3, 6, 6]} />{" "}
            {/* Reduced geometry */}{" "}
            <meshBasicMaterial
              color={star.color}
              transparent
              opacity={(hovered ? 0.2 : 0.08) * opacity}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Sparkle points for very bright stars only */}
        {sparkleGeometry && star.apparentMagnitude < 1 && (
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[sparkleGeometry, 3]}
              />
            </bufferGeometry>{" "}
            <pointsMaterial
              color={star.color}
              size={0.03} // Reduced size
              transparent
              opacity={(hovered ? 0.6 : 0.3) * opacity}
              depthWrite={false}
            />
          </points>
        )}

        {/* Lens flare for extremely bright stars only - simplified */}
        {star.apparentMagnitude < -0.5 && (
          <mesh rotation={[0, 0, Math.PI / 4]} scale={hovered ? 1.5 : 1}>
            <planeGeometry args={[starSize * 2, starSize * 0.1]} />{" "}
            {/* Smaller flare */}{" "}
            <meshBasicMaterial
              color={star.color}
              transparent
              opacity={0.4 * opacity}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    );
  }
);

Star.displayName = "Star";

// memo
export default memo(Star);
