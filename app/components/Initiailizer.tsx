'use client';

import { use, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { calculateStarConnections, initializeStarSystem } from "../lib/features/starSystemSlice";
import { setCameraPosition } from "../lib/features/cameraSlice";
import { moveToStar } from "../lib/features/shipSystemsSlice";
import { useShipSystemsSimulation } from "../hooks/useShipSystemsSimulation";

// const firstStar = allStars[0];

export default function Initializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { stars, initialized } = useAppSelector((state) => state.starSystem);
  useShipSystemsSimulation({
    enabled: true,
    updateInterval: 500,
    enableRandomEvents: false,
    enableAutomation: false,
  })

  useEffect(() => {
    if (!initialized) {
      // spaceship 초기화
      const firstStar = stars[0];
      dispatch(moveToStar({
        starId: firstStar.id,
        position: firstStar.position
      }));
      
      // 연결 계산
      dispatch(calculateStarConnections({
        stars: stars,
        spaceship: {
          currentStarId: firstStar.id,
          position: firstStar.position
        }
      }));
      // 카메라 위치 설정
      dispatch(setCameraPosition({
        x: firstStar.position.x,
        y: firstStar.position.y,
        z: firstStar.position.z
      }));
    }
  }, [dispatch, initialized]);

  return <>{children}</>;
}
