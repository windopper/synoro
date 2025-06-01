// 우주 탐사 게임의 자원 시스템 정의

// 자원 희소성 등급
export enum ResourceRarity {
  COMMON = 'COMMON',         // 일반 (흔함)
  UNCOMMON = 'UNCOMMON',     // 비일반 (약간 희귀)
  RARE = 'RARE',             // 희귀
  VERY_RARE = 'VERY_RARE',   // 매우 희귀
  LEGENDARY = 'LEGENDARY',   // 전설급
  UNIQUE = 'UNIQUE'          // 고유 (특별한 조건에서만 획득)
}

// 자원 카테고리
export enum ResourceCategory {
  STELLAR_ENERGY = 'STELLAR_ENERGY',     // 항성 에너지
  STELLAR_MATTER = 'STELLAR_MATTER',     // 항성 물질
  GASES = 'GASES',                       // 기체
  METALS = 'METALS',                     // 금속
  CRYSTALS = 'CRYSTALS',                 // 결정체
  EXOTIC_MATTER = 'EXOTIC_MATTER',       // 이상 물질
  QUANTUM = 'QUANTUM',                   // 양자 물질
  DARK_MATTER = 'DARK_MATTER'            // 암흑 물질
}

// 자원 정보 인터페이스
export interface ResourceInfo {
  id: string;
  nameKo: string;
  nameEn: string;
  category: ResourceCategory;
  rarity: ResourceRarity;
  description: string;
  baseValue: number; // 기본 가치 (거래소 기준)
  
  // 항성 생성 관련 속성
  stellarConditions: {
    spectralClasses: string[];      // 생성 가능한 분광형
    temperatureRange: [number, number]; // 온도 범위 (K)
    massRange: [number, number];    // 질량 범위 (태양질량)
    luminosityRange: [number, number]; // 광도 범위 (태양광도)
    variableStarsOnly?: boolean;    // 변광성에서만 생성되는지
  };
  
  // 생성 확률 (기본값, 조건에 따라 수정됨)
  baseProbability: number; // 0-100%
  maxYieldPerHour: number; // 시간당 최대 채취량
}

// 자원 데이터베이스
export const RESOURCE_DATABASE: Record<string, ResourceInfo> = {
  // === 항성 에너지 자원 ===
  '플라즈마 에너지': {
    id: 'plasma_energy',
    nameKo: '플라즈마 에너지',
    nameEn: 'Plasma Energy',
    category: ResourceCategory.STELLAR_ENERGY,
    rarity: ResourceRarity.COMMON,
    description: '항성 표면의 고온 플라즈마에서 추출한 순수 에너지입니다.',
    baseValue: 10,
    stellarConditions: {
      spectralClasses: ['O', 'B', 'A', 'F', 'G'],
      temperatureRange: [5000, 50000],
      massRange: [0.8, 100],
      luminosityRange: [1, 1000000]
    },
    baseProbability: 80,
    maxYieldPerHour: 25
  },

  '핵융합 입자': {
    id: 'fusion_particles',
    nameKo: '핵융합 입자',
    nameEn: 'Fusion Particles',
    category: ResourceCategory.STELLAR_ENERGY,
    rarity: ResourceRarity.UNCOMMON,
    description: '항성 핵에서 발생하는 핵융합 반응의 부산물입니다.',
    baseValue: 25,
    stellarConditions: {
      spectralClasses: ['O', 'B', 'A', 'F', 'G'],
      temperatureRange: [4000, 30000],
      massRange: [0.5, 50],
      luminosityRange: [0.1, 100000]
    },
    baseProbability: 60,
    maxYieldPerHour: 15
  },

  '항성풍 입자': {
    id: 'stellar_wind',
    nameKo: '항성풍 입자',
    nameEn: 'Stellar Wind Particles',
    category: ResourceCategory.STELLAR_ENERGY,
    rarity: ResourceRarity.UNCOMMON,
    description: '항성에서 방출되는 고에너지 입자들입니다.',
    baseValue: 30,
    stellarConditions: {
      spectralClasses: ['O', 'B', 'A'],
      temperatureRange: [7500, 50000],
      massRange: [1.5, 100],
      luminosityRange: [10, 1000000]
    },
    baseProbability: 45,
    maxYieldPerHour: 8
  },

  // === 항성 물질 자원 ===
  '수소': {
    id: 'hydrogen',
    nameKo: '수소',
    nameEn: 'Hydrogen',
    category: ResourceCategory.STELLAR_MATTER,
    rarity: ResourceRarity.COMMON,
    description: '항성의 주연료인 수소 동위원소입니다.',
    baseValue: 5,
    stellarConditions: {
      spectralClasses: ['O', 'B', 'A', 'F', 'G', 'K', 'M'],
      temperatureRange: [2000, 50000],
      massRange: [0.1, 100],
      luminosityRange: [0.001, 1000000]
    },
    baseProbability: 95,
    maxYieldPerHour: 40
  },

  '헬륨': {
    id: 'helium',
    nameKo: '헬륨',
    nameEn: 'Helium',
    category: ResourceCategory.STELLAR_MATTER,
    rarity: ResourceRarity.COMMON,
    description: '핵융합 반응으로 생성된 헬륨입니다.',
    baseValue: 8,
    stellarConditions: {
      spectralClasses: ['O', 'B', 'A', 'F', 'G', 'K'],
      temperatureRange: [3000, 50000],
      massRange: [0.3, 100],
      luminosityRange: [0.01, 1000000]
    },
    baseProbability: 85,
    maxYieldPerHour: 30
  },

  '중수소': {
    id: 'deuterium',
    nameKo: '중수소',
    nameEn: 'Deuterium',
    category: ResourceCategory.STELLAR_MATTER,
    rarity: ResourceRarity.RARE,
    description: '핵융합 연료로 사용되는 중수소입니다.',
    baseValue: 50,
    stellarConditions: {
      spectralClasses: ['O', 'B', 'A', 'F', 'G'],
      temperatureRange: [5000, 30000],
      massRange: [0.8, 50],
      luminosityRange: [1, 100000]
    },
    baseProbability: 25,
    maxYieldPerHour: 5
  },

  '헬륨-3': {
    id: 'helium3',
    nameKo: '헬륨-3',
    nameEn: 'Helium-3',
    category: ResourceCategory.STELLAR_MATTER,
    rarity: ResourceRarity.RARE,
    description: '매우 효율적인 핵융합 연료인 헬륨-3입니다.',
    baseValue: 100,
    stellarConditions: {
      spectralClasses: ['F', 'G', 'K'],
      temperatureRange: [3500, 7500],
      massRange: [0.5, 3],
      luminosityRange: [0.1, 100]
    },
    baseProbability: 15,
    maxYieldPerHour: 3
  },

  // === 기체 자원 ===
  '탄소': {
    id: 'carbon',
    nameKo: '탄소',
    nameEn: 'Carbon',
    category: ResourceCategory.GASES,
    rarity: ResourceRarity.COMMON,
    description: '탄소 기반 화합물의 기본 원소입니다.',
    baseValue: 12,
    stellarConditions: {
      spectralClasses: ['K', 'M', 'C'],
      temperatureRange: [2000, 5000],
      massRange: [0.1, 10],
      luminosityRange: [0.001, 1000]
    },
    baseProbability: 70,
    maxYieldPerHour: 20
  },

  '실리콘': {
    id: 'silicon',
    nameKo: '실리콘',
    nameEn: 'Silicon',
    category: ResourceCategory.GASES,
    rarity: ResourceRarity.UNCOMMON,
    description: '반도체 제조에 필수적인 실리콘입니다.',
    baseValue: 20,
    stellarConditions: {
      spectralClasses: ['A', 'F', 'G', 'K'],
      temperatureRange: [3000, 10000],
      massRange: [0.5, 5],
      luminosityRange: [0.1, 1000]
    },
    baseProbability: 40,
    maxYieldPerHour: 12
  },

  // === 금속 자원 ===
  '금속 증기': {
    id: 'metal_vapor',
    nameKo: '금속 증기',
    nameEn: 'Metal Vapor',
    category: ResourceCategory.METALS,
    rarity: ResourceRarity.COMMON,
    description: '항성 대기에서 증발한 각종 금속들입니다.',
    baseValue: 15,
    stellarConditions: {
      spectralClasses: ['K', 'M'],
      temperatureRange: [2000, 5000],
      massRange: [0.1, 2],
      luminosityRange: [0.001, 100]
    },
    baseProbability: 60,
    maxYieldPerHour: 18
  },

  '철': {
    id: 'iron',
    nameKo: '철',
    nameEn: 'Iron',
    category: ResourceCategory.METALS,
    rarity: ResourceRarity.UNCOMMON,
    description: '우주에서 가장 안정적인 원소 중 하나입니다.',
    baseValue: 18,
    stellarConditions: {
      spectralClasses: ['M', 'K'],
      temperatureRange: [2000, 4000],
      massRange: [0.1, 1.5],
      luminosityRange: [0.001, 10]
    },
    baseProbability: 35,
    maxYieldPerHour: 10
  },

  '중원소': {
    id: 'heavy_elements',
    nameKo: '중원소',
    nameEn: 'Heavy Elements',
    category: ResourceCategory.METALS,
    rarity: ResourceRarity.RARE,
    description: '거대한 항성에서만 생성되는 무거운 원소들입니다.',
    baseValue: 80,
    stellarConditions: {
      spectralClasses: ['O', 'B'],
      temperatureRange: [15000, 50000],
      massRange: [8, 100],
      luminosityRange: [1000, 1000000]
    },
    baseProbability: 20,
    maxYieldPerHour: 6
  },

  // === 결정체 자원 ===
  '성간먼지 입자': {
    id: 'interstellar_dust',
    nameKo: '성간먼지 입자',
    nameEn: 'Interstellar Dust',
    category: ResourceCategory.CRYSTALS,
    rarity: ResourceRarity.UNCOMMON,
    description: '성간 공간을 떠도는 미세한 결정 입자들입니다.',
    baseValue: 25,
    stellarConditions: {
      spectralClasses: ['A', 'F'],
      temperatureRange: [6000, 10000],
      massRange: [1, 5],
      luminosityRange: [1, 100]
    },
    baseProbability: 30,
    maxYieldPerHour: 8
  },

  '희토류 원소': {
    id: 'rare_earth',
    nameKo: '희토류 원소',
    nameEn: 'Rare Earth Elements',
    category: ResourceCategory.CRYSTALS,
    rarity: ResourceRarity.RARE,
    description: '고급 기술에 필수적인 희귀 원소들입니다.',
    baseValue: 120,
    stellarConditions: {
      spectralClasses: ['F', 'G'],
      temperatureRange: [5000, 8000],
      massRange: [0.8, 3],
      luminosityRange: [0.5, 50]
    },
    baseProbability: 15,
    maxYieldPerHour: 4
  },

  // === 이상 물질 자원 ===
  '거대항성 물질': {
    id: 'giant_star_matter',
    nameKo: '거대항성 물질',
    nameEn: 'Giant Star Matter',
    category: ResourceCategory.EXOTIC_MATTER,
    rarity: ResourceRarity.RARE,
    description: '거대 항성의 극한 환경에서만 생성되는 특수 물질입니다.',
    baseValue: 200,
    stellarConditions: {
      spectralClasses: ['K', 'M'],
      temperatureRange: [3000, 5000],
      massRange: [0.5, 10],
      luminosityRange: [10, 10000]
    },
    baseProbability: 12,
    maxYieldPerHour: 3
  },

  '적색거성 물질': {
    id: 'red_giant_matter',
    nameKo: '적색거성 물질',
    nameEn: 'Red Giant Matter',
    category: ResourceCategory.EXOTIC_MATTER,
    rarity: ResourceRarity.VERY_RARE,
    description: '적색거성의 팽창한 외층에서 얻을 수 있는 희귀 물질입니다.',
    baseValue: 500,
    stellarConditions: {
      spectralClasses: ['M'],
      temperatureRange: [2000, 4000],
      massRange: [0.5, 20],
      luminosityRange: [100, 10000]
    },
    baseProbability: 8,
    maxYieldPerHour: 2
  },

  '항성 물질': {
    id: 'stellar_matter',
    nameKo: '항성 물질',
    nameEn: 'Stellar Matter',
    category: ResourceCategory.EXOTIC_MATTER,
    rarity: ResourceRarity.VERY_RARE,
    description: '항성 코어 근처에서만 형성되는 극도로 압축된 물질입니다.',
    baseValue: 800,
    stellarConditions: {
      spectralClasses: ['O', 'B'],
      temperatureRange: [20000, 50000],
      massRange: [15, 100],
      luminosityRange: [10000, 1000000]
    },
    baseProbability: 5,
    maxYieldPerHour: 1
  },

  // === 양자 물질 자원 ===
  '중원소 화합물': {
    id: 'heavy_compounds',
    nameKo: '중원소 화합물',
    nameEn: 'Heavy Element Compounds',
    category: ResourceCategory.QUANTUM,
    rarity: ResourceRarity.RARE,
    description: '중원소들이 복잡하게 결합한 고급 화합물입니다.',
    baseValue: 150,
    stellarConditions: {
      spectralClasses: ['K', 'M'],
      temperatureRange: [3000, 5000],
      massRange: [1, 10],
      luminosityRange: [1, 1000]
    },
    baseProbability: 10,
    maxYieldPerHour: 3
  },

  '연성 물질': {
    id: 'binary_matter',
    nameKo: '연성 물질',
    nameEn: 'Binary Star Matter',
    category: ResourceCategory.QUANTUM,
    rarity: ResourceRarity.VERY_RARE,
    description: '연성계의 중력 상호작용으로 생성되는 특수 물질입니다.',
    baseValue: 600,
    stellarConditions: {
      spectralClasses: ['G', 'F', 'A'],
      temperatureRange: [5000, 10000],
      massRange: [1, 5],
      luminosityRange: [1, 100]
    },
    baseProbability: 3,
    maxYieldPerHour: 1
  },

  '중력파 공명물질': {
    id: 'gravitational_resonance',
    nameKo: '중력파 공명물질',
    nameEn: 'Gravitational Resonance Matter',
    category: ResourceCategory.QUANTUM,
    rarity: ResourceRarity.LEGENDARY,
    description: '중력파와 공명하는 극히 희귀한 물질입니다.',
    baseValue: 1500,
    stellarConditions: {
      spectralClasses: ['G'],
      temperatureRange: [5000, 6000],
      massRange: [2, 5],
      luminosityRange: [10, 100]
    },
    baseProbability: 1,
    maxYieldPerHour: 0.5
  },

  // === 암흑 물질 자원 ===
  '방사성 동위원소': {
    id: 'radioactive_isotopes',
    nameKo: '방사성 동위원소',
    nameEn: 'Radioactive Isotopes',
    category: ResourceCategory.DARK_MATTER,
    rarity: ResourceRarity.VERY_RARE,
    description: '불안정한 핵을 가진 방사성 동위원소들입니다.',
    baseValue: 400,
    stellarConditions: {
      spectralClasses: ['M'],
      temperatureRange: [2000, 4000],
      massRange: [10, 30],
      luminosityRange: [1000, 100000],
      variableStarsOnly: true
    },
    baseProbability: 4,
    maxYieldPerHour: 1
  },

  '중성자 물질': {
    id: 'neutron_matter',
    nameKo: '중성자 물질',
    nameEn: 'Neutron Matter',
    category: ResourceCategory.DARK_MATTER,
    rarity: ResourceRarity.LEGENDARY,
    description: '중성자별 수준의 밀도를 가진 극한 물질입니다.',
    baseValue: 2000,
    stellarConditions: {
      spectralClasses: ['M'],
      temperatureRange: [2000, 4000],
      massRange: [15, 50],
      luminosityRange: [10000, 100000],
      variableStarsOnly: true
    },
    baseProbability: 0.5,
    maxYieldPerHour: 0.2
  },

  '초신성 전구물질': {
    id: 'supernova_precursor',
    nameKo: '초신성 전구물질',
    nameEn: 'Supernova Precursor',
    category: ResourceCategory.DARK_MATTER,
    rarity: ResourceRarity.UNIQUE,
    description: '초신성 폭발 직전의 항성에서만 발견되는 유일무이한 물질입니다.',
    baseValue: 5000,
    stellarConditions: {
      spectralClasses: ['M'],
      temperatureRange: [2000, 4000],
      massRange: [15, 50],
      luminosityRange: [50000, 100000],
      variableStarsOnly: true
    },
    baseProbability: 0.1,
    maxYieldPerHour: 0.1
  }
};

// 자원 희소성별 가중치 (확률 수정용)
export const RARITY_WEIGHTS: Record<ResourceRarity, number> = {
  [ResourceRarity.COMMON]: 1.0,
  [ResourceRarity.UNCOMMON]: 0.7,
  [ResourceRarity.RARE]: 0.4,
  [ResourceRarity.VERY_RARE]: 0.2,
  [ResourceRarity.LEGENDARY]: 0.05,
  [ResourceRarity.UNIQUE]: 0.01
};

// 분광형별 자원 보너스
export const SPECTRAL_CLASS_BONUSES: Record<string, Record<ResourceCategory, number>> = {
  'O': {
    [ResourceCategory.STELLAR_ENERGY]: 1.5,
    [ResourceCategory.STELLAR_MATTER]: 1.3,
    [ResourceCategory.GASES]: 0.8,
    [ResourceCategory.METALS]: 1.2,
    [ResourceCategory.CRYSTALS]: 0.9,
    [ResourceCategory.EXOTIC_MATTER]: 1.4,
    [ResourceCategory.QUANTUM]: 1.1,
    [ResourceCategory.DARK_MATTER]: 0.8
  },
  'B': {
    [ResourceCategory.STELLAR_ENERGY]: 1.3,
    [ResourceCategory.STELLAR_MATTER]: 1.2,
    [ResourceCategory.GASES]: 0.9,
    [ResourceCategory.METALS]: 1.1,
    [ResourceCategory.CRYSTALS]: 0.95,
    [ResourceCategory.EXOTIC_MATTER]: 1.2,
    [ResourceCategory.QUANTUM]: 1.0,
    [ResourceCategory.DARK_MATTER]: 0.9
  },
  'A': {
    [ResourceCategory.STELLAR_ENERGY]: 1.1,
    [ResourceCategory.STELLAR_MATTER]: 1.1,
    [ResourceCategory.GASES]: 1.0,
    [ResourceCategory.METALS]: 0.9,
    [ResourceCategory.CRYSTALS]: 1.2,
    [ResourceCategory.EXOTIC_MATTER]: 0.9,
    [ResourceCategory.QUANTUM]: 1.0,
    [ResourceCategory.DARK_MATTER]: 0.8
  },
  'F': {
    [ResourceCategory.STELLAR_ENERGY]: 1.0,
    [ResourceCategory.STELLAR_MATTER]: 1.0,
    [ResourceCategory.GASES]: 1.1,
    [ResourceCategory.METALS]: 0.9,
    [ResourceCategory.CRYSTALS]: 1.1,
    [ResourceCategory.EXOTIC_MATTER]: 0.8,
    [ResourceCategory.QUANTUM]: 1.1,
    [ResourceCategory.DARK_MATTER]: 0.7
  },
  'G': {
    [ResourceCategory.STELLAR_ENERGY]: 1.0,
    [ResourceCategory.STELLAR_MATTER]: 1.0,
    [ResourceCategory.GASES]: 1.0,
    [ResourceCategory.METALS]: 1.0,
    [ResourceCategory.CRYSTALS]: 1.0,
    [ResourceCategory.EXOTIC_MATTER]: 1.0,
    [ResourceCategory.QUANTUM]: 1.0,
    [ResourceCategory.DARK_MATTER]: 1.0
  },
  'K': {
    [ResourceCategory.STELLAR_ENERGY]: 0.9,
    [ResourceCategory.STELLAR_MATTER]: 0.9,
    [ResourceCategory.GASES]: 1.1,
    [ResourceCategory.METALS]: 1.2,
    [ResourceCategory.CRYSTALS]: 0.9,
    [ResourceCategory.EXOTIC_MATTER]: 1.1,
    [ResourceCategory.QUANTUM]: 1.1,
    [ResourceCategory.DARK_MATTER]: 1.1
  },
  'M': {
    [ResourceCategory.STELLAR_ENERGY]: 0.7,
    [ResourceCategory.STELLAR_MATTER]: 0.8,
    [ResourceCategory.GASES]: 1.2,
    [ResourceCategory.METALS]: 1.3,
    [ResourceCategory.CRYSTALS]: 0.8,
    [ResourceCategory.EXOTIC_MATTER]: 1.2,
    [ResourceCategory.QUANTUM]: 0.9,
    [ResourceCategory.DARK_MATTER]: 1.5
  }
};

// 유틸리티 함수들
export function getResourcesByCategory(category: ResourceCategory): ResourceInfo[] {
  return Object.values(RESOURCE_DATABASE).filter(resource => resource.category === category);
}

export function getResourcesByRarity(rarity: ResourceRarity): ResourceInfo[] {
  return Object.values(RESOURCE_DATABASE).filter(resource => resource.rarity === rarity);
}

export function getResourceById(id: string): ResourceInfo | undefined {
  return Object.values(RESOURCE_DATABASE).find(resource => resource.id === id);
}

export function getResourceByName(nameKo: string): ResourceInfo | undefined {
  return RESOURCE_DATABASE[nameKo];
} 