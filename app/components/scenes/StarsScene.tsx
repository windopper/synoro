"use client";

import React, {
  useState,
  Suspense,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars as DreiStars, Stars, MapControls, CameraControls, PerspectiveCamera, OrthographicCamera, Environment } from "@react-three/drei";
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
import { useWebGLContext } from "@/app/hooks/useWebGLContext";
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
import { WebGLPerformanceMonitor } from "../WebGLPerformanceMonitor";

const RENDER_DISTANCE = 100; // Distance at which stars are rendered

export const StarsScene: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stars, renderedStars, invisibleStars } = useRenderedStars();

  // AIDEV-NOTE: WebGL context lost/restored 처리를 위한 커스텀 훅 사용
  const { contextLost, isReady, retryCount, handleCanvasRef } = useWebGLContext();

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

  // WebGL 컨텍스트가 손실된 경우 로딩 화면 표시
  if (contextLost) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl mb-2">컨텍스트 복구 중...</h2>
          <p className="text-gray-400">WebGL 컨텍스트가 손실되어 복구하고 있습니다. (시도 {retryCount}/3)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        ref={handleCanvasRef}
        camera={{
          fov: 105,
          near: 0.1,
          far: 150000,
          up: new THREE.Vector3(0, 1, 0),
        }}
        style={{
          background: "rgba(0, 0, 0, 1)",
        }}
        performance={{ min: 0.5 }}
        gl={{
          preserveDrawingBuffer: false,
          powerPreference: "high-performance",
          alpha: true,
          antialias: true,
          stencil: false,
          depth: true,
        }}
        onCreated={(state) => {
          // WebGL 컨텍스트 생성 후 추가 설정
          const { gl } = state;
          
          // 리소스 관리 최적화
          gl.shadowMap.enabled = false; // 그림자 비활성화로 성능 향상
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 픽셀 비율 제한
          
          console.log("WebGL context created successfully", {
            renderer: gl.info.render,
            memory: gl.info.memory,
          });
        }}
      >

        {/* 항성계 전환 애니메이션, 갤럭시 전환 애니메이션 또는 일반 별 렌더링 */}
        {/* Ambient lighting */}
        <ambientLight intensity={0.1} />
        {/* <Stars radius={50000} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> */}

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
        <CameraControls ref={cameraControlsRef} makeDefault minDistance={0.15} maxDistance={40000} />
        <OrthographicCamera />
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
        
        {/* WebGL 성능 모니터링 */}
        <WebGLPerformanceMonitor />
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
