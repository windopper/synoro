// 제조 자원 시스템 정의
// researchTechs.ts와 shipModules.ts에서 사용되는 모든 제조 자원을 체계적으로 정의

// 제조 자원 카테고리 정의
export enum ManufacturingCategory {
  BASIC = 'BASIC',           // 기본 재료
  PROCESSED = 'PROCESSED',   // 가공 재료  
  ADVANCED = 'ADVANCED',     // 고급 재료
  COMPONENTS = 'COMPONENTS', // 부품류
  SPECIAL = 'SPECIAL'        // 특수 재료
}

// 제조 난이도 정의
export enum ManufacturingDifficulty {
  EASY = 'EASY',       // 쉬움
  MEDIUM = 'MEDIUM',   // 보통
  HARD = 'HARD',       // 어려움
  EXTREME = 'EXTREME'  // 극도로 어려움
}

// 제조 자원 정보 인터페이스
export interface ManufacturingResource {
  id: string;
  nameKo: string;
  nameEn: string;
  category: ManufacturingCategory;
  difficulty: ManufacturingDifficulty;
  description: string;
  sources: string[];                    // 획득 방법들
  requiredFacilities?: string[];        // 필요 시설
  requiredTech?: string[];              // 필요 기술
  baseValue: number;                    // 기본 가치
  manufacturingTime?: number;           // 제조 시간 (초)
  prerequisites?: {                     // 전제 조건 자원
    [resourceName: string]: number;
  };
}

// === 기본 재료 (BASIC) ===
export const BASIC_MATERIALS: ManufacturingResource[] = [
  {
    id: 'MAT_TITANIUM',
    nameKo: '티타늄',
    nameEn: 'Titanium',
    category: ManufacturingCategory.BASIC,
    difficulty: ManufacturingDifficulty.EASY,
    description: '가장 기본적인 구조 재료. 대부분의 천체에서 발견됩니다.',
    sources: ['소행성 채굴', '행성 표면 채굴', '우주정거장 거래'],
    baseValue: 10,
  },
  {
    id: 'MAT_COPPER',
    nameKo: '구리',
    nameEn: 'Copper',
    category: ManufacturingCategory.BASIC,
    difficulty: ManufacturingDifficulty.EASY,
    description: '전기 전도성이 뛰어난 기본 금속입니다.',
    sources: ['소행성 채굴', '전자 장비 분해', '폐기물 재활용'],
    baseValue: 8,
  },
  {
    id: 'MAT_ALUMINUM',
    nameKo: '알루미늄',
    nameEn: 'Aluminum',
    category: ManufacturingCategory.BASIC,
    difficulty: ManufacturingDifficulty.EASY,
    description: '가벼우면서도 강한 합금 재료입니다.',
    sources: ['행성 표면 채굴', '우주정거장 거래', '재활용 센터'],
    baseValue: 12,
  },
  {
    id: 'MAT_IRON_ORE',
    nameKo: '철광석',
    nameEn: 'Iron Ore',
    category: ManufacturingCategory.BASIC,
    difficulty: ManufacturingDifficulty.EASY,
    description: '가장 흔한 금속 광물입니다.',
    sources: ['소행성 채굴', '행성 표면 채굴'],
    baseValue: 5,
  },
  {
    id: 'MAT_SILICON',
    nameKo: '실리콘',
    nameEn: 'Silicon',
    category: ManufacturingCategory.BASIC,
    difficulty: ManufacturingDifficulty.EASY,
    description: '전자 부품 제조의 기본 원료입니다.',
    sources: ['행성 표면 채굴', '모래 정제'],
    baseValue: 15,
  },
  {
    id: 'MAT_WIRING',
    nameKo: '배선재',
    nameEn: 'Wiring Material',
    category: ManufacturingCategory.BASIC,
    difficulty: ManufacturingDifficulty.EASY,
    description: '전기 배선용 기본 도체 재료입니다.',
    sources: ['전기 공학 제조소', '도체 가공', '구리 가공'],
    baseValue: 20,
    prerequisites: { '구리': 2 }
  },
  {
    id: 'MAT_INSULATOR',
    nameKo: '절연체',
    nameEn: 'Insulator',
    category: ManufacturingCategory.BASIC,
    difficulty: ManufacturingDifficulty.EASY,
    description: '전기 절연을 위한 특수 재료입니다.',
    sources: ['화학 공학 제조소', '절연 재료 연구', '플라스틱 가공'],
    baseValue: 18,
  }
];

// === 가공 재료 (PROCESSED) ===
export const PROCESSED_MATERIALS: ManufacturingResource[] = [
  {
    id: 'MAT_REFINED_TRITANIUM',
    nameKo: '제련된 트리타늄',
    nameEn: 'Refined Tritanium',
    category: ManufacturingCategory.PROCESSED,
    difficulty: ManufacturingDifficulty.MEDIUM,
    description: '티타늄을 정제한 고순도 금속입니다.',
    sources: ['기초 정제소', '고급 정제 시설'],
    requiredFacilities: ['기초 광물 정제소'],
    baseValue: 35,
    manufacturingTime: 300,
    prerequisites: { '티타늄': 3 }
  },
  {
    id: 'MAT_HIGH_PURITY_COPPER',
    nameKo: '고순도 구리',
    nameEn: 'High Purity Copper',
    category: ManufacturingCategory.PROCESSED,
    difficulty: ManufacturingDifficulty.MEDIUM,
    description: '99.9% 순도의 구리로 정밀 장비에 사용됩니다.',
    sources: ['전문 정제소', '나노기술 정제'],
    requiredFacilities: ['고급 정제소'],
    baseValue: 50,
    manufacturingTime: 420,
    prerequisites: { '구리': 4 }
  },
  {
    id: 'MAT_TUNGSTEN_ALLOY',
    nameKo: '텅스텐 합금',
    nameEn: 'Tungsten Alloy',
    category: ManufacturingCategory.PROCESSED,
    difficulty: ManufacturingDifficulty.MEDIUM,
    description: '고온에서도 견디는 내열 합금입니다.',
    sources: ['고온 정제소', '특수 합금 제조'],
    requiredFacilities: ['특수 합금 제조소'],
    baseValue: 80,
    manufacturingTime: 600,
    prerequisites: { '철광석': 2, '희귀 금속': 1 }
  },
  {
    id: 'MAT_SUPERCONDUCTING_WIRE',
    nameKo: '초전도 배선재',
    nameEn: 'Superconducting Wire',
    category: ManufacturingCategory.PROCESSED,
    difficulty: ManufacturingDifficulty.HARD,
    description: '저항이 없는 초전도 배선 재료입니다.',
    sources: ['첨단 제조소', '초전도 기술 연구'],
    requiredTech: ['초전도 기술'],
    requiredFacilities: ['초전도 연구소'],
    baseValue: 150,
    manufacturingTime: 900,
    prerequisites: { '고순도 구리': 2, '특수 코팅재': 1 }
  },
  {
    id: 'MAT_STEEL_PLATE',
    nameKo: '강화 강철판',
    nameEn: 'Reinforced Steel Plate',
    category: ManufacturingCategory.PROCESSED,
    difficulty: ManufacturingDifficulty.MEDIUM,
    description: '함체 장갑용 강화 강철 판재입니다.',
    sources: ['중공업 제조소', '합금 압연소'],
    requiredFacilities: ['금속 가공 시설'],
    baseValue: 45,
    manufacturingTime: 480,
    prerequisites: { '철광석': 5, '탄소': 1 }
  }
];

// === 고급 재료 (ADVANCED) ===
export const ADVANCED_MATERIALS: ManufacturingResource[] = [
  {
    id: 'MAT_QUANTUM_CRYSTAL',
    nameKo: '퀀텀 크리스탈',
    nameEn: 'Quantum Crystal',
    category: ManufacturingCategory.ADVANCED,
    difficulty: ManufacturingDifficulty.HARD,
    description: '양자 효과를 활용한 첨단 기술 재료입니다.',
    sources: ['특수 행성 탐사', '고급 연구소 제작', '양자 실험실'],
    requiredTech: ['양자물리학 연구'],
    requiredFacilities: ['양자 연구소'],
    baseValue: 500,
    manufacturingTime: 1800,
    prerequisites: { '실리콘': 10, '희귀 원소': 3 }
  },
  {
    id: 'MAT_REINFORCED_ALLOY',
    nameKo: '강화 합금',
    nameEn: 'Reinforced Alloy',
    category: ManufacturingCategory.ADVANCED,
    difficulty: ManufacturingDifficulty.HARD,
    description: '극한 환경에서도 견디는 특수 합금입니다.',
    sources: ['첨단 제련소', '외계 기술 역공학'],
    requiredFacilities: ['첨단 합금 제련소'],
    baseValue: 300,
    manufacturingTime: 1200,
    prerequisites: { '텅스텐 합금': 3, '티타늄': 5, '특수 첨가제': 2 }
  },
  {
    id: 'MAT_PRECISION_CONTROLLER',
    nameKo: '정밀 제어기',
    nameEn: 'Precision Controller',
    category: ManufacturingCategory.ADVANCED,
    difficulty: ManufacturingDifficulty.HARD,
    description: '나노미터 수준의 정밀 제어가 가능한 장치입니다.',
    sources: ['나노기술 제조소', 'AI 보조 제작'],
    requiredTech: ['나노기술', 'AI 제어 시스템'],
    requiredFacilities: ['나노기술 연구소'],
    baseValue: 800,
    manufacturingTime: 2400,
    prerequisites: { '마이크로프로세서': 5, '초전도 배선재': 3, '센서 어레이': 2 }
  },
  {
    id: 'MAT_DEUTERIUM_TANK',
    nameKo: '중수소 탱크',
    nameEn: 'Deuterium Tank',
    category: ManufacturingCategory.ADVANCED,
    difficulty: ManufacturingDifficulty.HARD,
    description: '중수소를 안전하게 저장하는 특수 용기입니다.',
    sources: ['극저온 제조소', '핵연료 처리'],
    requiredTech: ['핵연료 처리 기술'],
    requiredFacilities: ['핵연료 처리 시설'],
    baseValue: 400,
    manufacturingTime: 1500,
    prerequisites: { '강화 합금': 2, '절연체': 5, '압력 제어 밸브': 1 }
  },
  {
    id: 'MAT_WARP_STABILIZER_BASIC',
    nameKo: '워프 안정기(기초)',
    nameEn: 'Basic Warp Stabilizer',
    category: ManufacturingCategory.ADVANCED,
    difficulty: ManufacturingDifficulty.HARD,
    description: '워프 시공간 왜곡을 안정화하는 장치입니다.',
    sources: ['시공간 연구소', '워프 기술 연구'],
    requiredTech: ['워프 물리학'],
    requiredFacilities: ['워프 연구소'],
    baseValue: 1200,
    manufacturingTime: 3600,
    prerequisites: { '퀀텀 크리스탈': 2, '초전도 배선재': 8, '중력파 센서': 1 }
  }
];

// === 기계 부품 (COMPONENTS) ===
export const MECHANICAL_COMPONENTS: ManufacturingResource[] = [
  {
    id: 'COMP_BASIC_PARTS',
    nameKo: '기본부품',
    nameEn: 'Basic Components',
    category: ManufacturingCategory.COMPONENTS,
    difficulty: ManufacturingDifficulty.EASY,
    description: '범용적으로 사용되는 기계 부품입니다.',
    sources: ['기본 제조소', '폐기된 장비 분해', '표준 공장'],
    baseValue: 25,
    manufacturingTime: 180,
    prerequisites: { '철광석': 2, '알루미늄': 1 }
  },
  {
    id: 'COMP_ADVANCED_PARTS',
    nameKo: '고급부품',
    nameEn: 'Advanced Components',
    category: ManufacturingCategory.COMPONENTS,
    difficulty: ManufacturingDifficulty.MEDIUM,
    description: '고정밀 기계에 사용되는 특수 부품입니다.',
    sources: ['정밀 제조소', '고급 기술 거래'],
    requiredFacilities: ['정밀 제조 시설'],
    baseValue: 75,
    manufacturingTime: 450,
    prerequisites: { '기본부품': 3, '정밀 가공재': 2 }
  },
  {
    id: 'COMP_THRUSTER_NOZZLE',
    nameKo: '추진 노즐',
    nameEn: 'Thruster Nozzle',
    category: ManufacturingCategory.COMPONENTS,
    difficulty: ManufacturingDifficulty.MEDIUM,
    description: '고효율 추진을 위한 특수 설계 노즐입니다.',
    sources: ['항공우주 제조소', '엔진 전문 제작'],
    requiredFacilities: ['추진 시스템 제조소'],
    baseValue: 120,
    manufacturingTime: 600,
    prerequisites: { '텅스텐 합금': 2, '정밀 가공재': 1 }
  },
  {
    id: 'COMP_MAGNETIC_COIL',
    nameKo: '자기장 코일',
    nameEn: 'Magnetic Field Coil',
    category: ManufacturingCategory.COMPONENTS,
    difficulty: ManufacturingDifficulty.MEDIUM,
    description: '강력한 자기장 생성을 위한 특수 코일입니다.',
    sources: ['전자기학 연구소', '고자기장 제조'],
    requiredTech: ['전자기학 연구'],
    baseValue: 200,
    manufacturingTime: 720,
    prerequisites: { '초전도 배선재': 4, '자성 재료': 2 }
  },
  {
    id: 'COMP_PLASMA_INJECTOR',
    nameKo: '플라즈마 인젝터',
    nameEn: 'Plasma Injector',
    category: ManufacturingCategory.COMPONENTS,
    difficulty: ManufacturingDifficulty.HARD,
    description: '플라즈마를 정밀 주입하는 첨단 장치입니다.',
    sources: ['플라즈마 연구소', '고에너지 물리학'],
    requiredTech: ['플라즈마 물리학'],
    baseValue: 350,
    manufacturingTime: 1200,
    prerequisites: { '자기장 코일': 2, '내열 재료': 3, '정밀 제어기': 1 }
  }
];

// === 전자 부품 (COMPONENTS) ===
export const ELECTRONIC_COMPONENTS: ManufacturingResource[] = [
  {
    id: 'COMP_BASIC_CIRCUIT',
    nameKo: '기본 회로',
    nameEn: 'Basic Circuit',
    category: ManufacturingCategory.COMPONENTS,
    difficulty: ManufacturingDifficulty.EASY,
    description: '기본적인 전자 회로 기판입니다.',
    sources: ['전자 제조소', '오래된 장비 분해'],
    baseValue: 30,
    manufacturingTime: 240,
    prerequisites: { '실리콘': 2, '구리': 1 }
  },
  {
    id: 'COMP_CONTROL_CHIP',
    nameKo: '제어 칩',
    nameEn: 'Control Chip',
    category: ManufacturingCategory.COMPONENTS,
    difficulty: ManufacturingDifficulty.MEDIUM,
    description: '정밀 제어에 사용되는 마이크로칩입니다.',
    sources: ['반도체 제조소', '고급 기술 연구'],
    requiredTech: ['반도체 기술'],
    baseValue: 100,
    manufacturingTime: 600,
    prerequisites: { '실리콘 웨이퍼': 2, '순수 금속': 1 }
  },
  {
    id: 'COMP_SILICON_WAFER',
    nameKo: '실리콘 웨이퍼',
    nameEn: 'Silicon Wafer',
    category: ManufacturingCategory.COMPONENTS,
    difficulty: ManufacturingDifficulty.MEDIUM,
    description: '반도체 제조의 기본 재료입니다.',
    sources: ['반도체 공장', '고순도 실리콘 정제'],
    requiredFacilities: ['반도체 제조 시설'],
    baseValue: 80,
    manufacturingTime: 480,
    prerequisites: { '실리콘': 3 }
  },
  {
    id: 'COMP_DATA_CABLE',
    nameKo: '데이터 케이블',
    nameEn: 'Data Cable',
    category: ManufacturingCategory.COMPONENTS,
    difficulty: ManufacturingDifficulty.EASY,
    description: '고속 데이터 전송용 특수 케이블입니다.',
    sources: ['통신 장비 제조소', '광섬유 제작'],
    baseValue: 40,
    manufacturingTime: 300,
    prerequisites: { '배선재': 2, '절연체': 1 }
  },
  {
    id: 'COMP_BATTERY_CELL',
    nameKo: '납 배터리 셀',
    nameEn: 'Lead Battery Cell',
    category: ManufacturingCategory.COMPONENTS,
    difficulty: ManufacturingDifficulty.EASY,
    description: '기본적인 에너지 저장 셀입니다.',
    sources: ['배터리 제조소', '전기화학 연구'],
    baseValue: 35,
    manufacturingTime: 360,
    prerequisites: { '납': 2, '산성 전해질': 1 }
  }
];

// === 특수 부품 및 장비 (SPECIAL) ===
export const SPECIAL_COMPONENTS: ManufacturingResource[] = [
  {
    id: 'SPEC_MICROPROCESSOR',
    nameKo: '마이크로프로세서',
    nameEn: 'Microprocessor',
    category: ManufacturingCategory.SPECIAL,
    difficulty: ManufacturingDifficulty.MEDIUM,
    description: '고성능 컴퓨팅을 위한 처리 장치입니다.',
    sources: ['첨단 반도체 공장', '컴퓨터 기술 연구'],
    requiredTech: ['컴퓨터 기술'],
    baseValue: 200,
    manufacturingTime: 900,
    prerequisites: { '실리콘 웨이퍼': 3, '제어 칩': 2 }
  },
  {
    id: 'SPEC_SENSOR_ARRAY',
    nameKo: '센서 어레이',
    nameEn: 'Sensor Array',
    category: ManufacturingCategory.SPECIAL,
    difficulty: ManufacturingDifficulty.MEDIUM,
    description: '다중 센서가 통합된 감지 시스템입니다.',
    sources: ['센서 기술 연구소', '정밀 계측 장비 제조'],
    baseValue: 150,
    manufacturingTime: 720,
    prerequisites: { '광학 렌즈': 2, '제어 칩': 1, '정밀 가공재': 1 }
  },
  {
    id: 'SPEC_SUPERCONDUCTOR_COIL',
    nameKo: '초전도 코일',
    nameEn: 'Superconductor Coil',
    category: ManufacturingCategory.SPECIAL,
    difficulty: ManufacturingDifficulty.HARD,
    description: '극저온에서 작동하는 초전도 코일입니다.',
    sources: ['극저온 연구소', '초전도 기술 연구'],
    requiredTech: ['초전도 기술', '극저온 공학'],
    baseValue: 600,
    manufacturingTime: 1800,
    prerequisites: { '초전도 배선재': 5, '극저온 냉각재': 2 }
  }
];

// 모든 제조 자원을 하나의 배열로 통합
export const ALL_MANUFACTURING_RESOURCES: ManufacturingResource[] = [
  ...BASIC_MATERIALS,
  ...PROCESSED_MATERIALS,
  ...ADVANCED_MATERIALS,
  ...MECHANICAL_COMPONENTS,
  ...ELECTRONIC_COMPONENTS,
  ...SPECIAL_COMPONENTS
];

// 카테고리별 자원 맵
export const MANUFACTURING_BY_CATEGORY = {
  [ManufacturingCategory.BASIC]: BASIC_MATERIALS,
  [ManufacturingCategory.PROCESSED]: PROCESSED_MATERIALS,
  [ManufacturingCategory.ADVANCED]: ADVANCED_MATERIALS,
  [ManufacturingCategory.COMPONENTS]: [...MECHANICAL_COMPONENTS, ...ELECTRONIC_COMPONENTS],
  [ManufacturingCategory.SPECIAL]: SPECIAL_COMPONENTS
};

// 자원 ID나 이름으로 자원 정보 찾기 함수
export const getManufacturingResourceById = (id: string): ManufacturingResource | undefined => {
  return ALL_MANUFACTURING_RESOURCES.find(resource => resource.id === id);
};

export const getManufacturingResourceByName = (name: string): ManufacturingResource | undefined => {
  return ALL_MANUFACTURING_RESOURCES.find(resource => 
    resource.nameKo === name || resource.nameEn === name
  );
};

// 카테고리별 자원 필터링 함수
export const getManufacturingResourcesByCategory = (category: ManufacturingCategory): ManufacturingResource[] => {
  return ALL_MANUFACTURING_RESOURCES.filter(resource => resource.category === category);
};

// 난이도별 자원 필터링 함수
export const getManufacturingResourcesByDifficulty = (difficulty: ManufacturingDifficulty): ManufacturingResource[] => {
  return ALL_MANUFACTURING_RESOURCES.filter(resource => resource.difficulty === difficulty);
};

// 필요 기술이 있는 자원들 찾기
export const getResourcesRequiringTech = (techId: string): ManufacturingResource[] => {
  return ALL_MANUFACTURING_RESOURCES.filter(resource => 
    resource.requiredTech?.includes(techId)
  );
};

// 특정 시설이 필요한 자원들 찾기
export const getResourcesRequiringFacility = (facilityName: string): ManufacturingResource[] => {
  return ALL_MANUFACTURING_RESOURCES.filter(resource => 
    resource.requiredFacilities?.includes(facilityName)
  );
};

// 제조 체인 확인 함수 (어떤 자원이 다른 자원의 재료로 사용되는지)
export const getManufacturingChain = (resourceName: string): ManufacturingResource[] => {
  return ALL_MANUFACTURING_RESOURCES.filter(resource => 
    resource.prerequisites && Object.keys(resource.prerequisites).includes(resourceName)
  );
}; 