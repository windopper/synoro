import { useAppSelector } from "@/app/lib/hooks";
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';

export default function StarScanIndicateSphere() {
    const { currentState, activeScans, position } = useAppSelector(state => state.shipSystems);
    const isScanning = currentState === "scanning" && Object.keys(activeScans).length > 0;
    
    const groupRef = useRef<THREE.Group>(null);
    const [scanWaves, setScanWaves] = useState<Array<{id: number, scale: number, opacity: number}>>([]);
    const [nextWaveId, setNextWaveId] = useState(0);
    const lastWaveTime = useRef(0);

    // 구체 표면에 점들을 생성하는 함수
    const sphereGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        const points = [];
        const numPoints = 800; // 점의 개수
        
        for (let i = 0; i < numPoints; i++) {
            // 피보나치 스파이럴을 사용하여 구체 표면에 균등하게 점들을 분포
            const theta = Math.acos(-1 + (2 * i) / numPoints);
            const phi = Math.sqrt(numPoints * Math.PI) * theta;
            
            const x = Math.cos(phi) * Math.sin(theta);
            const y = Math.sin(phi) * Math.sin(theta);
            const z = Math.cos(theta);
            
            points.push(x, y, z);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        return geometry;
    }, []);

    const centerPointGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
        return geometry;
    }, []);

    useEffect(() => {
        if (!isScanning) {
            setScanWaves([]);
            lastWaveTime.current = 0;
        }
    }, [isScanning]);

    useFrame((state) => {
        if (!isScanning) return;

        const currentTime = state.clock.elapsedTime;
        
        // 초당 한번씩 새로운 웨이브 생성
        if (currentTime - lastWaveTime.current >= 1.0) {
            setScanWaves(prev => [...prev, {
                id: nextWaveId,
                scale: 0.1,
                opacity: 1.0
            }]);
            setNextWaveId(prev => prev + 1);
            lastWaveTime.current = currentTime;
        }

        // 기존 웨이브들 업데이트
        setScanWaves(prev => 
            prev.map(wave => ({
                ...wave,
                scale: wave.scale + 0.2, // 확장 속도 증가 (0.02 -> 0.2)
                opacity: Math.max(0, 1.0 - (wave.scale / 100)) // 최대 반지름 100에 맞춰 투명도 조정
            })).filter(wave => wave.opacity > 0.01) // 거의 투명해진 웨이브 제거
        );
    });

    if (!isScanning) {
        return null;
    }

    return (
        <group ref={groupRef} position={[position.x, position.y, position.z]}>
            {scanWaves.map(wave => (
                <points key={wave.id} scale={[wave.scale, wave.scale, wave.scale]} geometry={sphereGeometry}>
                    <pointsMaterial 
                        color="#00ffff"
                        size={0.05}
                        transparent
                        opacity={wave.opacity}
                        sizeAttenuation={false}
                        alphaTest={0.001}
                    />
                </points>
            ))}
            {/* 중심점 표시용 작은 네온 구체 */}
            <points scale={[0.1, 0.1, 0.1]} geometry={centerPointGeometry}>
                <pointsMaterial 
                    color="#ffffff"
                    size={0.2}
                    transparent
                    opacity={0.9}
                    sizeAttenuation={false}
                />
            </points>
            {/* 추가 글로우 효과를 위한 중심 링 */}
            <points scale={[0.05, 0.05, 0.05]} geometry={sphereGeometry}>
                <pointsMaterial 
                    color="#00ffff"
                    size={0.03}
                    transparent
                    opacity={0.4}
                    sizeAttenuation={false}
                />
            </points>
        </group>
    );
}