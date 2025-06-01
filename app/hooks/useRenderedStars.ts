import { useMemo } from "react";
import { useAppSelector } from "../lib/hooks";

const RENDER_DISTANCE = 100; // Adjust this value based on your needs

export function useRenderedStars() {
  const { stars } = useAppSelector((state) => state.starSystem);
  const { position } = useAppSelector((state) => state.shipSystems);

  const renderedStars = useMemo(() => {
    if (position) {
      return stars.filter((star) => {
        const distance = Math.sqrt(
          Math.pow(star.position.x - position.x, 2) +
            Math.pow(star.position.y - position.y, 2) +
            Math.pow(star.position.z - position.z, 2)
        );
        return distance <= RENDER_DISTANCE;
      });
    }

    return stars;
  }, [stars, position]);

  return renderedStars;
}
