// 연구 기술 시스템 정의
// 개발자가 새로운 연구를 쉽게 추가할 수 있도록 구조화된 데이터

// 연구 카테고리 정의
export enum ResearchCategory {
  ENGINEERING = 'ENGINEERING',       // 공학 기술
  PHYSICS = 'PHYSICS',               // 물리학
  MATERIALS = 'MATERIALS',           // 재료 과학
  COMPUTER = 'COMPUTER',             // 컴퓨터 과학
  BIOLOGY = 'BIOLOGY',               // 생명 과학
  ENERGY = 'ENERGY'                  // 에너지 기술
}

// 연구 상태 정의
export enum ResearchStatus {
  LOCKED = 'LOCKED',                 // 잠김 (선행 연구 미완료)
  AVAILABLE = 'AVAILABLE',           // 연구 가능
  IN_PROGRESS = 'IN_PROGRESS',       // 연구 중
  COMPLETED = 'COMPLETED'            // 완료
}

// 연구 비용 정의
export interface ResearchCost {
  researchPoints: number;            // 필요 연구 포인트
  requiredResources?: {              // 필요 자원 (선택사항)
    [resourceType: string]: number;
  };
  timeRequired: number;              // 연구 시간 (초)
}

// 연구 기술 정보 인터페이스
export interface ResearchTech {
  id: string;
  nameEn: string;
  nameKo: string;
  category: ResearchCategory;
  description: string;
  detailedDescription: string;
  cost: ResearchCost;
  prerequisites: string[];           // 선행 연구 ID 목록
  unlocks: string[];                 // 해금되는 모듈/기능 ID 목록
  effects: string[];                 // 연구 완료 시 효과 설명
  tier: number;                      // 연구 티어 (0-5)
}

// 연구 진행 상황 인터페이스
export interface ResearchProgress {
  techId: string;
  currentPoints: number;
  totalPoints: number;
  startTime: number;
  estimatedCompletion: number;
}

// === 공학 기술 연구 ===
export const ENGINEERING_TECHS: ResearchTech[] = [
  // 티어 0 - 기초 공학
  {
    id: 'TECH_BASIC_ENGINEERING',
    nameEn: 'Basic Engineering',
    nameKo: '기초 공학',
    category: ResearchCategory.ENGINEERING,
    description: '기본적인 공학 원리와 제조 기술을 습득합니다.',
    detailedDescription: '함선 제조와 수리의 기초가 되는 공학 기술입니다. 이 연구를 통해 더 복잡한 시스템을 이해하고 개발할 수 있게 됩니다.',
    cost: {
      researchPoints: 50,
      timeRequired: 300 // 5분
    },
    prerequisites: [],
    unlocks: ['기본 수리 도구', '표준 합금'],
    effects: ['기본 모듈 제작 가능', '수리 효율 +10%'],
    tier: 0
  },
  {
    id: 'TECH_ADVANCED_MATERIALS',
    nameEn: 'Advanced Materials',
    nameKo: '고급 재료학',
    category: ResearchCategory.ENGINEERING,
    description: '고성능 합금과 복합재료 제작 기술을 개발합니다.',
    detailedDescription: '새로운 합금 제작법과 나노 기술을 활용한 복합재료 연구로 더 강력하고 가벼운 구조물을 만들 수 있습니다.',
    cost: {
      researchPoints: 150,
      requiredResources: { '철광석': 20, '알루미늄': 15 },
      timeRequired: 600 // 10분
    },
    prerequisites: ['TECH_BASIC_ENGINEERING'],
    unlocks: ['강화 합금', '복합 장갑재'],
    effects: ['고급 모듈 제작 가능', '내구도 +20%'],
    tier: 1
  }
];

// === 물리학 연구 ===
export const PHYSICS_TECHS: ResearchTech[] = [
  // 티어 0 - 기초 물리학
  {
    id: 'TECH_BASIC_PHYSICS',
    nameEn: 'Basic Physics',
    nameKo: '기초 물리학',
    category: ResearchCategory.PHYSICS,
    description: '기본적인 물리 법칙과 원리를 학습합니다.',
    detailedDescription: '뉴턴 역학부터 기초 전자기학까지, 우주 항행에 필요한 기본 물리 지식을 습득합니다.',
    cost: {
      researchPoints: 40,
      timeRequired: 240 // 4분
    },
    prerequisites: [],
    unlocks: ['기본 센서', '관성 제어 장치'],
    effects: ['센서 정확도 +15%', '기동성 +10%'],
    tier: 0
  },
  {
    id: 'TECH_FUSION_01',
    nameEn: 'Fusion Technology I',
    nameKo: '핵융합 기술 I',
    category: ResearchCategory.PHYSICS,
    description: '기본적인 핵융합 반응 제어 기술을 개발합니다.',
    detailedDescription: '안전하고 효율적인 핵융합 반응을 제어하여 강력한 에너지원을 확보할 수 있습니다.',
    cost: {
      researchPoints: 200,
      requiredResources: { '중수소': 10, '희귀 금속': 5 },
      timeRequired: 900 // 15분
    },
    prerequisites: ['TECH_BASIC_PHYSICS'],
    unlocks: ['FRC_01_T1'], // 핵융합로 Mk.II
    effects: ['발전 효율 +25%', '연료 소비 -15%'],
    tier: 1
  },
  {
    id: 'TECH_FUSION_02',
    nameEn: 'Advanced Fusion Technology',
    nameKo: '고급 핵융합 기술',
    category: ResearchCategory.PHYSICS,
    description: '고도로 발전된 핵융합 기술을 마스터합니다.',
    detailedDescription: '최첨단 자기장 제어와 플라즈마 물리학을 활용하여 극도로 효율적인 핵융합로를 개발할 수 있습니다.',
    cost: {
      researchPoints: 500,
      requiredResources: { '삼중수소': 15, '초전도체': 8, '플라즈마 제어 장치': 3 },
      timeRequired: 1800 // 30분
    },
    prerequisites: ['TECH_FUSION_01'],
    unlocks: ['FRC_01_T2'], // 고급 핵융합 코어
    effects: ['발전 효율 +50%', '과부하 한계 +20%'],
    tier: 2
  }
];

// === 에너지 기술 연구 ===
export const ENERGY_TECHS: ResearchTech[] = [
  {
    id: 'TECH_POWER_MGMT_01',
    nameEn: 'Smart Power Management',
    nameKo: '스마트 전력 관리',
    category: ResearchCategory.ENERGY,
    description: '지능형 전력 분배 및 관리 시스템을 개발합니다.',
    detailedDescription: 'AI 기반 전력 분배 알고리즘으로 에너지 효율을 극대화하고 과부하 상황을 자동으로 관리합니다.',
    cost: {
      researchPoints: 120,
      requiredResources: { '마이크로프로세서': 10, '센서 어레이': 5 },
      timeRequired: 720 // 12분
    },
    prerequisites: ['TECH_BASIC_PHYSICS'],
    unlocks: ['PDU_01_T1'], // 스마트 에너지 그리드
    effects: ['에너지 효율 +15%', '자동 우선순위 관리'],
    tier: 1
  }
];

// === 추진 기술 연구 ===
export const PROPULSION_TECHS: ResearchTech[] = [
  {
    id: 'TECH_PROPULSION_01',
    nameEn: 'Plasma Propulsion',
    nameKo: '플라즈마 추진',
    category: ResearchCategory.PHYSICS,
    description: '플라즈마를 이용한 고효율 추진 시스템을 개발합니다.',
    detailedDescription: '이온화된 가스를 고속으로 분사하여 기존 화학 추진보다 훨씬 효율적인 추진력을 얻을 수 있습니다.',
    cost: {
      researchPoints: 180,
      requiredResources: { '자성 재료': 12, '플라즈마 가속기': 3 },
      timeRequired: 900 // 15분
    },
    prerequisites: ['TECH_BASIC_PHYSICS'],
    unlocks: ['SE_01_T1'], // 플라즈마 드라이브 Mk.I
    effects: ['추진 효율 +40%', '가속도 +25%'],
    tier: 1
  },
  {
    id: 'TECH_WARP_01',
    nameEn: 'Experimental Warp Drive',
    nameKo: '실험적 워프 드라이브',
    category: ResearchCategory.PHYSICS,
    description: '시공간 왜곡을 이용한 초광속 이동 기술을 연구합니다.',
    detailedDescription: '아인슈타인의 일반상대성이론을 기반으로 시공간을 압축/팽창시켜 광속보다 빠른 이동을 가능하게 합니다.',
    cost: {
      researchPoints: 800,
      requiredResources: { '이그조틱 물질': 5, '시공간 센서': 2, '중력파 생성기': 1 },
      timeRequired: 3600 // 60분
    },
    prerequisites: ['TECH_FUSION_01', 'TECH_PROPULSION_01'],
    unlocks: ['WD_01_T0'], // 실험형 워프 코일
    effects: ['성간 이동 가능', '워프 거리 +500%'],
    tier: 2
  }
];

// === 컴퓨터 과학 연구 ===
export const COMPUTER_TECHS: ResearchTech[] = [
  {
    id: 'TECH_AI_BASIC',
    nameEn: 'Basic AI Systems',
    nameKo: '기초 AI 시스템',
    category: ResearchCategory.COMPUTER,
    description: '기본적인 인공지능과 자동화 시스템을 개발합니다.',
    detailedDescription: '간단한 패턴 인식과 의사결정이 가능한 AI를 개발하여 함선 운용을 자동화합니다.',
    cost: {
      researchPoints: 100,
      requiredResources: { '프로세서 칩': 8, '메모리 모듈': 12 },
      timeRequired: 600 // 10분
    },
    prerequisites: ['TECH_BASIC_ENGINEERING'],
    unlocks: ['자동 항법 시스템', 'AI 보조 관제'],
    effects: ['자동화 효율 +20%', '오류 감소 -30%'],
    tier: 1
  }
];

// 모든 연구 기술을 하나의 배열로 통합
export const ALL_RESEARCH_TECHS: ResearchTech[] = [
  ...ENGINEERING_TECHS,
  ...PHYSICS_TECHS,
  ...ENERGY_TECHS,
  ...PROPULSION_TECHS,
  ...COMPUTER_TECHS
];

// 카테고리별 연구 기술 맵
export const RESEARCH_BY_CATEGORY = {
  [ResearchCategory.ENGINEERING]: ENGINEERING_TECHS,
  [ResearchCategory.PHYSICS]: PHYSICS_TECHS,
  [ResearchCategory.MATERIALS]: [],
  [ResearchCategory.COMPUTER]: COMPUTER_TECHS,
  [ResearchCategory.BIOLOGY]: [],
  [ResearchCategory.ENERGY]: ENERGY_TECHS
};

// 연구 ID로 연구 정보 찾기 함수
export const getResearchById = (id: string): ResearchTech | undefined => {
  return ALL_RESEARCH_TECHS.find(tech => tech.id === id);
};

// 카테고리별 연구 필터링 함수
export const getResearchByCategory = (category: ResearchCategory): ResearchTech[] => {
  return ALL_RESEARCH_TECHS.filter(tech => tech.category === category);
};

// 연구 의존성 확인 함수
export const canResearch = (techId: string, completedResearch: string[]): boolean => {
  const tech = getResearchById(techId);
  if (!tech) return false;

  return tech.prerequisites.every(prereq => completedResearch.includes(prereq));
};

// 연구 트리 계층 구조 생성 함수
export const buildResearchTree = (): Map<number, ResearchTech[]> => {
  const tree = new Map<number, ResearchTech[]>();
  
  ALL_RESEARCH_TECHS.forEach(tech => {
    if (!tree.has(tech.tier)) {
      tree.set(tech.tier, []);
    }
    tree.get(tech.tier)!.push(tech);
  });
  
  return tree;
};

// 연구 완료 시 해금되는 요소들 확인
export const getUnlocksByResearch = (completedResearch: string[]): string[] => {
  const unlocks: string[] = [];
  
  completedResearch.forEach(researchId => {
    const tech = getResearchById(researchId);
    if (tech) {
      unlocks.push(...tech.unlocks);
    }
  });
  
  return [...new Set(unlocks)]; // 중복 제거
}; 