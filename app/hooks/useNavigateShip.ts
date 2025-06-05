import { useCallback, useState } from "react";
import { StarData } from "../data/starData";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { calculateStarConnections } from "../lib/features/starSystemSlice";
import { setCameraPosition } from "../lib/features/cameraSlice";
import {
  cancelNavigation,
  navigateToStarWarp,
} from "../lib/features/actions/shipNavigationAction";
import { navigateToStar } from "../lib/features/actions/shipNavigationAction";
import { useRenderedStars } from "./useRenderedStars";

export default function useNavigateShip({
  targetStar,
}: {
  targetStar: StarData | null;
}) {
  const dispatch = useAppDispatch();
  const menuStar = targetStar;
  const spaceShipPosition = useAppSelector(
    (state) => state.shipSystems.position
  );
  const currentStarId = useAppSelector(
    (state) => state.shipSystems.currentStarId
  );
  const renderedStars = useRenderedStars();

  const handleNavigateToStarWarp = useCallback(async () => {
    if (menuStar) {
      await dispatch(navigateToStarWarp(menuStar)).unwrap();
      dispatch(
        calculateStarConnections({
          stars: renderedStars,
          spaceship: {
            currentStarId: menuStar.id,
            position: menuStar.position,
          },
        })
      );
      dispatch(
        setCameraPosition({
          x: menuStar.position.x,
          y: menuStar.position.y,
          z: menuStar.position.z,
        })
      );
    }
  }, [menuStar, dispatch]);

  const handleNavigateToStarNormal = useCallback(async () => {
    if (menuStar) {
      await dispatch(
        navigateToStar({ mode: "normal", star: menuStar })
      ).unwrap();
      dispatch(
        calculateStarConnections({
          stars: renderedStars,
          spaceship: {
            currentStarId: menuStar.id,
            position: menuStar.position,
          },
        })
      );
      dispatch(
        setCameraPosition({
          x: menuStar.position.x,
          y: menuStar.position.y,
          z: menuStar.position.z,
        })
      );
    }
  }, [menuStar, dispatch, renderedStars]);

  const handleCancelNavigation = useCallback(() => {
    dispatch(cancelNavigation());
    dispatch(
      calculateStarConnections({
        stars: renderedStars,
        spaceship: {
          currentStarId: currentStarId,
          position: spaceShipPosition,
        },
      })
    );
    dispatch(
      setCameraPosition({
        x: spaceShipPosition.x,
        y: spaceShipPosition.y,
        z: spaceShipPosition.z,
      })
    );
  }, [dispatch, spaceShipPosition, currentStarId, renderedStars]);

  return {
    handleNavigateToStarWarp,
    handleNavigateToStarNormal,
    handleCancelNavigation,
  };
}
