"use client";

import { useCallback } from "react";
import { useAppSelector } from "../../lib/hooks";
import NavigationGridBackground from "./NavigationGridBackground";
import ActiveNavigationView from "./ActiveNavigationView";
import JumpRoutesSection from "./JumpRoutesSection";
import NearbyStarsSection from "./NearbyStarsSection";
import ScannerStatusSection from "./ScannerStatusSection";

export default function NavigationPanel() {
  const { stars, starConnections } = useAppSelector(
    (state) => state.starSystem
  );
  const spaceShip = useAppSelector((state) => state.shipSystems);

  const getStarById = useCallback(
    (id: string) => {
      return stars.find((star) => star.id === id);
    },
    [stars]
  );

  // 현재 위치 근처의 별들 (임시로 가까운 별 5개 선택)
  const nearbyStars = stars
    .filter((star) => star.id !== spaceShip.currentStarId)
    .slice(0, 5);

  if (spaceShip.navigation) {
    const targetStar = getStarById(spaceShip.navigation.targetStarId!);

    return (
      <NavigationGridBackground>
        <ActiveNavigationView
          navigation={spaceShip.navigation}
          targetStar={targetStar}
          shipPosition={spaceShip.position}
        />
      </NavigationGridBackground>
    );
  }

  return (
    <NavigationGridBackground>
      <JumpRoutesSection
        starConnections={starConnections}
        getStarById={getStarById}
      />
      <NearbyStarsSection nearbyStars={nearbyStars} />
      <ScannerStatusSection />
    </NavigationGridBackground>
  );
} 