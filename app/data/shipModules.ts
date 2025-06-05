// 함선 모듈 정의 및 기본 데이터
// 개발자가 새로운 모듈을 쉽게 추가할 수 있도록 구조화된 데이터

// 모듈 카테고리 정의
export enum ModuleCategory {
  POWER = "POWER", // 동력 시스템
  NAVIGATION = "NAVIGATION", // 항행 시스템
  EXPLORATION = "EXPLORATION", // 탐사 시스템
  COMMUNICATION = "COMMUNICATION", // 통신 시스템
  DEFENSE = "DEFENSE", // 방어 시스템
  RESOURCE = "RESOURCE", // 자원 관리 시스템
}

// 모듈 상태 정의
export enum ModuleStatus {
  NORMAL = "NORMAL", // 정상 작동
  DAMAGED = "DAMAGED", // 손상 상태
  DISABLED = "DISABLED", // 비활성화
  UPGRADING = "UPGRADING", // 업그레이드 중
  REPAIRING = "REPAIRING", // 수리 중
  ENERGY_SHORTAGE = "ENERGY_SHORTAGE", // 에너지 부족
}

// 자원 타입 정의
export interface ResourceCost {
  [resourceType: string]: number;
}

// 모듈 기본 정보 인터페이스
export interface ModuleInfo {
  id: string;
  nameEn: string;
  nameKo: string;
  tier: number;
  category: ModuleCategory;
  description: string;
  energyConsumption: {
    base: number;
    max: number;
  };
  requiredResearch?: string;
  requiredResources: ResourceCost;
  upgradeCost?: number; // RP 비용
  durability: number; // 내구도
  upgradeEffects?: string; // 업그레이드 효과 설명
}

// 모듈 성능 정보 인터페이스 (카테고리별로 다름)
export interface PowerModulePerformance {
  powerGeneration?: number; // 발전량 (PU)
  fuelEfficiency?: number; // 연료 효율 (%)
  distributionEfficiency?: number; // 분배 효율 (%)
  storageCapacity?: number; // 축전량 (CU)
  chargeRate?: number; // 충방전 속도 (CU/sec)
}

export interface NavigationModulePerformance {
  systemSpeed?: number; // 성계 내 속도 (SU)
  acceleration?: number; // 가속도 보너스 (%)
  warpRange?: number; // 워프 거리 (LY)
  warpPrepTime?: number; // 워프 준비 시간 (초)
  warpAccuracy?: number; // 워프 정확도 (%)
  calculationSpeed?: number; // 항로 계산 속도 보너스 (%)
  hazardDetection?: number; // 위험 요소 탐지 보너스 (%)
}

export interface ExplorationModulePerformance {
  scanRange?: number; // 스캔 범위 (AU)
  scanResolution?: number; // 스캔 해상도 보너스 (%)
  analysisAccuracy?: number; // 분석 정밀도 보너스 (%)
  dataProcessingRate?: number; // 데이터 처리 속도 (DP/hour)
  knowledgeConversionRate?: number; // 지식 변환 효율 보너스 (%)
  droneCapacity?: number; // 드론 운용 수
  specialDroneSlots?: number; // 특수 드론 슬롯
}

export interface CommunicationModulePerformance {
  communicationRange?: number; // 통신 거리 (LY, 0이면 무제한)
  transmissionSpeed?: number; // 전송 속도 (KP/sec)
  signalRange?: number; // 신호 범위 (AU)
  encryptionLevel?: number; // 암호화 수준
}

export interface DefenseModulePerformance {
  hullIntegrity?: number; // 함체 내구도 (HP)
  kineticResistance?: number; // 운동 에너지 저항 (%)
  energyResistance?: number; // 에너지 저항 (%)
  shieldCapacity?: number; // 방어막 용량 (SP)
  shieldRechargeRate?: number; // 방어막 재충전 속도 (SP/sec)
  repairRate?: number; // 수리 속도 (HP/sec)
  selfRepair?: boolean; // 자가 수리 가능 여부
}

export interface ResourceModulePerformance {
  extractionRate?: number; // 채취 속도 (RU/sec)
  extractionEfficiency?: number; // 채취 효율 보너스 (%)
  storageCapacity?: number; // 저장 용량 (CU)
  refiningEfficiency?: number; // 정제 효율 (%)
  specialSlots?: number; // 특수 자원 슬롯
}

// 통합 모듈 성능 타입
export type ModulePerformance =
  | PowerModulePerformance
  | NavigationModulePerformance
  | ExplorationModulePerformance
  | CommunicationModulePerformance
  | DefenseModulePerformance
  | ResourceModulePerformance;

// 완전한 모듈 정보
export interface CompleteModuleInfo extends ModuleInfo {
  performance: ModulePerformance;
}

// === 동력 시스템 모듈 정의 ===
export const POWER_MODULES: CompleteModuleInfo[] = [
  // 핵융합로 시리즈
  {
    id: "FRC_01_T0",
    nameEn: "Fusion Reactor Core Mk.I",
    nameKo: "핵융합로 Mk.I",
    tier: 0,
    category: ModuleCategory.POWER,
    description: "기본 핵융합 동력원. 안정적인 에너지 공급이 가능합니다.",
    energyConsumption: { base: 0, max: 0 },
    requiredResources: { 티타늄: 20, 구리: 15, 기본부품: 10 },
    durability: 100,
    performance: {
      powerGeneration: 100,
      fuelEfficiency: 100,
    } as PowerModulePerformance,
  },
  {
    id: "FRC_01_T1",
    nameEn: "Fusion Reactor Core Mk.II",
    nameKo: "핵융합로 Mk.II",
    tier: 1,
    category: ModuleCategory.POWER,
    description: "개선된 핵융합로. 발전량과 연료 효율이 향상되었습니다.",
    energyConsumption: { base: 0, max: 0 },
    requiredResearch: "TECH_FUSION_01",
    requiredResources: {
      "제련된 트리타늄": 30,
      "고순도 구리": 20,
      고급부품: 15,
    },
    upgradeCost: 200,
    durability: 120,
    upgradeEffects: "발전량 +50 PU, 연료 효율 +15%",
    performance: {
      powerGeneration: 150,
      fuelEfficiency: 110,
    } as PowerModulePerformance,
  },
  {
    id: "FRC_01_T2",
    nameEn: "Advanced Fusion Core",
    nameKo: "고급 핵융합 코어",
    tier: 2,
    category: ModuleCategory.POWER,
    description: "최첨단 핵융합 기술을 적용한 고성능 동력원입니다.",
    energyConsumption: { base: 0, max: 0 },
    requiredResearch: "TECH_FUSION_02",
    requiredResources: {
      "퀀텀 크리스탈": 10,
      "강화 합금": 40,
      "정밀 제어기": 5,
    },
    upgradeCost: 500,
    durability: 150,
    upgradeEffects:
      "발전량 +100 PU, 연료 효율 +20%, 안정성 증가로 과부하 한계 +10%",
    performance: {
      powerGeneration: 250,
      fuelEfficiency: 125,
    } as PowerModulePerformance,
  },

  // 에너지 분배기 시리즈
  {
    id: "PDU_01_T0",
    nameEn: "Power Distributor Unit",
    nameKo: "에너지 분배기",
    tier: 0,
    category: ModuleCategory.POWER,
    description: "기본적인 에너지 분배 시스템입니다.",
    energyConsumption: { base: 5, max: 5 },
    requiredResources: { 구리: 10, 배선재: 20, 절연체: 5 },
    durability: 80,
    performance: {
      distributionEfficiency: 85,
    } as PowerModulePerformance,
  },
  {
    id: "PDU_01_T1",
    nameEn: "Smart Power Grid",
    nameKo: "스마트 에너지 그리드",
    tier: 1,
    category: ModuleCategory.POWER,
    description:
      "지능형 에너지 분배 시스템. 과부하 시 자동으로 우선순위를 관리합니다.",
    energyConsumption: { base: 8, max: 8 },
    requiredResearch: "TECH_POWER_MGMT_01",
    requiredResources: {
      "초전도 배선재": 15,
      "제어 칩": 10,
      "데이터 케이블": 5,
    },
    upgradeCost: 150,
    durability: 100,
    upgradeEffects: "분배 효율 +5%, 과부하 관리 알고리즘 개선",
    performance: {
      distributionEfficiency: 92,
    } as PowerModulePerformance,
  },

  // 축전기 시리즈
  {
    id: "CB_01_T0",
    nameEn: "Capacitor Bank Mk.I",
    nameKo: "축전기 Mk.I",
    tier: 0,
    category: ModuleCategory.POWER,
    description: "기본적인 에너지 저장 장치입니다.",
    energyConsumption: { base: 0, max: 0 },
    requiredResources: { "납 배터리 셀": 10, 알루미늄: 15, "기본 회로": 5 },
    durability: 70,
    performance: {
      storageCapacity: 500,
      chargeRate: 10,
    } as PowerModulePerformance,
  },
];

// === 항행 시스템 모듈 정의 ===
export const NAVIGATION_MODULE_ENGINE_PREFIX = "SE_";
export const NAVIGATION_MODULE_WARP_PREFIX = "WD_";
export const NAVIGATION_MODULE_NAVIGATION_PREFIX = "NC_";

export const NAVIGATION_MODULES: CompleteModuleInfo[] = [
  // 엔진 시리즈
  {
    id: "SE_01_T0",
    nameEn: "Ion Thruster Mk.I",
    nameKo: "이온 추진기 Mk.I",
    tier: 0,
    category: ModuleCategory.NAVIGATION,
    description: "기본적인 이온 추진 시스템입니다.",
    energyConsumption: { base: 10, max: 30 },
    requiredResources: { 알루미늄: 20, "추진 노즐": 5, 기본부품: 10 },
    durability: 90,
    performance: {
      systemSpeed: 50,
      acceleration: 100,
    } as NavigationModulePerformance,
  },
  {
    id: "SE_01_T1",
    nameEn: "Plasma Drive Mk.I",
    nameKo: "플라즈마 드라이브 Mk.I",
    tier: 1,
    category: ModuleCategory.NAVIGATION,
    description: "플라즈마를 이용한 고효율 추진 시스템입니다.",
    energyConsumption: { base: 15, max: 45 },
    requiredResearch: "TECH_PROPULSION_01",
    requiredResources: {
      "텅스텐 합금": 25,
      "자기장 코일": 10,
      "플라즈마 인젝터": 5,
    },
    upgradeCost: 220,
    durability: 110,
    upgradeEffects: "속도 +40 SU, 가속도 +15%",
    performance: {
      systemSpeed: 80,
      acceleration: 120,
    } as NavigationModulePerformance,
  },

  // 워프 드라이브 시리즈
  {
    id: "WD_01_T0",
    nameEn: "Experimental Warp Coil",
    nameKo: "실험형 워프 코일",
    tier: 0,
    category: ModuleCategory.NAVIGATION,
    description: "실험적인 워프 기술을 적용한 초기형 워프 드라이브입니다.",
    energyConsumption: { base: 20, max: 20 },
    requiredResearch: "TECH_WARP_01",
    requiredResources: {
      "초전도 코일": 10,
      "중수소 탱크": 5,
      "워프 안정기(기초)": 2,
    },
    upgradeCost: 300,
    durability: 60,
    performance: {
      warpRange: 200,
    } as NavigationModulePerformance,
  },

  // 항법 컴퓨터 시리즈
  {
    id: "NC_01_T0",
    nameEn: "Navigational Processor Mk.I",
    nameKo: "항법 프로세서 Mk.I",
    tier: 0,
    category: ModuleCategory.NAVIGATION,
    description: "기본적인 항로 계산 및 항법 지원 시스템입니다.",
    energyConsumption: { base: 5, max: 5 },
    requiredResources: {
      "실리콘 웨이퍼": 15,
      "데이터 케이블": 10,
      "기본 회로": 5,
    },
    durability: 85,
    performance: {
      calculationSpeed: 100,
      hazardDetection: 50,
    } as NavigationModulePerformance,
  },
];

// === 탐사 시스템 모듈 정의 ===
export const EXPLORATION_MODULES: CompleteModuleInfo[] = [
  // 장거리 스캐너 시리즈
  {
    id: "LRS_01_T0",
    nameEn: "Wide-Spectrum Scanner Mk.I",
    nameKo: "광대역 스캐너 Mk.I",
    tier: 0,
    category: ModuleCategory.EXPLORATION,
    description: "기본적인 장거리 스캔 시스템입니다.",
    energyConsumption: { base: 10, max: 25 },
    requiredResources: {
      "광학 센서 어레이": 10,
      "신호 처리기": 5,
      "일반 금속": 15,
    },
    durability: 75,
    performance: {
      scanRange: 1,
      scanResolution: 100,
    } as ExplorationModulePerformance,
  },

  // 샘플 분석기 시리즈
  {
    id: "PAS_01_T0",
    nameEn: "Sample Analyzer Mk.I",
    nameKo: "샘플 분석기 Mk.I",
    tier: 0,
    category: ModuleCategory.EXPLORATION,
    description: "기본적인 물질 분석 장비입니다.",
    energyConsumption: { base: 8, max: 8 },
    requiredResources: {
      "분석용 칩셋": 5,
      "현미경 부품": 10,
      "실험용 유리": 5,
    },
    durability: 70,
    performance: {
      analysisAccuracy: 100,
    } as ExplorationModulePerformance,
  },

  // 드론 베이 시리즈
  {
    id: "EDB_01_T0",
    nameEn: "Drone Bay Mk.I",
    nameKo: "드론 베이 Mk.I",
    tier: 0,
    category: ModuleCategory.EXPLORATION,
    description: "기본적인 탐사 드론 운용 시설입니다.",
    energyConsumption: { base: 5, max: 15 },
    requiredResources: {
      "드론 격납 프레임": 1,
      "드론 제어기(기본)": 1,
      "예비 부품(드론)": 5,
    },
    durability: 80,
    performance: {
      droneCapacity: 1,
      specialDroneSlots: 0,
    } as ExplorationModulePerformance,
  },

  // 데이터 처리 모듈 시리즈
  {
    id: "KPU_01_T0",
    nameEn: "Data Processing Module Mk.I",
    nameKo: "데이터 처리 모듈 Mk.I",
    tier: 0,
    category: ModuleCategory.EXPLORATION,
    description: "기본적인 데이터 분석 및 처리 시스템입니다.",
    energyConsumption: { base: 10, max: 10 },
    requiredResources: {
      "CPU 코어(기본)": 2,
      "RAM 모듈(기본)": 5,
      "데이터 저장 장치(소형)": 1,
    },
    durability: 85,
    performance: {
      dataProcessingRate: 10,
      knowledgeConversionRate: 100,
    } as ExplorationModulePerformance,
  },
];

// === 통신 시스템 모듈 정의 ===
export const COMMUNICATION_MODULES: CompleteModuleInfo[] = [
  // 장거리 통신 시리즈
  {
    id: "LRCA_01_T0",
    nameEn: "Subspace Transceiver Mk.I",
    nameKo: "아공간 송수신기 Mk.I",
    tier: 0,
    category: ModuleCategory.COMMUNICATION,
    description: "기본적인 장거리 통신 시스템입니다.",
    energyConsumption: { base: 15, max: 50 },
    requiredResources: {
      "통신 안테나 어레이": 1,
      "신호 변조기": 2,
      "전력 증폭기(기본)": 3,
    },
    durability: 90,
    performance: {
      communicationRange: 100,
      transmissionSpeed: 1,
    } as CommunicationModulePerformance,
  },

  // 단거리 통신 시리즈
  {
    id: "SRT_01_T0",
    nameEn: "Short-Range Radio",
    nameKo: "단거리 무선기",
    tier: 0,
    category: ModuleCategory.COMMUNICATION,
    description: "근거리 통신 및 신호 탐지용 무선 시스템입니다.",
    energyConsumption: { base: 2, max: 2 },
    requiredResources: {
      "소형 안테나": 2,
      "저전력 트랜시버 칩": 3,
      "기본 필터": 1,
    },
    durability: 95,
    performance: {
      signalRange: 0.1,
    } as CommunicationModulePerformance,
  },
];

// === 방어 시스템 모듈 정의 ===
export const DEFENSE_MODULES: CompleteModuleInfo[] = [
  // 함체 장갑 시리즈
  {
    id: "HIF_01_T0",
    nameEn: "Standard Hull Plating",
    nameKo: "표준 함체 장갑",
    tier: 0,
    category: ModuleCategory.DEFENSE,
    description: "기본적인 함체 보호 장갑입니다.",
    energyConsumption: { base: 0, max: 0 },
    requiredResources: {
      "강화 강철판": 50,
      "구조 프레임": 20,
      "용접 키트": 10,
    },
    durability: 1000,
    performance: {
      hullIntegrity: 1000,
      kineticResistance: 0,
      energyResistance: 0,
    } as DefenseModulePerformance,
  },

  // 방어막 시리즈
  {
    id: "SG_01_T0",
    nameEn: "Electromagnetic Shield Mk.I",
    nameKo: "전자기 방어막 Mk.I",
    tier: 0,
    category: ModuleCategory.DEFENSE,
    description: "기본적인 에너지 방어막 시스템입니다.",
    energyConsumption: { base: 10, max: 25 },
    requiredResources: {
      "방어막 방출기": 2,
      "에너지 변환 코일": 5,
      "기본 제어기": 3,
    },
    durability: 100,
    performance: {
      shieldCapacity: 300,
      shieldRechargeRate: 5,
    } as DefenseModulePerformance,
  },

  // 수리 시스템 시리즈
  {
    id: "SRS_01_T0",
    nameEn: "Emergency Repair Kit",
    nameKo: "응급 수리 키트",
    tier: 0,
    category: ModuleCategory.DEFENSE,
    description: "기본적인 수동 수리 도구 세트입니다.",
    energyConsumption: { base: 0, max: 0 },
    requiredResources: {
      "휴대용 용접기": 1,
      "예비 부품 상자": 1,
      "수리 매뉴얼(데이터)": 1,
    },
    durability: 50,
    performance: {
      repairRate: 0.1,
      selfRepair: false,
    } as DefenseModulePerformance,
  },
];

// === 자원 관리 시스템 모듈 정의 ===
export const RESOURCE_MODULES: CompleteModuleInfo[] = [
  // 채굴 시스템 시리즈
  {
    id: "RE_01_T0",
    nameEn: "Basic Mining Laser",
    nameKo: "기본 채광 레이저",
    tier: 0,
    category: ModuleCategory.RESOURCE,
    description: "기본적인 자원 채취 시스템입니다.",
    energyConsumption: { base: 8, max: 8 },
    requiredResources: {},
    durability: 85,
    performance: {
      extractionRate: 5,
      extractionEfficiency: 100,
    } as ResourceModulePerformance,
  },

  // 화물칸 시리즈
  {
    id: "CH_01_T0",
    nameEn: "Standard Cargo Hold",
    nameKo: "표준 화물칸",
    tier: 0,
    category: ModuleCategory.RESOURCE,
    description: "기본적인 자원 저장 공간입니다.",
    energyConsumption: { base: 0, max: 0 },
    requiredResources: {
      "강화 컨테이너 유닛": 10,
      "내부 프레임": 5,
      "잠금 장치": 2,
    },
    durability: 120,
    performance: {
      storageCapacity: 500,
      specialSlots: 0,
    } as ResourceModulePerformance,
  },

  // 정제소 시리즈
  {
    id: "RR_01_T0",
    nameEn: "Basic Ore Refinery",
    nameKo: "기초 광물 정제소",
    tier: 0,
    category: ModuleCategory.RESOURCE,
    description: "기본적인 자원 정제 시설입니다.",
    energyConsumption: { base: 10, max: 10 },
    requiredResources: { "소형 용광로": 1, "분쇄기 부품": 2, "내화 벽돌": 10 },
    durability: 100,
    performance: {
      refiningEfficiency: 50,
    } as ResourceModulePerformance,
  },
];

// 모든 모듈을 하나의 배열로 통합
export const ALL_MODULES: CompleteModuleInfo[] = [
  ...POWER_MODULES,
  ...NAVIGATION_MODULES,
  ...EXPLORATION_MODULES,
  ...COMMUNICATION_MODULES,
  ...DEFENSE_MODULES,
  ...RESOURCE_MODULES,
];

// 모듈 ID로 모듈 정보 찾기 함수
export const getModuleById = (id: string): CompleteModuleInfo | undefined => {
  return ALL_MODULES.find((module) => module.id === id);
};

// 카테고리별 모듈 필터링 함수
export const getModulesByCategory = (
  category: ModuleCategory
): CompleteModuleInfo[] => {
  return ALL_MODULES.filter((module) => module.category === category);
};

// 특정 모듈의 업그레이드 경로 찾기 함수
export const getUpgradePath = (moduleId: string): CompleteModuleInfo[] => {
  const module = getModuleById(moduleId);
  if (!module) return [];

  // 같은 시리즈의 모든 모듈을 찾음 (예: FRC_01_T0, FRC_01_T1, FRC_01_T2)
  const baseId = moduleId.substring(0, moduleId.lastIndexOf("_T"));
  return ALL_MODULES.filter((m) => m.id.startsWith(baseId)).sort(
    (a, b) => a.tier - b.tier
  );
};

// 다음 티어 모듈 찾기 함수
export const getNextTierModule = (
  moduleId: string
): CompleteModuleInfo | undefined => {
  const module = getModuleById(moduleId);
  if (!module) return undefined;

  const baseId = moduleId.substring(0, moduleId.lastIndexOf("_T"));
  const nextTierId = `${baseId}_T${module.tier + 1}`;
  return getModuleById(nextTierId);
};
