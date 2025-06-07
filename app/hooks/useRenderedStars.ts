import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { setStarVisibilityBatch } from "../lib/features/starSystemSlice";

const VISIBLE_STAR_RENDER_DISTANCE = 30;
const RENDER_DISTANCE = 100; // Adjust this value based on your needs

export function useRenderedStars() {
  const stars = useAppSelector((state) => state.starSystem.stars);
  const position = useAppSelector((state) => state.camera.position);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const visibleStars = stars.filter((star) => {
      const distance = Math.sqrt(
        Math.pow(star.position.x - position.x, 2) +
          Math.pow(star.position.y - position.y, 2) +
          Math.pow(star.position.z - position.z, 2)
      );
      return distance <= VISIBLE_STAR_RENDER_DISTANCE;
    });
    const starIds = visibleStars.map((star) => star.id);
    dispatch(setStarVisibilityBatch({ starIds, isVisible: true }));
  }, []);

  const renderedStars = useMemo(() => {
    return stars.filter((star) => star.isVisible).filter((star) => {
      const distance = Math.sqrt(
        Math.pow(star.position.x - position.x, 2) +
          Math.pow(star.position.y - position.y, 2) +
          Math.pow(star.position.z - position.z, 2)
      );
      return distance <= RENDER_DISTANCE;
    });
  }, [stars]);

  const invisibleStars = useMemo(() => {
    return stars.filter((star) => !star.isVisible).filter((star) => {
      const distance = Math.sqrt(
        Math.pow(star.position.x - position.x, 2) +
          Math.pow(star.position.y - position.y, 2) +
          Math.pow(star.position.z - position.z, 2)
      );
      return distance <= RENDER_DISTANCE;
    });
  }, [stars]);

  return {
    stars,
    renderedStars,
    invisibleStars,
  };
}
