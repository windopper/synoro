'use client';

import { use, useEffect, memo  } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { calculateStarConnections, initializeStarSystem } from "../../lib/features/starSystemSlice";
import { setCameraPosition } from "../../lib/features/cameraSlice";
import { moveToStar } from "../../lib/features/shipSystemsSlice";

// const firstStar = allStars[0];

function Initializer() {
  const dispatch = useAppDispatch();
  const stars = useAppSelector((state) => state.starSystem.stars);
  const initialized = useAppSelector((state) => state.starSystem.initialized);


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

  return null;
}

// memo
export default memo(Initializer);
