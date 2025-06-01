export interface PlanetData {
  id: string;
  name: string;
  type: 'rocky' | 'gas_giant' | 'ice_giant' | 'dwarf';
  size: number;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  moons?: number;
  description: string;
}

export interface PlanetSystemData {
  starId: string;
  starName: string;
  planets: PlanetData[];
}

// 행성 타입별 색상 매핑
const planetColors = {
  rocky: ['#8B4513', '#CD853F', '#D2691E', '#A0522D'],
  gas_giant: ['#FF6347', '#FFA500', '#FFD700', '#FF69B4'],
  ice_giant: ['#4169E1', '#1E90FF', '#00BFFF', '#87CEEB'],
  dwarf: ['#696969', '#808080', '#A9A9A9', '#D3D3D3']
};

// 행성 이름 생성기
const planetNames = [
  'Proxima', 'Kepler', 'Gliese', 'Trappist', 'K2', 'WASP', 
  'HAT-P', 'HD', 'CoRoT', 'TOI', 'LHS', 'Wolf', 'Ross'
];

const planetSuffixes = ['b', 'c', 'd', 'e', 'f', 'g', 'h'];

// 보데의 법칙에 따른 궤도 거리 계산
const calculateBodeDistance = (n: number): number => {
  // 보데의 법칙: a = (4 + 3 × 2^n) / 10
  // n = -∞ (실제로는 0), 0, 1, 2, 3, ...
  if (n === 0) {
    return (4 + 0) / 10; // 첫 번째 행성 (수성 위치)
  }
  return (4 + 3 * Math.pow(2, n - 1)) / 10;
};

// 별에 대한 행성계 생성
export const generatePlanetSystem = (starName: string, starId: string): PlanetSystemData => {
  const planetCount = Math.floor(Math.random() * 6) + 1; // 1-6개 행성
  const planets: PlanetData[] = [];
  
  for (let i = 0; i < planetCount; i++) {
    const planetType = i === 0 && Math.random() > 0.3 ? 'rocky' : 
                      i < 2 && Math.random() > 0.4 ? 'rocky' :
                      i >= planetCount - 1 && Math.random() > 0.6 ? 'ice_giant' :
                      Math.random() > 0.5 ? 'gas_giant' : 'rocky';
    
    // 보데의 법칙에 따른 궤도 거리 계산 (스케일 조정)
    const bodeDistance = calculateBodeDistance(i);
    const scaleFactor = 15; // 시각적 표현을 위한 스케일 조정
    const baseOrbitRadius = bodeDistance * scaleFactor;
    const orbitRadius = baseOrbitRadius * (0.9 + Math.random() * 0.2); // 작은 변화
    
    const planet: PlanetData = {
      id: `${starId}-planet-${i}`,
      name: `${starName} ${planetSuffixes[i] || planetSuffixes[i % planetSuffixes.length]}`,
      type: planetType,
      size: planetType === 'gas_giant' ? 0.8 + Math.random() * 1.2 :
            planetType === 'ice_giant' ? 0.6 + Math.random() * 0.8 :
            planetType === 'rocky' ? 0.3 + Math.random() * 0.5 :
            0.2 + Math.random() * 0.3,
      color: planetColors[planetType][Math.floor(Math.random() * planetColors[planetType].length)],
      orbitRadius,
      orbitSpeed: (Math.random() * 0.5 + 0.2) / orbitRadius, // 더 가까운 행성이 빠르게 공전
      rotationSpeed: Math.random() * 0.1 + 0.05,
      moons: planetType === 'gas_giant' ? Math.floor(Math.random() * 4) + 1 :
             planetType === 'ice_giant' ? Math.floor(Math.random() * 3) :
             Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0,
      description: generatePlanetDescription(planetType, orbitRadius)
    };
    
    planets.push(planet);
  }
  
  return {
    starId,
    starName,
    planets
  };
};

const generatePlanetDescription = (type: PlanetData['type'], orbitRadius: number): string => {
  const descriptions = {
    rocky: [
      '암석으로 이루어진 지구형 행성입니다.',
      '단단한 표면을 가진 암석 행성입니다.',
      '철과 규산염으로 구성된 고체 행성입니다.'
    ],
    gas_giant: [
      '거대한 가스로 이루어진 목성형 행성입니다.',
      '수소와 헬륨이 주성분인 거대 가스 행성입니다.',
      '강력한 중력을 가진 가스 거인입니다.'
    ],
    ice_giant: [
      '얼음과 암석으로 구성된 해왕성형 행성입니다.',
      '메탄과 물얼음이 풍부한 얼음 거인입니다.',
      '차가운 대기를 가진 얼음 행성입니다.'
    ],
    dwarf: [
      '작은 크기의 왜소 행성입니다.',
      '불완전하게 형성된 소형 천체입니다.',
      '궤도를 완전히 정리하지 못한 왜소 행성입니다.'
    ]
  };
  
  const baseDesc = descriptions[type][Math.floor(Math.random() * descriptions[type].length)];
  const distanceDesc = orbitRadius < 8 ? ' 항성에 매우 가깝게 위치합니다.' :
                      orbitRadius < 15 ? ' 생명체 거주 가능 영역에 위치합니다.' :
                      ' 항성에서 멀리 떨어진 차가운 영역에 위치합니다.';
  
  return baseDesc + distanceDesc;
}; 