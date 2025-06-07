import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useAppSelector } from "@/app/lib/hooks";
import { selectInstalledModules, selectModuleDetails, selectShipSystems } from "@/app/lib/utils/shipSystemsSelectors";
import { getModuleById, NAVIGATION_MODULE_WARP_PREFIX, NavigationModulePerformance } from "@/app/data/shipModules";
import * as THREE from "three";

export default function StarNavigationWarpIndicateSphere() {
    const shipPosition = useAppSelector((state) => state.shipSystems.position);
    const installedModules = useAppSelector((state) => state.shipSystems.installedModules);
    const warpModule = Object.values(installedModules).find((module) => module.id.startsWith(NAVIGATION_MODULE_WARP_PREFIX));
    const warpModuleInfo = getModuleById(warpModule?.id || "");
    const warpRange = (warpModuleInfo?.performance as NavigationModulePerformance).warpRange || 0;

    const outerRingRef = useRef<THREE.Mesh>(null);
    const pulseRingRef = useRef<THREE.Mesh>(null);
    const scanLineRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        
        // 외곽 링 회전
        if (outerRingRef.current) {
            outerRingRef.current.rotation.z = time * 0.3;
        }

        // 펄스 링 애니메이션
        if (pulseRingRef.current) {
            const scale = 0.8 + Math.sin(time * 1.5) * 0.2;
            pulseRingRef.current.scale.setScalar(scale);
            (pulseRingRef.current.material as THREE.Material).opacity = 0.15 - scale * 0.05;
        }

        // 레이더 스캔 라인 회전
        if (scanLineRef.current) {
            scanLineRef.current.rotation.y = time * 0.8;
        }
    });

    if (warpRange <= 0) return null;

    return (
        <group position={[shipPosition.x, shipPosition.y, shipPosition.z]}>
            {/* 메인 경계 구 - 매우 미묘한 와이어프레임 */}
            <mesh>
                <sphereGeometry args={[warpRange, 32, 16]} />
                <meshBasicMaterial 
                    color="#00aaff" 
                    transparent 
                    opacity={0.03} 
                    wireframe 
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    )
}