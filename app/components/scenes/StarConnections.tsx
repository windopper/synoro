"use client";

import React, { useMemo, useRef } from "react";
import { Html, Line, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAppSelector } from "../../lib/hooks";
import { StarData } from "../../data/starData";

interface StarConnectionsProps {
  stars: StarData[];
  opacity?: number;
}

export const StarConnections: React.FC<StarConnectionsProps> = ({
  stars,
  opacity = 1,
}) => {
  const { camera } = useThree();
  const spaceship = useAppSelector((state) => state.shipSystems);
  const starConnections = useAppSelector(
    (state) => state.starSystem.starConnections
  );
  const navigation = useAppSelector((state) => state.shipSystems.navigation);

  const navigationLineRef = useRef<THREE.Group>(null);
  const connectionLinesRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Mesh>(null);

  // 애니메이션을 위한 대시 오프셋 업데이트
  useFrame((state, delta) => {
    if (navigationLineRef.current) {
      const line = navigationLineRef.current.children[0] as any;
      if (line && line.material) {
        line.material.dashOffset -= delta * 2; // 속도 조절
      }
    }

    if (connectionLinesRef.current) {
      connectionLinesRef.current.children.forEach((child: any) => {
        if (child.material) {
          child.material.dashOffset -= delta * 2; // 속도 조절
        }
      });
    }

    if (textRef.current) {
      textRef.current.lookAt(camera.position);
    }
  });

  // 별 ID로 별 데이터 찾기
  const getStarById = (id: string) => stars.find((star) => star.id === id);

  if (navigation) {
    const points = [
      new THREE.Vector3(
        spaceship.position.x,
        spaceship.position.y,
        spaceship.position.z
      ),
      new THREE.Vector3(
        navigation.targetPosition.x,
        navigation.targetPosition.y,
        navigation.targetPosition.z
      ),
    ];

    return (
      <group ref={connectionLinesRef}>
        <Line
          points={points}
          color="#4a90e2"
          lineWidth={1}
          opacity={0.3 * opacity}
          transparent
          dashed
          dashSize={0.5}
          gapSize={0.3}
          dashOffset={0}
        />
      </group>
    );
  }

  if (!spaceship.currentStarId || starConnections.length === 0) {
    return null;
  }

  return (
    <group ref={connectionLinesRef}>
      {starConnections.map((connection, index) => {
        const fromStar = getStarById(connection.fromStarId);
        const toStar = getStarById(connection.toStarId);

        if (!fromStar || !toStar) return null;

        const points = [
          new THREE.Vector3(
            fromStar.position.x,
            fromStar.position.y,
            fromStar.position.z
          ),
          new THREE.Vector3(
            toStar.position.x,
            toStar.position.y,
            toStar.position.z
          ),
        ];

        return (
          <Line
            key={`${connection.fromStarId}-${connection.toStarId}-${index}`}
            points={points}
            color="#4a90e2"
            lineWidth={1}
            opacity={0.3 * opacity}
            transparent
            dashed
            dashSize={0.5}
            gapSize={0.3}
            dashOffset={0}
          />
        );
      })}
    </group>
  );
};
