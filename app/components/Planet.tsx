"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { PlanetData } from "../data/planetData";

interface PlanetProps {
  planet: PlanetData;
  starPosition: [number, number, number];
  onHover?: (
    planet: PlanetData | null,
    position: { x: number; y: number }
  ) => void;
  onClick?: (planet: PlanetData) => void;
  opacity?: number;
}

export const Planet: React.FC<PlanetProps> = ({
  planet,
  starPosition,
  onHover,
  onClick,
  opacity = 1,
}) => {
  const meshRef = useRef<Mesh>(null);
  const orbitRef = useRef(0);
  const rotationRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [planetPosition, setPlanetPosition] = useState<
    [number, number, number]
  >([starPosition[0] + planet.orbitRadius, starPosition[1], starPosition[2]]);

  const scale = planet.size * 0.005;
  const orbitRadius = planet.orbitRadius * 0.01;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 궤도 운동 (수평 궤도, Y축 변화 제거)
    orbitRef.current += planet.orbitSpeed * delta;
    const x = starPosition[0] + Math.cos(orbitRef.current) * orbitRadius;
    const z = starPosition[2] + Math.sin(orbitRef.current) * orbitRadius;
    const y = starPosition[1]; // 별과 같은 높이로 고정하여 수평 궤도 유지

    meshRef.current.position.set(x, y, z);
    setPlanetPosition([x, y, z]);

    // 자전
    rotationRef.current += planet.rotationSpeed * delta;
    meshRef.current.rotation.y = rotationRef.current;
  });

  const handlePointerEnter = (event: any) => {
    event.stopPropagation();
    setHovered(true);
    if (onHover && event.point) {
      const screenPosition = {
        x: (event.point.x / window.innerWidth) * 2 - 1,
        y: -(event.point.y / window.innerHeight) * 2 + 1,
      };
      onHover(planet, {
        x: event.clientX || window.innerWidth / 2,
        y: event.clientY || window.innerHeight / 2,
      });
    }
  };

  const handlePointerLeave = (event: any) => {
    event.stopPropagation();
    setHovered(false);
    onHover?.(null, { x: 0, y: 0 });
  };

  const handleClick = (event: any) => {
    event.stopPropagation();
    onClick?.(planet);
  };

  // 생명체 거주 가능 영역인지 확인 (8-18 단위)
  const isInHabitableZone = planet.orbitRadius >= 8 && planet.orbitRadius <= 18;

  return (
    <group>
      {/* 궤도 선 - 더 정교하고 우아한 디자인 */}
      <mesh position={starPosition} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[orbitRadius - 0.001, orbitRadius, 256]}
        />
        <meshBasicMaterial
          color={isInHabitableZone ? "#00ff9960" : "#ffffff30"}
          transparent
          opacity={(isInHabitableZone ? 0.4 : 0.15) * opacity}
          side={2} // DoubleSide
        />
      </mesh>

      {/* 행성 */}
      <mesh
        ref={meshRef}
        scale={scale}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <sphereGeometry args={[1, 32, 32]} />{" "}
        <meshPhongMaterial
          color={planet.color}
          // roughness={planet.type === "gas_giant" ? 0.1 : 0.8}
          // metalness={planet.type === "rocky" ? 0.8 : 0.1}
          emissive={hovered ? planet.color : "#000000"}
          emissiveIntensity={hovered ? 0.2 : 0}
          // transparent
          // opacity={opacity}
        />
      </mesh>

      {/* 행성 대기 효과 (가스 행성의 경우) */}
      {planet.type === "gas_giant" && (
        <mesh scale={scale * 1.1} position={planetPosition}>
          <sphereGeometry args={[1, 16, 16]} />{" "}
          <meshBasicMaterial
            color={planet.color}
            transparent
            opacity={0.1 * opacity}
          />
        </mesh>
      )}
    </group>
  );
};

// 달 시스템 컴포넌트 - 깔끔하게 정리
const MoonSystem: React.FC<{
  planet: PlanetData;
  planetPosition: { x: number; y: number; z: number };
}> = ({ planet, planetPosition }) => {
  const moonRefs = useRef<Mesh[]>([]);

  useFrame((state, delta) => {
    moonRefs.current.forEach((moonRef, index) => {
      if (!moonRef) return;

      const moonOrbitRadius = planet.size * 2.5 + index * 0.8;
      const moonOrbitSpeed = 1.5 / moonOrbitRadius;
      const moonAngle =
        state.clock.elapsedTime * moonOrbitSpeed + (index * Math.PI) / 2;

      const x = planetPosition.x + Math.cos(moonAngle) * moonOrbitRadius;
      const z = planetPosition.z + Math.sin(moonAngle) * moonOrbitRadius;
      const y = planetPosition.y;

      moonRef.position.set(x, y, z);
    });
  });

  return (
    <>
      {Array.from({ length: planet.moons || 0 }).map((_, index) => (
        <group key={index}>
          {/* 달 궤도 */}
          <mesh
            position={[planetPosition.x, planetPosition.y, planetPosition.z]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <ringGeometry
              args={[
                planet.size * 2.5 + index * 0.8 - 0.01,
                planet.size * 2.5 + index * 0.8 + 0.01,
                32,
              ]}
            />
            <meshBasicMaterial color="#666666" transparent opacity={0.1} />
          </mesh>

          {/* 달 */}
          <mesh
            ref={(el) => {
              if (el) moonRefs.current[index] = el;
            }}
            scale={planet.size * 0.12}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#cccccc" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </>
  );
};
