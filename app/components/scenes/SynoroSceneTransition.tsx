import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group } from "three";
import { StarData } from "@/app/data/starData";
import { PlanetSystem } from "../PlanetSystem";
import Star from "./Star";

interface SynoroSceneTransitionProps {
  currentStar: StarData | null;
  allStars: StarData[];
  handleStarClick: (star: StarData, position: { x: number; y: number }) => void;
  isReturningToGalaxy?: boolean;
  onFinishReturnGalaxy?: () => void;
}

export const SynoroSceneTransition = ({
  currentStar,
  allStars,
  handleStarClick,
  isReturningToGalaxy = false,
  onFinishReturnGalaxy,
}: SynoroSceneTransitionProps) => {
  const { gl, camera } = useThree();
  const [animationPhase, setAnimationPhase] = useState<
    | "galaxy" // 은하 화면
    | "focus-in-star-system"
    | "focus-out-star-system"
    | "star-system" // 항성계 화면
  >("galaxy");
  const groupRef = useRef<Group>(null);
  const [focusProgress, setFocusProgress] = useState(0);

  console.log(animationPhase, focusProgress);

  useEffect(() => {
    if (currentStar && animationPhase === "galaxy") {
      setAnimationPhase("focus-in-star-system");
    }
  }, [currentStar, animationPhase]);

  // Back to galaxy 애니메이션 트리거
  useEffect(() => {
    if (isReturningToGalaxy && animationPhase === "star-system") {
      setAnimationPhase("focus-out-star-system");
    }
  }, [isReturningToGalaxy, animationPhase]);

  useFrame((state, delta) => {
    const animationSpeed = 2.5;

    switch (animationPhase) {
      case "focus-in-star-system":
        setFocusProgress((prev) => {
          const newProgress = Math.min(1, prev + delta * animationSpeed);
          if (newProgress >= 1) {
              setAnimationPhase("star-system");
              return 1;
          }
          return newProgress;
        });
        break;
      case "focus-out-star-system":
        setFocusProgress((prev) => {
          const newProgress = Math.max(0, prev - delta * animationSpeed);
          if (newProgress <= 0) {
            setAnimationPhase("galaxy");
            onFinishReturnGalaxy?.();
            return 0;
          }
          return newProgress;
        });
        break;
    }
  });

  return (
    <group ref={groupRef}>
      {animationPhase === "focus-in-star-system" ||
        animationPhase === "focus-out-star-system" ||
        (animationPhase === "star-system" && currentStar && (
          <PlanetSystem star={currentStar} opacity={focusProgress} />
        ))}

      {animationPhase === "star-system" && currentStar && (
        <Star star={currentStar} opacity={1} />
      )}

      {(animationPhase === "focus-in-star-system" ||
        animationPhase === "focus-out-star-system" ||
        animationPhase === "galaxy") &&
          allStars.map((star) => {
            if (star.id === currentStar?.id) {
              return <Star key={star.id} star={star} opacity={1} onClick={handleStarClick} />
            }
            return <Star key={star.id} star={star} opacity={1 - focusProgress} onClick={handleStarClick} />
          })}
    </group>
  );
};
