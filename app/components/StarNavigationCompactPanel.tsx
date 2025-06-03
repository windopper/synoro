import { useAppSelector } from "@/app/lib/hooks";
import * as THREE from "three";
import { Html, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { useRef, useState } from "react";

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

  useFrame((state, delta) => {
    if (navigationLineRef.current) {
      const line = navigationLineRef.current.children[0] as any;
      if (line && line.material) {
        line.material.dashOffset -= delta * 2; // 속도 조절
      }
    }

    if (connectionLinesRef.current) {
      connectionLinesRef.current.children.forEach((child: any) => {
        if (child.material) {
          child.material.dashOffset -= delta * 2; // 속도 조절
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

    const middlePoint = new THREE.Vector3(
      (spaceship.position.x + navigation.targetPosition.x) / 2,
      (spaceship.position.y + navigation.targetPosition.y) / 2,
      (spaceship.position.z + navigation.targetPosition.z) / 2
    );

    // 남은 시간 계산
    const now = Date.now();
    const remainingTime = Math.max(
      0,
      (navigation.estimatedCompletion - now) / 1000
    );

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

    return (
      <group ref={navigationLineRef}>
        <Line
          points={points}
          color="#4a90e2"
          lineWidth={1}
          opacity={0.3 * opacity}
          transparent
          dashed
          gapSize={0.3}
          dashSize={0.3}
          dashOffset={0}
        />

        {/* 타겟 포인터 라인 */}
        <Line
          points={pointerPoints}
          color="#00ff88"
          lineWidth={2}
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
            color="#00ff88"
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
            color="#00ff88"
            transparent
            opacity={0.2 * opacity}
            side={THREE.DoubleSide}
          />
        </mesh>

        <Html position={panelPosition} className="w-48 pointer-events-none"
            zIndexRange={[40, 0]}
        >
          <div className="relative select-none">
            {/* 레이더 스타일 배경 */}
            <div className="absolute inset-0 bg-black/80 border-2 border-green-400/60 rounded-lg backdrop-blur-sm shadow-2xl z-0">
              <div className="absolute top-2 right-2 w-2 h-2 bg-green-400/60 rounded-full animate-ping"></div>
            </div>

            {/* 컨텐츠 */}
            <div className="relative z-20 p-2 bg-gradient-to-br from-green-900/20 to-cyan-900/20 rounded-lg border border-green-400/40">
              {/* 컴팩트 네비게이션 정보 */}
              <div className="space-y-2">
                {/* 타겟 정보 */}
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  <div className="text-cyan-100 font-mono text-xs font-bold truncate">
                    {targetStar?.name || "Unknown"}
                  </div>
                </div>

                {/* 진행률 바 */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-green-300 font-mono text-xs">
                      Progress
                    </span>
                    <span className="text-green-200 font-mono text-xs font-bold">
                      {navigation.travelProgress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1 border border-green-500/30">
                    <div
                      className="bg-gradient-to-r from-green-500 to-cyan-400 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${navigation.travelProgress}%` }}
                    />
                  </div>
                </div>

                {/* 속도와 시간 */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-cyan-200 font-mono font-bold">
                      {navigation.travelSpeed.toFixed(1)}
                    </div>
                    <div className="text-green-400 font-mono text-xs">AU/h</div>
                  </div>
                  <div className="text-center">
                    <div className="text-cyan-200 font-mono font-bold">
                      {formatTime(
                        Math.max(
                          0,
                          (navigation.estimatedCompletion - Date.now()) / 1000
                        )
                      )}
                    </div>
                    <div className="text-green-400 font-mono text-xs">
                      남은시간
                    </div>
                  </div>
                </div>

                {/* 거리 정보 */}
                <div className="text-center border-t border-green-500/30 pt-1">
                  <div className="text-cyan-200 font-mono text-xs font-bold">
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
                  <div className="text-green-400 font-mono text-xs">
                    DISTANCE
                  </div>
                </div>

                {/* 상태 */}
                <div className="flex items-center justify-center gap-1 text-xs">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-ping" />
                  <span className="text-green-400 font-mono uppercase text-xs">
                    {navigation.navigationMode}
                  </span>
                </div>
              </div>
            </div>

            {/* 스캔라인 효과 */}
            <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400/80 to-transparent animate-pulse"></div>
              <div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400/80 to-transparent animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </Html>
      </group>
    );
  }
}
