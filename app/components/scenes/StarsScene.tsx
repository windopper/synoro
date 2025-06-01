'use client'

import React, { useState, Suspense, useEffect, useMemo, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars as DreiStars } from '@react-three/drei'
import { Star } from '../Star'
import { StarTooltip } from '../StarTooltip'
import { StarMenu } from '../StarMenu'
import { StarInfoPanel } from '../StarInfoPanel'
import { PlanetTooltip } from '../PlanetTooltip'
import { StellarResourceExtractionDialog } from '../StellarResourceExtractionDialog'
import { PlanetSystem } from '../PlanetSystem'
import { CameraAnimator } from '../CameraAnimator'
import { StarConnections } from '../StarConnections'
import { Spaceship } from '../Spaceship'
import { StarCountInfo } from '../StarCountInfo'
import { StarSystemTransition } from '../StarSystemTransition'
import { GalaxyTransition } from '../GalaxyTransition'
import { allStars, StarData, generateRandomStars } from '../../data/starData'
import { PlanetData } from '../../data/planetData'
import { useAppDispatch, useAppSelector } from '../../lib/hooks'
import { calculateStarConnections, initializeStarSystem } from '../../lib/features/starSystemSlice'
import { setCameraPosition } from '@/app/lib/features/cameraSlice'
import { CameraController } from './CameraController'
import { useRenderedStars } from '@/app/hooks/useRenderedStars'
import CommandPanel from '../CommandPanel'
import { moveToStar } from '@/app/lib/features/shipSystemsSlice'
import DetailedPanel from '../DetailedPanel'

const RENDER_DISTANCE = 100 // Distance at which stars are rendered

export const StarsScene: React.FC = () => {
  const dispatch = useAppDispatch()
  const { initialized, stars } = useAppSelector(state => state.starSystem)
  const spaceship = useAppSelector(state => state.shipSystems)
  const renderedStars = useRenderedStars();
  
  const [hoveredStar, setHoveredStar] = useState<StarData | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [selectedStar, setSelectedStar] = useState<StarData | null>(null)
  
  // 별 메뉴 관련 상태 추가
  const [showStarMenu, setShowStarMenu] = useState(false)
  const [menuStar, setMenuStar] = useState<StarData | null>(null)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  
  // 행성 관련 상태
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetData | null>(null)
  const [planetTooltipPosition, setPlanetTooltipPosition] = useState({ x: 0, y: 0 })
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null)
  const [targetStar, setTargetStar] = useState<StarData | null>(null) // 항성계로 이동할 때 사용
  const [showPlanetSystem, setShowPlanetSystem] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isReturningToGalaxy, setIsReturningToGalaxy] = useState(false) // 갤럭시로 돌아가는 애니메이션 상태
  
  // 자원 획득 다이얼로그 상태
  const [showResourceDialog, setShowResourceDialog] = useState(false)
  const [resourceDialogStar, setResourceDialogStar] = useState<StarData | null>(null)

  const handleStarHover = useCallback((star: StarData | null, position: { x: number; y: number }) => {
    setHoveredStar(star)
    setTooltipPosition(position)
  }, [])

  const handleStarClick = useCallback((star: StarData, position: { x: number; y: number }) => {
    // 메뉴가 이미 열려있으면 닫기
    if (showStarMenu) {
      setShowStarMenu(false)
      setMenuStar(null)
      return
    }
    
    // 메뉴 표시
    setMenuStar(star)
    setMenuPosition(position)
    setShowStarMenu(true)
    console.log('Star menu opened for:', star)
  }, [showStarMenu])

  const handlePlanetHover = useCallback((planet: PlanetData | null, position: { x: number; y: number }) => {
    setHoveredPlanet(planet)
    setPlanetTooltipPosition(position)
  }, [])

  const handlePlanetClick = useCallback((planet: PlanetData) => {
    setSelectedPlanet(planet)
    console.log('Selected planet:', planet)
  }, [])

  const handleAnimationStart = useCallback(() => {
    setIsAnimating(true)
    setShowPlanetSystem(false)
  }, [])

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false)
    setShowPlanetSystem(true)
  }, [])

  const handleTransitionAnimationStart = useCallback(() => {
    setIsAnimating(true)
  }, [])

  const handleTransitionAnimationComplete = useCallback(() => {
    setIsAnimating(false)
    setShowPlanetSystem(true)
  }, [])

  const handleGalaxyTransitionStart = useCallback(() => {
    setIsAnimating(true)
    console.log('Galaxy transition animation started')
  }, [])

  const handleGalaxyTransitionComplete = useCallback(() => {
    setIsAnimating(false)
    setIsReturningToGalaxy(false)
    setTargetStar(null)
    setShowPlanetSystem(false)
    setSelectedStar(null)
    setSelectedPlanet(null)
    setShowStarMenu(false)
    setMenuStar(null)
    console.log('Galaxy transition animation completed')
  }, [])

  const handleNavigateToSystem = useCallback(() => {
    if (menuStar) {
      setSelectedStar(menuStar)
      setTargetStar(menuStar)
      setShowStarMenu(false)
      setMenuStar(null)
      console.log('Navigating to star system:', menuStar)
    }
  }, [menuStar])

  const handleMoveSpaceshipTo = useCallback(() => {
    if (menuStar) {
      dispatch(moveToStar({ 
        starId: menuStar.id, 
        position: menuStar.position 
      }))
      dispatch(calculateStarConnections({
        stars: renderedStars,
        spaceship: {
          currentStarId: menuStar.id,
          position: menuStar.position
        },
      }));
      dispatch(setCameraPosition({ x: menuStar.position.x, y: menuStar.position.y, z: menuStar.position.z }))
      setShowStarMenu(false)
      setMenuStar(null)
      console.log('Moving spaceship to:', menuStar)
    }
  }, [menuStar, dispatch])

  const handleGoToSpaceshipLocation = useCallback(() => {
    if (spaceship.currentStarId) {
      dispatch(setCameraPosition({ x: spaceship.position.x, y: spaceship.position.y, z: spaceship.position.z }))
      console.log('Going to spaceship location:', spaceship)
    }
  }, [spaceship.currentStarId, dispatch])

  const handleViewStarInfo = useCallback(() => {
    if (menuStar) {
      setSelectedStar(menuStar)
      setShowStarMenu(false)
      setMenuStar(null)
      console.log('Viewing star info:', menuStar)
    }
  }, [menuStar])

  const handleExtractResources = useCallback(() => {
    if (menuStar) {
      setResourceDialogStar(menuStar)
      setShowResourceDialog(true)
      setShowStarMenu(false)
      setMenuStar(null)
      console.log('Opening resource extraction dialog for:', menuStar)
    }
  }, [menuStar])

  const handleCloseMenu = useCallback(() => {
    setShowStarMenu(false)
    setMenuStar(null)
  }, [])

  const handleBackToGalaxy = useCallback(() => {
    setIsReturningToGalaxy(true)
    console.log('Starting return to galaxy animation')
  }, [])

  // Smart positioning for menu (similar to tooltip) - moved to StarMenu component

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 15000,
        }}
        style={{
          background:
            "radial-gradient(ellipse at center, #0F1419 0%, #000000 100%)",
        }}
        performance={{ min: 0.5 }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.1} />

        {/* 항성계 전환 애니메이션, 갤럭시 전환 애니메이션 또는 일반 별 렌더링 */}
        <Suspense fallback={null}>
          {isReturningToGalaxy ? (
            <GalaxyTransition
              currentStar={selectedStar}
              allStars={renderedStars}
              onAnimationStart={handleGalaxyTransitionStart}
              onAnimationComplete={handleGalaxyTransitionComplete}
              onStarHover={handleStarHover}
              onStarClick={handleStarClick}
              onPlanetHover={handlePlanetHover}
              onPlanetClick={handlePlanetClick}
            />
          ) : targetStar ? (
            <StarSystemTransition
              targetStar={targetStar}
              allStars={renderedStars}
              onAnimationStart={handleTransitionAnimationStart}
              onAnimationComplete={handleTransitionAnimationComplete}
              onPlanetHover={handlePlanetHover}
              onPlanetClick={handlePlanetClick}
            />
          ) : (
            <>
              {/* 일반 별들 렌더링 */}
              {!showPlanetSystem &&
                renderedStars.map((star: StarData) => (
                  <Star
                    key={star.id}
                    star={star}
                    onHover={handleStarHover}
                    onClick={handleStarClick}
                  />
                ))}

              {/* 별들 간의 연결선 */}
              {!showPlanetSystem && <StarConnections stars={renderedStars} />}

              {/* 행성계 렌더링 (기존 방식) */}
              {showPlanetSystem && selectedStar && (
                <PlanetSystem
                  star={selectedStar}
                  onPlanetHover={handlePlanetHover}
                  onPlanetClick={handlePlanetClick}
                />
              )}
            </>
          )}
        </Suspense>

        {/* 함선 렌더링 */}
        {/* {!showPlanetSystem && <Spaceship />} */}

        {/* Camera controls with zoom disabled */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={30} // CameraAnimator와 일치하도록 수정
          maxDistance={45} // CameraAnimator와 일치하도록 수정
          enablePan={false}
          enableZoom={false} // Zoom disabled
          enableRotate={true}
          maxPolarAngle={showPlanetSystem ? Math.PI * 0.75 : Math.PI} // CameraAnimator와 일치
          minPolarAngle={showPlanetSystem ? Math.PI * 0.15 : 0} // CameraAnimator와 일치
          panSpeed={showPlanetSystem ? 0.5 : 0.8}
          rotateSpeed={showPlanetSystem ? 0.3 : 0.5}
        />
        <CameraController
          showPlanetSystem={showPlanetSystem}
          selectedStar={selectedStar}
        />

        {/* 카메라 애니메이션 */}
        <CameraAnimator />
      </Canvas>

      {/* 별 클릭 메뉴 */}
      <StarMenu
        showMenu={showStarMenu}
        star={menuStar}
        position={menuPosition}
        onClose={handleCloseMenu}
        onMoveSpaceshipTo={handleMoveSpaceshipTo}
        onNavigateToSystem={handleNavigateToSystem}
        onViewStarInfo={handleViewStarInfo}
        onExtractResources={handleExtractResources}
      />

      {/* 자원 획득 다이얼로그 */}
      <StellarResourceExtractionDialog
        isOpen={showResourceDialog}
        onClose={() => {
          setShowResourceDialog(false)
          setResourceDialogStar(null)
        }}
        star={resourceDialogStar}
      />

      {/* Tooltip overlay */}
      {hoveredStar && !showPlanetSystem && !showStarMenu && (
        <StarTooltip
          star={hoveredStar}
          position={tooltipPosition}
          visible={!!hoveredStar}
        />
      )}

      {/* 행성 툴팁 */}
      {hoveredPlanet && showPlanetSystem && (
        <PlanetTooltip
          planet={hoveredPlanet}
          position={planetTooltipPosition}
          visible={!!hoveredPlanet}
        />
      )}

      {/* 백투갤럭시 버튼 */}
      {(targetStar || showPlanetSystem) && !isReturningToGalaxy && (
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleBackToGalaxy}
            className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Galaxy</span>
          </button>
        </div>
      )}

      {/* Star count info */}
      {/* <StarCountInfo
        stars={renderedStars}
        showPlanetSystem={showPlanetSystem}
        selectedStar={selectedStar}
        isAnimating={isAnimating}
        allStars={allStars}
      /> */}

      {/* Selected star info panel */}
      {selectedStar && !showPlanetSystem && !isAnimating && (
        <StarInfoPanel
          star={selectedStar}
          onClose={() => setSelectedStar(null)}
        />
      )}

      <CommandPanel />
      <DetailedPanel />

      {/* Selected planet info panel */}
      {selectedPlanet && showPlanetSystem && (
        <div className="absolute top-4 right-4 z-10 max-w-sm">
          <div className="bg-black/90 backdrop-blur-sm rounded-xl p-4 text-white border border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold">{selectedPlanet.name}</h3>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Type:</span>
                  <div className="text-blue-300">
                    {selectedPlanet.type === "rocky"
                      ? "암석형"
                      : selectedPlanet.type === "gas_giant"
                      ? "가스 거인"
                      : selectedPlanet.type === "ice_giant"
                      ? "얼음 거인"
                      : "왜소 행성"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Size:</span>
                  <div className="text-purple-300">
                    {selectedPlanet.size.toFixed(2)} units
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Orbit:</span>
                  <div className="text-green-300">
                    {selectedPlanet.orbitRadius.toFixed(1)} AU
                  </div>
                </div>
                {selectedPlanet.moons && selectedPlanet.moons > 0 && (
                  <div>
                    <span className="text-gray-400">Moons:</span>
                    <div className="text-yellow-300">
                      {selectedPlanet.moons}
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-2 border-t border-gray-700">
                <p className="text-gray-300 leading-relaxed">
                  {selectedPlanet.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}