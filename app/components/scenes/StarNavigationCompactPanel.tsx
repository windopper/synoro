import { useAppSelector } from "@/app/lib/hooks";
import * as THREE from "three";
import { Html, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import useNavigateShip from "@/app/hooks/useNavigateShip";
import { CameraControls } from "@react-three/drei";

const opacity = 0.3;

// 시간 포맷팅 함수
const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.ceil(seconds)}초`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds % 60);
    return `${minutes}분 ${remainingSeconds}초`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}시간 ${minutes}분`;
  }
};

export default function StarNavigationCompactPanel() {
  const { handleCancelNavigation } = useNavigateShip();
  const navigation = useAppSelector((state) => state.shipSystems.navigation);
  const spaceship = useAppSelector((state) => state.shipSystems);
  const stars = useAppSelector((state) => state.starSystem.stars);
  const { camera } = useThree();
  const navigationLineRef = useRef<THREE.Group>(null);
  const connectionLinesRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Mesh>(null);
  
  // 패널 위치 상태 관리 (부드러운 이동을 위해)
  const [currentPanelPosition, setCurrentPanelPosition] = useState<THREE.Vector3>(() => new THREE.Vector3());
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const getStarById = (id: string) => stars.find((star) => star.id === id);

  // 워프 모드 확인
  const isWarpMode = navigation?.navigationMode === "warp";

  useFrame((state, delta) => {
    // 워프 모드에서 더 빠른 애니메이션 속도 적용
    const animationSpeed = isWarpMode ? 5 : 2;
    
    if (navigationLineRef.current) {
      const line = navigationLineRef.current.children[0] as any;
      if (line && line.material) {
        line.material.dashOffset -= delta * animationSpeed; // 속도 조절
      }
    }

    if (connectionLinesRef.current) {
      connectionLinesRef.current.children.forEach((child: any) => {
        if (child.material) {
          child.material.dashOffset -= delta * animationSpeed; // 속도 조절
        }
      });
    }

    if (textRef.current) {
      textRef.current.lookAt(camera.position);
    }

    // 패널 위치 부드럽게 보간
    if (navigation) {
      const targetStar = getStarById(navigation.targetStarId || "");
      if (targetStar) {
        const panelOffset = 3;
        
        // 카메라에서 타겟 스타로의 벡터
        const cameraToStar = new THREE.Vector3(
          targetStar.position.x - camera.position.x,
          targetStar.position.y - camera.position.y,
          targetStar.position.z - camera.position.z
        ).normalize();
        
        // 카메라의 위쪽 벡터 (일반적으로 Y축)
        const cameraUp = new THREE.Vector3(0, 1, 0);
        
        // 오른쪽 벡터 계산 (외적 사용)
        const rightVector = new THREE.Vector3().crossVectors(cameraToStar, cameraUp).normalize();
        
        // 새로운 타겟 위치 계산
        const newTargetPosition = new THREE.Vector3(
          targetStar.position.x + rightVector.x * panelOffset,
          targetStar.position.y + rightVector.y * panelOffset,
          targetStar.position.z + rightVector.z * panelOffset
        );
        
        // 첫 번째 렌더링 시 즉시 위치 설정
        if (!isInitialized) {
          setCurrentPanelPosition(newTargetPosition.clone());
          setIsInitialized(true);
        } else {
          // 부드러운 이동을 위한 lerp (선형 보간)
          const lerpFactor = Math.min(delta * 5, 1); // 부드러운 이동 속도 조절
          setCurrentPanelPosition(prev => {
            const newPos = prev.clone().lerp(newTargetPosition, lerpFactor);
            return newPos;
          });
        }
      }
    }
  });

  if (navigation) {
    const points = [
      new THREE.Vector3(
        spaceship.position.x,
        spaceship.position.y,
        spaceship.position.z
      ),
      new THREE.Vector3(
        navigation.targetPosition.x,
        navigation.targetPosition.y,
        navigation.targetPosition.z
      ),
    ];

    // 목적지 별 이름 찾기
    const targetStar = getStarById(navigation.targetStarId || "");

    if (!targetStar) return null;

    // 부드럽게 보간된 패널 위치 사용
    const panelPosition: [number, number, number] = [
      currentPanelPosition.x,
      currentPanelPosition.y,
      currentPanelPosition.z,
    ];

    // 타겟 포인터 라인 (항성에서 패널로)
    const pointerPoints = [
      new THREE.Vector3(
        targetStar.position.x,
        targetStar.position.y,
        targetStar.position.z
      ),
      new THREE.Vector3(
        panelPosition[0] - 0.5,
        panelPosition[1],
        panelPosition[2]
      ),
    ];

    // 워프 모드에 따른 색상 및 스타일 설정
    const lineColor = isWarpMode ? "#ff4088" : "#4a90e2";
    const targetColor = isWarpMode ? "#ff6ba8" : "#00ff88";
    const panelBorderColor = isWarpMode ? "border-pink-400/60" : "border-green-400/60";
    const panelGradient = isWarpMode ? "from-pink-900/20 to-purple-900/20" : "from-green-900/20 to-cyan-900/20";
    const panelBorderStyle = isWarpMode ? "border-pink-400/40" : "border-green-400/40";
    const statusColor = isWarpMode ? "text-pink-400" : "text-green-400";
    const indicatorColor = isWarpMode ? "bg-pink-400" : "bg-cyan-400";
    const progressGradient = isWarpMode ? "from-pink-500 to-purple-400" : "from-green-500 to-cyan-400";
    const scanlineColor = isWarpMode ? "via-pink-400/80" : "via-green-400/80";
    const dataColor = isWarpMode ? "text-pink-200" : "text-cyan-200";
    const labelColor = isWarpMode ? "text-pink-400" : "text-green-400";
    const animationSpeed = isWarpMode ? 5 : 2; // 워프 모드에서 더 빠른 애니메이션

    return (
      <group ref={navigationLineRef}>
        <Line
          points={points}
          color={lineColor}
          lineWidth={isWarpMode ? 2 : 1}
          opacity={0.3 * opacity}
          transparent
          dashed
          gapSize={isWarpMode ? 0.2 : 0.3}
          dashSize={isWarpMode ? 0.5 : 0.3}
          dashOffset={0}
        />

        {/* 타겟 포인터 라인 */}
        <Line
          points={pointerPoints}
          color={targetColor}
          lineWidth={isWarpMode ? 3 : 2}
          opacity={0.8 * opacity}
          transparent
        />

        {/* 타겟 스캔 서클 */}
        <mesh
          position={[
            targetStar.position.x,
            targetStar.position.y,
            targetStar.position.z,
          ]}
        >
          <ringGeometry args={[0.8, 1.0, 32]} />
          <meshBasicMaterial
            color={targetColor}
            transparent
            opacity={0.4 * opacity}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh
          position={[
            targetStar.position.x,
            targetStar.position.y,
            targetStar.position.z,
          ]}
        >
          <ringGeometry args={[1.3, 1.5, 32]} />
          <meshBasicMaterial
            color={targetColor}
            transparent
            opacity={0.2 * opacity}
            side={THREE.DoubleSide}
          />
        </mesh>

        <Html position={panelPosition} className="w-48 pointer-events-auto"
            zIndexRange={[40, 0]}
        >
          <div className="relative select-none">
            {/* 레이더 스타일 배경 */}
            <div className={`absolute inset-0 bg-black/80 border-2 ${panelBorderColor} rounded-lg backdrop-blur-sm shadow-2xl z-0`}>
              <div className={`absolute top-2 right-2 w-2 h-2 ${indicatorColor} rounded-full ${isWarpMode ? 'animate-ping' : 'animate-pulse'}`}></div>
              {isWarpMode && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400/60 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              )}
            </div>

            {/* 컨텐츠 */}
            <div className={`relative z-20 p-2 bg-gradient-to-br ${panelGradient} rounded-lg border ${panelBorderStyle}`}>
              {/* 컴팩트 네비게이션 정보 */}
              <div className="space-y-2">
                {/* 타겟 정보 */}
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 ${indicatorColor} rounded-full ${isWarpMode ? 'animate-ping' : 'animate-pulse'}`} />
                  <div className={`${dataColor} font-mono text-xs font-bold truncate`}>
                    {targetStar?.name || "Unknown"}
                  </div>
                </div>

                {/* 진행률 바 */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`${statusColor} font-mono text-xs`}>
                      Progress
                    </span>
                    <span className={`${dataColor} font-mono text-xs font-bold`}>
                      {navigation.travelProgress.toFixed(1)}%
                    </span>
                  </div>
                  <div className={`w-full bg-gray-800 rounded-full h-1 border ${isWarpMode ? 'border-pink-500/30' : 'border-green-500/30'}`}>
                    <div
                      className={`bg-gradient-to-r ${progressGradient} h-1 rounded-full transition-all duration-500 ${isWarpMode ? 'shadow-pink-500/50 shadow-sm' : ''}`}
                      style={{ width: `${navigation.travelProgress}%` }}
                    />
                  </div>
                </div>

                {/* 속도와 시간 */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center">
                    <div className={`${dataColor} font-mono font-bold`}>
                      {navigation.travelSpeed.toFixed(1)}
                    </div>
                    <div className={`${labelColor} font-mono text-xs`}>
                      {isWarpMode ? "WARP" : "AU/h"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`${dataColor} font-mono font-bold`}>
                      {formatTime(
                        Math.max(
                          0,
                          (navigation.estimatedCompletion - Date.now()) / 1000
                        )
                      )}
                    </div>
                    <div className={`${labelColor} font-mono text-xs`}>
                      남은시간
                    </div>
                  </div>
                </div>

                {/* 거리 정보 */}
                <div className={`text-center border-t ${isWarpMode ? 'border-pink-500/30' : 'border-green-500/30'} pt-1`}>
                  <div className={`${dataColor} font-mono text-xs font-bold`}>
                    {Math.sqrt(
                      Math.pow(
                        targetStar.position.x - spaceship.position.x,
                        2
                      ) +
                        Math.pow(
                          targetStar.position.y - spaceship.position.y,
                          2
                        ) +
                        Math.pow(
                          targetStar.position.z - spaceship.position.z,
                          2
                        )
                    ).toFixed(2)}{" "}
                    LY
                  </div>
                  <div className={`${labelColor} font-mono text-xs`}>
                    DISTANCE
                  </div>
                </div>

                {/* 상태와 취소 버튼 */}
                <div className={`flex items-center justify-between border-t ${isWarpMode ? 'border-pink-500/30' : 'border-green-500/30'} pt-2`}>
                  <div className="flex items-center gap-1 text-xs">
                    <div className={`w-1 h-1 ${isWarpMode ? 'bg-pink-400' : 'bg-green-400'} rounded-full ${isWarpMode ? 'animate-ping' : 'animate-pulse'}`} />
                    <span className={`${statusColor} font-mono uppercase text-xs ${isWarpMode ? 'font-bold' : ''}`}>
                      {navigation.navigationMode}
                    </span>
                  </div>
                  
                  {/* 항법 취소 버튼 */}
                  <button
                    onClick={handleCancelNavigation}
                    className="px-2 py-1 bg-red-900/60 border border-red-400/60 rounded text-red-200 font-mono text-xs uppercase hover:bg-red-800/80 hover:border-red-300 transition-all duration-200 active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* 스캔라인 효과 */}
            <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
              <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent ${scanlineColor} to-transparent ${isWarpMode ? 'animate-ping' : 'animate-pulse'}`}></div>
              <div
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent ${scanlineColor} to-transparent ${isWarpMode ? 'animate-ping' : 'animate-pulse'}`}
                style={{ animationDelay: isWarpMode ? "0.3s" : "1s" }}
              ></div>
            </div>
          </div>
        </Html>
      </group>
    );
  }
}
