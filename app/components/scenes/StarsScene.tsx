"use client";

import React, {
  useState,
  Suspense,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars as DreiStars, Stars, MapControls, CameraControls } from "@react-three/drei";
import Star from "./Star";
import StarMenu from "../star/StarMenu";
import { StarInfoPanel } from "../StarInfoPanel";
import { PlanetTooltip } from "../PlanetTooltip";
import StellarResourceExtractionDialog from "../StellarResourceExtractionDialog";
import { PlanetSystem } from "../PlanetSystem";
import { CameraAnimator } from "../CameraAnimator";
import { StarConnections } from "./StarConnections";
import { StarSystemTransition } from "./StarSystemTransition";
import { GalaxyTransition } from "./GalaxyTransition";
import { StarData } from "../../data/starData";
import { PlanetData } from "../../data/planetData";
import { useAppDispatch } from "../../lib/hooks";
import { 
  toggleStarMenu,
  closeStarMenu
} from "@/app/lib/features/starMenuSlice";
import { CameraController } from "./CameraController";
import { useRenderedStars } from "@/app/hooks/useRenderedStars";
import CommandPanel from "../CommandPanel";
import {
  moveToStar,
  navigateToStar,
  navigateToStarWarp,
} from "@/app/lib/features/shipSystemsSlice";
import DetailedPanel from "../DetailedPanel";
import ProgressIndicatorWrapper from "../indicator/ProgressIndicatorWrapper";
import StarNavigationCompactPanel from "./StarNavigationCompactPanel";

import StarNavigationWarpIndicateSphere from "./StarNavigationWarpIndicateSphere";
import BackToCurrentPositionFloatingButton from "../BackToCurrentPositionFloatingButton";
import InvisibleStar from "./InvisibleStar";
import ScanCompactPanel from "./ScanCompactPanel";
import StarScanIndicateSphere from "./StarScanIndicateSphere";
import * as THREE from "three";
import { Bloom, DepthOfField, EffectComposer, Grid, Noise } from "@react-three/postprocessing";
import { SynoroSceneTransition } from "./SynoroSceneTransition";

const RENDER_DISTANCE = 100; // Distance at which stars are rendered

export const StarsScene: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stars, renderedStars, invisibleStars } = useRenderedStars();

  console.log(renderedStars.length);

  // 자원 획득 다이얼로그 상태
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [resourceDialogStar, setResourceDialogStar] = useState<StarData | null>(
    null
  );
  const cameraControlsRef = useRef<CameraControls>(null);

  const handleStarClick = useCallback(
    (star: StarData, position: { x: number; y: number }) => {
      // 메뉴 토글 (이미 열려있으면 닫고, 닫혀있으면 열기)
      dispatch(toggleStarMenu({ star, position }));
      console.log("Star menu toggled for:", star);
    },
    [dispatch]
  );

  const handleExtractResources = useCallback((star: StarData) => {
    setResourceDialogStar(star);
    setShowResourceDialog(true);
    console.log("Opening resource extraction dialog for:", star);
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{
          fov: 105,
          near: 0.1,
          far: 150000,
          up: new THREE.Vector3(0, 1, 0),
        }}
        style={{
          background:
            "radial-gradient(ellipse at center, #0F1419 0%, #000000 100%)",
        }}
        performance={{ min: 0.5 }}
        // onCreated={({ gl }) => {
        //   gl.toneMapping = THREE.ACESFilmicToneMapping;
        //   gl.setClearColor(new THREE.Color("#020207"));
        // }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.1} />

        {/* Fog */}
        {/* <fog
          attach="fog"
          color="#000000"
          near={30}
          far={100}
          args={[0, 0, 0]}
        /> */}

        {/* 항성계 전환 애니메이션, 갤럭시 전환 애니메이션 또는 일반 별 렌더링 */}
        <SynoroSceneTransition
          allStars={renderedStars}
          handleStarClick={handleStarClick}
          cameraControlsRef={cameraControlsRef as React.RefObject<CameraControls>}
        />

        <StarNavigationCompactPanel />
        {/* <StarNavigationWarpIndicateSphere /> */}
        {/* <BackToCurrentPositionFloatingButton /> */}
        <StarScanIndicateSphere />

        {/* Camera controls with zoom disabled */}
        <CameraControls ref={cameraControlsRef} makeDefault />
        <CameraController
          cameraControlsRef={cameraControlsRef as React.RefObject<CameraControls>}
        />
        {/* 카메라 애니메이션 */}
        <CameraAnimator cameraControlsRef={cameraControlsRef as React.RefObject<CameraControls>} />

        <EffectComposer>
          <Bloom
            intensity={0.8}
            blurPass={undefined}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.025}
            mipmapBlur={false}
          />
          {/* <Noise opacity={0.02} /> */}
          {/* <DepthOfField 
            focusDistance={0}
            focalLength={1}
          /> */}
        </EffectComposer>
      </Canvas>

      {/* 별 클릭 메뉴 */}
      <StarMenu
        onExtractResources={handleExtractResources}
      />

      {/* 자원 획득 다이얼로그 */}
      <StellarResourceExtractionDialog
        isOpen={showResourceDialog}
        onClose={() => {
          setShowResourceDialog(false);
          setResourceDialogStar(null);
        }}
        star={resourceDialogStar}
      />

      {/* Tooltip overlay */}
      {/* {hoveredStar && !showPlanetSystem && !showStarMenu && (
        <StarTooltip
          star={hoveredStar}
          position={tooltipPosition}
          visible={!!hoveredStar}
        />
      )} */}

      {/* 행성 툴팁 */}
      {/* {hoveredPlanet && showPlanetSystem && (
        <PlanetTooltip
          planet={hoveredPlanet}
          position={planetTooltipPosition}
          visible={!!hoveredPlanet}
        />
      )} */}

      {/* 백투갤럭시 버튼 */}
      {/* {(targetStar || showPlanetSystem) && !isReturningToGalaxy && (
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleBackToGalaxy}
            className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Galaxy</span>
          </button>
        </div>
      )} */}

      {/* Selected star info panel */}
      {/* {selectedStar && !showPlanetSystem && !isAnimating && (
        <StarInfoPanel
          star={selectedStar}
          onClose={() => setSelectedStar(null)}
        />
      )} */}

      <CommandPanel />
      <DetailedPanel />
      <ProgressIndicatorWrapper />
      <ScanCompactPanel />
    </div>
  );
};
