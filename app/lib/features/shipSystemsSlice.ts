// 함선 시스템 상태 관리 Redux Slice (개선된 버전)
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  ModuleCategory,
  ModuleStatus,
  CompleteModuleInfo,
  getModuleById,
  getNextTierModule,
  ResourceCost,
  NAVIGATION_MODULE_ENGINE_PREFIX,
} from "../../data/shipModules";
import { getResearchById } from "../../data/researchTechs";
import { StarData } from "../../data/starData";
import { RootState } from "../store";

// === 상태 인터페이스 정의 ===

// 설치된 모듈의 현재 상태
export interface InstalledModule {
  id: string; // 모듈 ID
  status: ModuleStatus; // 현재 상태
  currentDurability: number; // 현재 내구도
  energyAllocation: number; // 할당된 에너지 (0-100%)
  isActive: boolean; // 활성화 여부
  upgradingProgress?: number; // 업그레이드 진행도 (0-100%)
  repairProgress?: number; // 수리 진행도 (0-100%)
  customSettings?: Record<string, any>; // 모듈별 커스텀 설정
}

// 에너지 관리 상태
export interface EnergyManagement {
  totalGeneration: number; // 총 발전량
  totalConsumption: number; // 총 소모량
  totalStorage: number; // 총 축전량
  currentStored: number; // 현재 저장된 에너지
  distributionEfficiency: number; // 분배 효율
  prioritySettings: {
    // 우선순위 설정
    [moduleId: string]: number; // 1-10 (높을수록 우선)
  };
  emergencyMode: boolean; // 비상 모드 (필수 시스템만 작동)
}

// 자원 관리 상태
export interface ResourceManagement {
  inventory: ResourceCost; // 보유 자원
  maxCapacity: number; // 최대 저장 용량
  currentCapacity: number; // 현재 사용 중인 용량
  specialSlots: {
    // 특수 자원 슬롯
    [slotType: string]: {
      capacity: number;
      used: number;
      resources: ResourceCost;
    };
  };
}

export type ShipState =
  | "exploration"
  | "extraction"
  | "combat"
  | "scanning"
  | "idle"
  | "moving";

// 함선 전체 상태
export interface ShipSystemsState {
  // 기본 정보
  shipName: string;
  currentStarId: string | null;
  position: { x: number; y: number; z: number };
  currentState: ShipState;

  // 설치된 모듈들
  installedModules: { [moduleId: string]: InstalledModule };

  // 시스템별 상태
  energy: EnergyManagement;
  resources: ResourceManagement;

  // 전투/손상 상태
  isInCombat: boolean;
  overallHullIntegrity: number; // 전체 함체 무결성 (0-100%)
  overallShieldIntegrity: number; // 전체 방어막 무결성 (0-100%)

  // 탐사 관련
  activeScans: {
    [scanId: string]: {
      targetId: string;
      progress: number;
      estimatedCompletion: number; // 완료 예상 시간 (타임스탬프)
    };
  };

  // 통신 관련
  communicationStatus: {
    homeBaseConnection: boolean;
    signalStrength: number; // 0-100%
    transmissionQueue: {
      [transmissionId: string]: {
        dataSize: number;
        priority: number;
        progress: number;
      };
    };
  };

  // 이동 관련
  navigation?: {
    navigationMode: "warp" | "normal";
    targetStarId: string | null;
    targetPosition: { x: number; y: number; z: number };
    travelProgress: number;
    travelTime: number;
    travelSpeed: number;
    estimatedCompletion: number;
  }

  // 업그레이드 및 제작 큐
  upgradeQueue: {
    [queueId: string]: {
      moduleId: string;
      targetModuleId: string;
      progress: number;
      requiredResources: ResourceCost;
      estimatedCompletion: number;
    };
  };

  // 자동화 설정
  automationSettings: {
    autoRepair: boolean;
    energyManagementMode: "manual" | "balanced" | "performance" | "efficiency";
    scanningMode: "passive" | "active" | "deep";
  };

  // 항성 자원 채취 관련 상태
  stellarExtraction: {
    activeExtractions: {
      [starId: string]: {
        startTime: number;
        extractionType: string;
        estimatedCompletion: number;
        progress: number;
        resourceType: string;
        expectedYield: number;
      };
    };
    extractionHistory: {
      [starId: string]: {
        lastExtraction: number;
        totalExtractions: number;
        extractionsThisHour: number;
      };
    };
  };

  // 시스템 진단 결과
  lastDiagnostics?: {
    timestamp: number;
    overallHealth: number;
    criticalIssues: string[];
    recommendations: string[];
  };

  // 연구 관련 상태
  researchPoints: number; // 보유 연구 포인트
  completedResearch: string[]; // 완료된 연구 ID 목록
  currentResearch?: {
    // 현재 진행 중인 연구
    techId: string;
    currentPoints: number;
    totalPoints: number;
    startTime: number;
    estimatedCompletion: number;
  };
}

// === 헬퍼 함수들 ===

/**
 * 필수 모듈인지 확인
 */
function isEssentialModule(moduleId: string): boolean {
  return (
    moduleId.startsWith("FRC_") || // 핵융합로
    moduleId.startsWith("PDU_") || // 전력 분배
    moduleId.startsWith("CB_") || // 제어 브리지
    moduleId.startsWith("HIF_")
  ); // 함체 프레임
}

/**
 * 에너지 시스템 재계산
 */
function _recalculateEnergySystems(state: ShipSystemsState): void {
  let totalGeneration = 0;
  let totalConsumption = 0;
  let totalStorage = 0;

  Object.values(state.installedModules).forEach((module) => {
    if (!module.isActive) return;

    const moduleInfo = getModuleById(module.id);
    if (!moduleInfo) return;

    // 손상도에 따른 성능 저하 계산
    const damageMultiplier = module.currentDurability / moduleInfo.durability;
    const allocationMultiplier = module.energyAllocation / 100;

    // 에너지 소모량 계산 (할당량에 따라 기본값과 최대값 사이에서 계산)
    const baseConsumption = moduleInfo.energyConsumption.base;
    const maxConsumption = moduleInfo.energyConsumption.max;
    const consumption =
      baseConsumption +
      (maxConsumption - baseConsumption) * allocationMultiplier;
    totalConsumption += consumption;

    // 전력 모듈의 성능 계산
    if (moduleInfo.category === ModuleCategory.POWER) {
      const performance = moduleInfo.performance as any;

      // 에너지 생성량 계산
      if (performance.powerGeneration) {
        totalGeneration +=
          performance.powerGeneration * damageMultiplier * allocationMultiplier;
      }

      // 저장 용량 계산 (손상도만 적용, 할당량과 무관)
      if (performance.storageCapacity) {
        totalStorage += performance.storageCapacity * damageMultiplier;
      }
    }
  });

  state.energy.distributionEfficiency = totalGeneration > 0 ? (totalGeneration - totalConsumption) / totalGeneration * 100 : 0;
  state.energy.totalGeneration = totalGeneration;
  state.energy.totalConsumption = totalConsumption;
  state.energy.totalStorage = totalStorage;

  // 저장된 에너지가 최대 용량을 초과하지 않도록 조정
  state.energy.currentStored = Math.min(
    state.energy.currentStored,
    totalStorage
  );
}

/**
 * 미리 정의된 성능 프로파일 적용
 */
function applyPredefinedProfile(
  state: ShipSystemsState,
  profile: string
): void {
  const profileSettings = {
    exploration: {
      // 탐사 모드: 스캐너와 통신 시스템 최대화
      SE_: 100,
      LRS_: 100,
      LRCA_: 100, // 탐사 시스템
      FRC_: 80,
      PDU_: 90, // 기본 전력
      DEF_: 30,
      SG_: 20, // 방어 시스템 최소화
    },
    combat: {
      // 전투 모드: 방어와 기동성 최대화
      DEF_: 100,
      SG_: 100,
      ARM_: 100, // 방어 시스템
      FRC_: 100,
      PDU_: 100, // 최대 전력
      SE_: 20,
      LRS_: 30, // 탐사 시스템 최소화
    },
    efficiency: {
      // 효율 모드: 모든 시스템 중간 수준
      default: 60,
    },
    stealth: {
      // 은신 모드: 에너지 시그니처 최소화
      SE_: 20,
      LRS_: 10,
      LRCA_: 30,
      FRC_: 40,
      PDU_: 60,
      DEF_: 20,
    },
  };

  const settings = profileSettings[profile as keyof typeof profileSettings];
  if (!settings) return;

  Object.entries(state.installedModules).forEach(([moduleId, module]) => {
    if (!module.isActive) return;

    // 모듈 타입별 설정 찾기
    const moduleType = Object.keys(settings).find(
      (type) => type !== "default" && moduleId.startsWith(type)
    );

    if (moduleType) {
      module.energyAllocation = settings[
        moduleType as keyof typeof settings
      ] as number;
    } else if ("default" in settings) {
      module.energyAllocation = settings.default as number;
    }
  });
}

// === 초기 상태 ===
const initialState: ShipSystemsState = {
  shipName: "Synoro Explorer",
  currentStarId: null,
  position: { x: 0, y: 0, z: 0 },
  currentState: 'idle',

  installedModules: {
    // 기본 설치 모듈들 (T0 모듈들)
    FRC_01_T0: {
      id: "FRC_01_T0",
      status: ModuleStatus.NORMAL,
      currentDurability: 100,
      energyAllocation: 100,
      isActive: true,
    },
    PDU_01_T0: {
      id: "PDU_01_T0",
      status: ModuleStatus.NORMAL,
      currentDurability: 80,
      energyAllocation: 100,
      isActive: true,
    },
    CB_01_T0: {
      id: "CB_01_T0",
      status: ModuleStatus.NORMAL,
      currentDurability: 70,
      energyAllocation: 100,
      isActive: true,
    },
    SE_01_T0: {
      id: "SE_01_T0",
      status: ModuleStatus.NORMAL,
      currentDurability: 90,
      energyAllocation: 50,
      isActive: false,
    },
    LRS_01_T0: {
      id: "LRS_01_T0",
      status: ModuleStatus.NORMAL,
      currentDurability: 75,
      energyAllocation: 80,
      isActive: false,
    },
    LRCA_01_T0: {
      id: "LRCA_01_T0",
      status: ModuleStatus.NORMAL,
      currentDurability: 90,
      energyAllocation: 60,
      isActive: false,
    },
    HIF_01_T0: {
      id: "HIF_01_T0",
      status: ModuleStatus.NORMAL,
      currentDurability: 1000,
      energyAllocation: 0,
      isActive: true,
    },
    CH_01_T0: {
      id: "CH_01_T0",
      status: ModuleStatus.NORMAL,
      currentDurability: 120,
      energyAllocation: 0,
      isActive: true,
    },
    RE_01_T0: {
      id: "RE_01_T0",
      status: ModuleStatus.NORMAL,
      currentDurability: 85,
      energyAllocation: 100,
      isActive: false,
    },
  },

  energy: {
    totalGeneration: 100,
    totalConsumption: 45,
    totalStorage: 500,
    currentStored: 400,
    distributionEfficiency: 85,
    prioritySettings: {
      FRC_01_T0: 10,
      PDU_01_T0: 9,
      SE_01_T0: 7,
      LRS_01_T0: 6,
      LRCA_01_T0: 5,
    },
    emergencyMode: false,
  },

  resources: {
    inventory: {
      티타늄: 50,
      구리: 30,
      알루미늄: 40,
      기본부품: 25,
      "기본 회로": 15,
    },
    maxCapacity: 1000,
    currentCapacity: 160,
    specialSlots: {
      rare_materials: {
        capacity: 100,
        used: 0,
        resources: {},
      },
    },
  },

  isInCombat: false,
  overallHullIntegrity: 100,
  overallShieldIntegrity: 0,

  activeScans: {},

  communicationStatus: {
    homeBaseConnection: true,
    signalStrength: 85,
    transmissionQueue: {},
  },

  upgradeQueue: {},

  automationSettings: {
    autoRepair: false,
    energyManagementMode: "balanced",
    scanningMode: "passive",
  },

  // 항성 자원 채취 초기 상태
  stellarExtraction: {
    activeExtractions: {},
    extractionHistory: {},
  },

  // 연구 관련 초기 상태
  researchPoints: 100,
  completedResearch: [],
};

// === Async Thunk 액션들 ===

// 모듈 설치
export const installModule = createAsyncThunk(
  "shipSystems/installModule",
  async (params: { moduleId: string; slotPosition?: string }, { getState }) => {
    const state = getState() as { shipSystems: ShipSystemsState };
    const moduleInfo = getModuleById(params.moduleId);

    if (!moduleInfo) {
      throw new Error(`모듈 ${params.moduleId}를 찾을 수 없습니다`);
    }

    // 자원 요구량 확인
    const hasResources = Object.entries(moduleInfo.requiredResources).every(
      ([resource, amount]) =>
        (state.shipSystems.resources.inventory[resource] || 0) >= amount
    );

    if (!hasResources) {
      throw new Error("자원이 부족합니다");
    }

    return {
      moduleId: params.moduleId,
      requiredResources: moduleInfo.requiredResources,
      slotPosition: params.slotPosition,
    };
  }
);

// 모듈 제거
export const uninstallModule = createAsyncThunk(
  "shipSystems/uninstallModule",
  async (
    params: { moduleId: string; recoverResources?: boolean },
    { getState }
  ) => {
    const state = getState() as { shipSystems: ShipSystemsState };
    const module = state.shipSystems.installedModules[params.moduleId];

    if (!module) {
      throw new Error(`설치된 모듈 ${params.moduleId}를 찾을 수 없습니다`);
    }

    const moduleInfo = getModuleById(params.moduleId);
    if (!moduleInfo) {
      throw new Error(`모듈 정보를 찾을 수 없습니다`);
    }

    // 자원 회수량 계산 (내구도에 따라)
    const recoveryRate = params.recoverResources
      ? (module.currentDurability / moduleInfo.durability) * 0.7
      : 0;
    const recoveredResources: ResourceCost = {};

    if (recoveryRate > 0) {
      Object.entries(moduleInfo.requiredResources).forEach(
        ([resource, amount]) => {
          recoveredResources[resource] = Math.floor(amount * recoveryRate);
        }
      );
    }

    return {
      moduleId: params.moduleId,
      recoveredResources,
    };
  }
);

// 업그레이드 시작
export const startModuleUpgrade = createAsyncThunk(
  "shipSystems/startModuleUpgrade",
  async (params: { moduleId: string }, { getState }) => {
    const state = getState() as { shipSystems: ShipSystemsState };
    const module = state.shipSystems.installedModules[params.moduleId];

    if (!module) {
      throw new Error("모듈을 찾을 수 없습니다");
    }

    const nextTierModule = getNextTierModule(params.moduleId);
    if (!nextTierModule) {
      throw new Error("업그레이드 가능한 모듈이 없습니다");
    }

    // 자원 요구량 확인
    const hasResources = Object.entries(nextTierModule.requiredResources).every(
      ([resource, amount]) =>
        (state.shipSystems.resources.inventory[resource] || 0) >= amount
    );

    if (!hasResources) {
      throw new Error("업그레이드에 필요한 자원이 부족합니다");
    }

    return {
      moduleId: params.moduleId,
      targetModuleId: nextTierModule.id,
      requiredResources: nextTierModule.requiredResources,
      estimatedTime: 300, // 5분
    };
  }
);

// 시스템 진단 실행
export const runSystemDiagnostics = createAsyncThunk(
  "shipSystems/runSystemDiagnostics",
  async (_, { getState }) => {
    const state = getState() as { shipSystems: ShipSystemsState };

    const diagnostics = {
      timestamp: Date.now(),
      energyEfficiency: state.shipSystems.energy.distributionEfficiency,
      overallHealth: 0,
      criticalIssues: [] as string[],
      recommendations: [] as string[],
    };

    // 모듈별 상태 진단
    let totalModules = 0;
    let healthyModules = 0;

    Object.entries(state.shipSystems.installedModules).forEach(
      ([moduleId, module]) => {
        totalModules++;
        const moduleInfo = getModuleById(moduleId);
        if (!moduleInfo) return;

        const healthPercentage =
          (module.currentDurability / moduleInfo.durability) * 100;

        if (healthPercentage < 30) {
          diagnostics.criticalIssues.push(
            `${moduleInfo.nameKo}: 심각한 손상 (${healthPercentage.toFixed(
              1
            )}%)`
          );
        } else if (healthPercentage > 80) {
          healthyModules++;
        }
      }
    );

    diagnostics.overallHealth = (healthyModules / totalModules) * 100;

    // 권장사항 생성
    if (diagnostics.overallHealth < 70) {
      diagnostics.recommendations.push("전체적인 수리가 필요합니다");
    }

    if (state.shipSystems.energy.emergencyMode) {
      diagnostics.recommendations.push(
        "비상 모드가 활성화되어 있습니다. 에너지 공급을 확인하세요"
      );
    }

    return diagnostics;
  }
);

// 항성 자원 채취 시작
export const startStellarExtraction = createAsyncThunk(
  "shipSystems/startStellarExtraction",
  async (
    params: {
      star: StarData;
      extractionType: "primary" | "rare";
      resourceType: string;
    },
    { getState }
  ) => {
    const state = getState() as { shipSystems: ShipSystemsState };

    if (!params.star.stellarResources) {
      throw new Error("이 항성에서는 자원을 채취할 수 없습니다");
    }

    const resources = params.star.stellarResources;
    const history =
      state.shipSystems.stellarExtraction.extractionHistory[params.star.id];

    // 시간당 최대 채취 횟수 확인
    if (history && resources.maxExtractionsPerHour) {
      const currentHour = Math.floor(Date.now() / (1000 * 60 * 60));
      const historyHour = Math.floor(history.lastExtraction / (1000 * 60 * 60));

      const extractionsThisHour =
        currentHour === historyHour ? history.extractionsThisHour : 0;

      if (extractionsThisHour >= resources.maxExtractionsPerHour) {
        throw new Error(
          `이 항성에서는 시간당 최대 ${resources.maxExtractionsPerHour}회만 채취할 수 있습니다`
        );
      }
    }

    // 채취 장비 확인
    const extractionModule = Object.values(
      state.shipSystems.installedModules
    ).find((module) => {
      const moduleInfo = getModuleById(module.id);
      return (
        moduleInfo?.category === ModuleCategory.RESOURCE &&
        moduleInfo.id.startsWith("RE_")
      );
    });

    if (!extractionModule) {
      throw new Error("자원 채취를 위해서는 활성화된 채광 장비가 필요합니다");
    }

    // 난이도에 따른 채취 시간 계산
    const baseDuration = {
      easy: 30, // 30초
      medium: 60, // 1분
      hard: 120, // 2분
      extreme: 300, // 5분
    }[resources.extractionDifficulty];

    // 예상 수확량 계산
    const targetResources =
      params.extractionType === "primary"
        ? resources.primaryResources
        : resources.rareResources || {};

    const baseYield = targetResources[params.resourceType] || 0;
    const expectedYield = Math.floor(baseYield * (0.8 + Math.random() * 0.4)); // 80-120% 변동

    if (expectedYield === 0) {
      throw new Error("선택한 자원을 이 항성에서 채취할 수 없습니다");
    }

    return {
      starId: params.star.id,
      extractionType: params.extractionType,
      resourceType: params.resourceType,
      duration: baseDuration,
      expectedYield,
    };
  }
);

// 항성 자원 채취 완료 처리
export const completeStellarExtraction = createAsyncThunk(
  "shipSystems/completeStellarExtraction",
  async (params: { starId: string }, { getState }) => {
    const state = getState() as { shipSystems: ShipSystemsState };
    const extraction =
      state.shipSystems.stellarExtraction.activeExtractions[params.starId];

    if (!extraction) {
      throw new Error("진행 중인 채취 작업이 없습니다");
    }

    // 성공률 계산 (진행도에 따라)
    const successRate = Math.min(0.95, 0.5 + (extraction.progress / 100) * 0.5);
    const isSuccess = Math.random() < successRate;

    if (!isSuccess) {
      return {
        success: false,
        starId: params.starId,
        message: "채취 작업이 실패했습니다. 일부 자원만 회수되었습니다.",
        recoveredResources: {
          [extraction.resourceType]: Math.floor(extraction.expectedYield * 0.3),
        },
      };
    }

    return {
      success: true,
      starId: params.starId,
      message: "자원 채취가 성공적으로 완료되었습니다!",
      obtainedResources: {
        [extraction.resourceType]: extraction.expectedYield,
      },
    };
  }
);

// === Redux Slice ===
export const shipSystemsSlice = createSlice({
  name: "shipSystems",
  initialState,
  reducers: {
    // === 기본 함선 정보 관리 ===
    updateShipPosition: (
      state,
      action: PayloadAction<{ x: number; y: number; z: number }>
    ) => {
      state.position = action.payload;
    },

    moveToStar: (
      state,
      action: PayloadAction<{
        starId: string;
        position: { x: number; y: number; z: number };
      }>
    ) => {
      state.currentStarId = action.payload.starId;
      state.position = action.payload.position;
    },

    // === 모듈 관리 ===
    toggleModuleActive: (state, action: PayloadAction<string>) => {
      const module = state.installedModules[action.payload];
      if (module) {
        module.isActive = !module.isActive;

        // 비활성화된 모듈의 에너지 할당량을 0으로 설정
        if (!module.isActive) {
          module.energyAllocation = 0;
        }

        _recalculateEnergySystems(state);
      }
    },

    updateModuleEnergyAllocation: (
      state,
      action: PayloadAction<{ moduleId: string; allocation: number }>
    ) => {
      const module = state.installedModules[action.payload.moduleId];
      if (module) {
        module.energyAllocation = Math.max(
          0,
          Math.min(100, action.payload.allocation)
        );
        _recalculateEnergySystems(state);
      }
    },

    damageModule: (
      state,
      action: PayloadAction<{ moduleId: string; damage: number }>
    ) => {
      const module = state.installedModules[action.payload.moduleId];
      if (module) {
        module.currentDurability = Math.max(
          0,
          module.currentDurability - action.payload.damage
        );

        // 내구도에 따른 상태 변경
        if (module.currentDurability === 0) {
          module.status = ModuleStatus.DISABLED;
          module.isActive = false;
        } else if (module.currentDurability < 30) {
          module.status = ModuleStatus.DAMAGED;
        }

        _recalculateEnergySystems(state);
      }
    },

    repairModule: (
      state,
      action: PayloadAction<{ moduleId: string; repairAmount: number }>
    ) => {
      const module = state.installedModules[action.payload.moduleId];
      const moduleInfo = getModuleById(action.payload.moduleId);

      if (module && moduleInfo) {
        module.currentDurability = Math.min(
          moduleInfo.durability,
          module.currentDurability + action.payload.repairAmount
        );

        // 수리 완료 시 상태 정상화
        if (module.currentDurability >= moduleInfo.durability * 0.8) {
          module.status = ModuleStatus.NORMAL;
        }
      }
    },

    // === 에너지 관리 ===
    setEnergyPriority: (
      state,
      action: PayloadAction<{ moduleId: string; priority: number }>
    ) => {
      state.energy.prioritySettings[action.payload.moduleId] = Math.max(
        1,
        Math.min(10, action.payload.priority)
      );
    },

    toggleEmergencyMode: (state) => {
      state.energy.emergencyMode = !state.energy.emergencyMode;

      if (state.energy.emergencyMode) {
        // 비상 모드: 필수 시스템만 활성화
        Object.keys(state.installedModules).forEach((moduleId) => {
          const module = state.installedModules[moduleId];
          if (module && !isEssentialModule(moduleId)) {
            module.energyAllocation = 10; // 최소한의 에너지만 할당
          }
        });
      }

      _recalculateEnergySystems(state);
    },

    updateEnergyStorage: (state, action: PayloadAction<number>) => {
      state.energy.currentStored = Math.max(
        0,
        Math.min(state.energy.totalStorage, action.payload)
      );
    },

    // === 자원 관리 ===
    addResources: (state, action: PayloadAction<ResourceCost>) => {
      Object.entries(action.payload).forEach(([resource, amount]) => {
        state.resources.inventory[resource] =
          (state.resources.inventory[resource] || 0) + amount;
      });

      // 현재 용량 재계산
      state.resources.currentCapacity = Object.values(
        state.resources.inventory
      ).reduce((sum, amount) => sum + amount, 0);
    },

    consumeResources: (state, action: PayloadAction<ResourceCost>) => {
      Object.entries(action.payload).forEach(([resource, amount]) => {
        if (state.resources.inventory[resource]) {
          state.resources.inventory[resource] = Math.max(
            0,
            state.resources.inventory[resource] - amount
          );
        }
      });

      // 현재 용량 재계산
      state.resources.currentCapacity = Object.values(
        state.resources.inventory
      ).reduce((sum, amount) => sum + amount, 0);
    },

    // === 탐사 관리 ===
    startScan: (
      state,
      action: PayloadAction<{
        scanId: string;
        targetId: string;
        duration: number;
      }>
    ) => {
      state.activeScans[action.payload.scanId] = {
        targetId: action.payload.targetId,
        progress: 0,
        estimatedCompletion: Date.now() + action.payload.duration * 1000,
      };
    },

    updateScanProgress: (
      state,
      action: PayloadAction<{ scanId: string; progress: number }>
    ) => {
      const scan = state.activeScans[action.payload.scanId];
      if (scan) {
        scan.progress = Math.max(0, Math.min(100, action.payload.progress));

        if (scan.progress >= 100) {
          delete state.activeScans[action.payload.scanId];
        }
      }
    },

    cancelScan: (state, action: PayloadAction<string>) => {
      delete state.activeScans[action.payload];
    },

    // === 항법 관리 ===
    navigateToStar: (
      state,
      action: PayloadAction<{ star: StarData; mode: "warp" | "normal" }>
    ) => {
      const { star, mode } = action.payload;
      state.navigation = {
        navigationMode: mode,
        targetStarId: star.id,
        targetPosition: star.position,
        travelProgress: 0,
        travelTime: 0,
        travelSpeed: 0,
        estimatedCompletion: 0,
      };
      state.currentState = 'moving';

      // 항해 모듈 활성화
      Object.entries(state.installedModules).forEach(([moduleId, module]) => {
        if (module.id.startsWith(NAVIGATION_MODULE_ENGINE_PREFIX)) {
          module.isActive = true;
          module.energyAllocation = 100;
        }
      });

      _recalculateEnergySystems(state);
    },

    navigateToStarWarp: (
      state,
      action: PayloadAction<{ star: StarData }>
    ) => {
      const { star } = action.payload;
      state.navigation = {
        navigationMode: 'warp',
        targetStarId: star.id,
        targetPosition: star.position,
        travelProgress: 0,
        travelTime: 0,
        travelSpeed: 0,
        estimatedCompletion: 0,
      };
      state.currentState = 'moving';

      // 항해 모듈 활성화
      Object.entries(state.installedModules).forEach(([moduleId, module]) => {
        if (module.id.startsWith(NAVIGATION_MODULE_ENGINE_PREFIX)) {
          module.isActive = true;
          module.energyAllocation = 100;
        }
      }); 

      _recalculateEnergySystems(state);
    },

    updateNavigationProgress: (
      state,
      action: PayloadAction<{
        progress: number;
        travelSpeed: number;
        travelTime: number;
        estimatedCompletion: number;
      }>
    ) => {
      if (state.navigation) {
        state.navigation.travelProgress = Math.max(
          0,
          Math.min(100, action.payload.progress)
        );
        state.navigation.travelSpeed = action.payload.travelSpeed;
        state.navigation.travelTime = action.payload.travelTime;
        state.navigation.estimatedCompletion = action.payload.estimatedCompletion;
      }
    },

    completeNavigation: (state) => {
      if (state.navigation) {
        state.currentStarId = state.navigation.targetStarId;
        state.position = state.navigation.targetPosition;
        state.currentState = 'idle';
        state.navigation = undefined;
      }

      // 항해 모듈 비활성화
      Object.entries(state.installedModules).forEach(([moduleId, module]) => {
        if (module.id.startsWith(NAVIGATION_MODULE_ENGINE_PREFIX)) {
          module.isActive = false;
          module.energyAllocation = 0;
        }
      });

      _recalculateEnergySystems(state);
    },

    cancelNavigation: (state) => {
      state.navigation = undefined;
      state.currentState = 'idle';

      // 항해 모듈 비활성화
      Object.entries(state.installedModules).forEach(([moduleId, module]) => {
        if (module.id.startsWith(NAVIGATION_MODULE_ENGINE_PREFIX)) {
          module.isActive = false;
        }
      });

      _recalculateEnergySystems(state);
    },

    // === 통신 관리 ===
    updateCommunicationStatus: (
      state,
      action: PayloadAction<{ connection: boolean; signalStrength: number }>
    ) => {
      state.communicationStatus.homeBaseConnection = action.payload.connection;
      state.communicationStatus.signalStrength = action.payload.signalStrength;
    },

    addTransmissionToQueue: (
      state,
      action: PayloadAction<{
        transmissionId: string;
        dataSize: number;
        priority: number;
      }>
    ) => {
      state.communicationStatus.transmissionQueue[
        action.payload.transmissionId
      ] = {
        dataSize: action.payload.dataSize,
        priority: action.payload.priority,
        progress: 0,
      };
    },

    updateTransmissionProgress: (
      state,
      action: PayloadAction<{ transmissionId: string; progress: number }>
    ) => {
      const transmission =
        state.communicationStatus.transmissionQueue[
          action.payload.transmissionId
        ];
      if (transmission) {
        transmission.progress = Math.max(
          0,
          Math.min(100, action.payload.progress)
        );

        if (transmission.progress >= 100) {
          delete state.communicationStatus.transmissionQueue[
            action.payload.transmissionId
          ];
        }
      }
    },

    // === 함체/방어막 관리 ===
    updateHullIntegrity: (state, action: PayloadAction<number>) => {
      state.overallHullIntegrity = Math.max(0, Math.min(100, action.payload));
    },

    updateShieldIntegrity: (state, action: PayloadAction<number>) => {
      state.overallShieldIntegrity = Math.max(0, Math.min(100, action.payload));
    },

    // === 자동화 설정 ===
    updateAutomationSettings: (
      state,
      action: PayloadAction<Partial<typeof initialState.automationSettings>>
    ) => {
      state.automationSettings = {
        ...state.automationSettings,
        ...action.payload,
      };
    },

    // === 연구 관리 ===
    addResearchPoints: (state, action: PayloadAction<number>) => {
      state.researchPoints += action.payload;
    },

    spendResearchPoints: (state, action: PayloadAction<number>) => {
      state.researchPoints = Math.max(0, state.researchPoints - action.payload);
    },

    completeResearch: (state, action: PayloadAction<string>) => {
      if (!state.completedResearch.includes(action.payload)) {
        state.completedResearch.push(action.payload);
      }
      // 현재 연구가 완료된 것이면 제거
      if (state.currentResearch?.techId === action.payload) {
        state.currentResearch = undefined;
      }
    },

    startResearch: (
      state,
      action: PayloadAction<{ techId: string; totalPoints: number }>
    ) => {
      const tech = getResearchById(action.payload.techId);
      if (tech) {
        state.currentResearch = {
          techId: action.payload.techId,
          currentPoints: 0,
          totalPoints: action.payload.totalPoints,
          startTime: Date.now(),
          estimatedCompletion: Date.now() + tech.cost.timeRequired * 1000,
        };

        // 연구 포인트 소모
        state.researchPoints = Math.max(
          0,
          state.researchPoints - tech.cost.researchPoints
        );

        // 필요한 자원 소모
        if (tech.cost.requiredResources) {
          Object.entries(tech.cost.requiredResources).forEach(
            ([resource, amount]) => {
              if (state.resources.inventory[resource]) {
                state.resources.inventory[resource] = Math.max(
                  0,
                  state.resources.inventory[resource] - amount
                );
              }
            }
          );

          // 현재 용량 재계산
          state.resources.currentCapacity = Object.values(
            state.resources.inventory
          ).reduce((sum, amount) => sum + amount, 0);
        }
      }
    },

    updateResearchProgress: (state, action: PayloadAction<number>) => {
      if (state.currentResearch) {
        state.currentResearch.currentPoints = Math.max(
          0,
          Math.min(state.currentResearch.totalPoints, action.payload)
        );

        // 연구 완료 확인
        if (
          state.currentResearch.currentPoints >=
          state.currentResearch.totalPoints
        ) {
          if (!state.completedResearch.includes(state.currentResearch.techId)) {
            state.completedResearch.push(state.currentResearch.techId);
          }
          state.currentResearch = undefined;
        }
      }
    },

    cancelResearch: (state) => {
      if (state.currentResearch) {
        // 연구 포인트의 일부만 반환 (50%)
        const tech = getResearchById(state.currentResearch.techId);
        if (tech) {
          const refund = Math.floor(tech.cost.researchPoints * 0.5);
          state.researchPoints += refund;
        }
        state.currentResearch = undefined;
      }
    },

    // === 고급 제어 기능 ===

    // 모듈 그룹 활성화/비활성화
    toggleModuleGroup: (
      state,
      action: PayloadAction<{ category: ModuleCategory; active: boolean }>
    ) => {
      const { category, active } = action.payload;

      Object.entries(state.installedModules).forEach(([moduleId, module]) => {
        const moduleInfo = getModuleById(moduleId);
        if (moduleInfo && moduleInfo.category === category) {
          module.isActive = active;
          if (!active) {
            module.energyAllocation = 0;
          }
        }
      });

      _recalculateEnergySystems(state);
    },

    // 긴급 정지
    emergencyShutdown: (
      state,
      action: PayloadAction<{ excludeEssential?: boolean }>
    ) => {
      const { excludeEssential = true } = action.payload;

      Object.entries(state.installedModules).forEach(([moduleId, module]) => {
        if (excludeEssential && isEssentialModule(moduleId)) {
          return; // 필수 모듈은 건드리지 않음
        }

        module.isActive = false;
        module.energyAllocation = 0;
      });

      state.energy.emergencyMode = true;
      _recalculateEnergySystems(state);
    },

    // 시스템 재부팅
    rebootSystems: (state) => {
      // 모든 비활성 모듈을 다시 활성화
      Object.entries(state.installedModules).forEach(([moduleId, module]) => {
        if (module.status === ModuleStatus.NORMAL) {
          module.isActive = true;
          module.energyAllocation = 100;
        }
      });

      state.energy.emergencyMode = false;
      _recalculateEnergySystems(state);
    },

    // 성능 프로파일 적용
    applyPerformanceProfile: (
      state,
      action: PayloadAction<{
        profile: "exploration" | "combat" | "efficiency" | "stealth" | "custom";
        customSettings?: {
          [moduleId: string]: { allocation: number; active: boolean };
        };
      }>
    ) => {
      const { profile, customSettings } = action.payload;

      if (profile === "custom" && customSettings) {
        Object.entries(customSettings).forEach(([moduleId, settings]) => {
          const module = state.installedModules[moduleId];
          if (module) {
            module.energyAllocation = settings.allocation;
            module.isActive = settings.active;
          }
        });
      } else {
        // 미리 정의된 프로파일 적용
        applyPredefinedProfile(state, profile);
      }

      _recalculateEnergySystems(state);
    },

    // 에너지 시스템 수동 재계산
    recalculateEnergySystems: (state) => {
      _recalculateEnergySystems(state);
    },

    // === 항성 자원 채취 관리 ===
    updateExtractionProgress: (
      state,
      action: PayloadAction<{ starId: string; progress: number }>
    ) => {
      const { starId, progress } = action.payload;
      const extraction = state.stellarExtraction.activeExtractions[starId];

      if (extraction) {
        const clampedProgress = Math.max(0, Math.min(100, progress));
        extraction.progress = clampedProgress;
      } else {
        console.warn(
          `⚠️ Redux: 해당 starId(${starId})의 활성 채취 작업을 찾을 수 없습니다.`
        );
      }
    },

    cancelStellarExtraction: (state, action: PayloadAction<string>) => {
      delete state.stellarExtraction.activeExtractions[action.payload];

      // 채취 장비 비활성화
      const extractionModule = Object.values(state.installedModules).find(
        (module) => {
          const moduleInfo = getModuleById(module.id);
          return (
            moduleInfo?.category === ModuleCategory.RESOURCE &&
            moduleInfo.id.startsWith("RE_")
          );
        }
      );

      if (extractionModule) {
        extractionModule.isActive = false;
      }
    },

    // 채취 이력 업데이트
    updateExtractionHistory: (
      state,
      action: PayloadAction<{ starId: string; extractionCount?: number }>
    ) => {
      const { starId, extractionCount = 1 } = action.payload;
      const currentTime = Date.now();
      const currentHour = Math.floor(currentTime / (1000 * 60 * 60));

      if (!state.stellarExtraction.extractionHistory[starId]) {
        state.stellarExtraction.extractionHistory[starId] = {
          lastExtraction: currentTime,
          totalExtractions: extractionCount,
          extractionsThisHour: extractionCount,
        };
      } else {
        const history = state.stellarExtraction.extractionHistory[starId];
        const lastHour = Math.floor(history.lastExtraction / (1000 * 60 * 60));

        history.lastExtraction = currentTime;
        history.totalExtractions += extractionCount;

        // 같은 시간대면 시간당 카운트 증가, 다른 시간대면 리셋
        if (currentHour === lastHour) {
          history.extractionsThisHour += extractionCount;
        } else {
          history.extractionsThisHour = extractionCount;
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // 모듈 설치
      .addCase(installModule.fulfilled, (state, action) => {
        const { moduleId, requiredResources } = action.payload;
        const moduleInfo = getModuleById(moduleId);

        if (moduleInfo) {
          // 자원 소모
          Object.entries(requiredResources).forEach(([resource, amount]) => {
            if (state.resources.inventory[resource]) {
              state.resources.inventory[resource] -= amount;
            }
          });

          // 모듈 설치
          state.installedModules[moduleId] = {
            id: moduleId,
            status: ModuleStatus.NORMAL,
            currentDurability: moduleInfo.durability,
            energyAllocation: 100,
            isActive: false,
          };

          // 에너지 시스템 재계산
          _recalculateEnergySystems(state);
        }
      })
      .addCase(installModule.rejected, (state, action) => {
        console.error("모듈 설치 실패:", action.error.message);
      })

      // 모듈 제거
      .addCase(uninstallModule.fulfilled, (state, action) => {
        const { moduleId, recoveredResources } = action.payload;

        // 모듈 제거
        delete state.installedModules[moduleId];

        // 자원 회수
        Object.entries(recoveredResources).forEach(([resource, amount]) => {
          state.resources.inventory[resource] =
            (state.resources.inventory[resource] || 0) + amount;
        });

        // 에너지 우선순위에서 제거
        delete state.energy.prioritySettings[moduleId];

        // 에너지 시스템 재계산
        _recalculateEnergySystems(state);
      })
      .addCase(uninstallModule.rejected, (state, action) => {
        console.error("모듈 제거 실패:", action.error.message);
      })

      // 업그레이드 시작
      .addCase(startModuleUpgrade.fulfilled, (state, action) => {
        const upgradeId = `upgrade_${Date.now()}`;
        state.upgradeQueue[upgradeId] = {
          moduleId: action.payload.moduleId,
          targetModuleId: action.payload.targetModuleId,
          progress: 0,
          requiredResources: action.payload.requiredResources,
          estimatedCompletion: Date.now() + action.payload.estimatedTime * 1000,
        };

        // 자원 소모
        Object.entries(action.payload.requiredResources).forEach(
          ([resource, amount]) => {
            if (state.resources.inventory[resource]) {
              state.resources.inventory[resource] -= amount;
            }
          }
        );

        // 모듈 상태를 업그레이드 중으로 변경
        const module = state.installedModules[action.payload.moduleId];
        if (module) {
          module.status = ModuleStatus.UPGRADING;
          module.upgradingProgress = 0;
        }
      })
      .addCase(startModuleUpgrade.rejected, (state, action) => {
        console.error("업그레이드 시작 실패:", action.error.message);
      })

      // 시스템 진단
      .addCase(runSystemDiagnostics.fulfilled, (state, action) => {
        state.lastDiagnostics = action.payload;
      })
      .addCase(runSystemDiagnostics.rejected, (state, action) => {
        console.error("시스템 진단 실패:", action.error.message);
      })

      // 항성 자원 채취 시작
      .addCase(startStellarExtraction.fulfilled, (state, action) => {
        const {
          starId,
          extractionType,
          resourceType,
          duration,
          expectedYield,
        } = action.payload;

        state.stellarExtraction.activeExtractions[starId] = {
          startTime: Date.now(),
          extractionType,
          estimatedCompletion: Date.now() + duration * 1000,
          progress: 0,
          resourceType,
          expectedYield,
        };

        // 함선 상태 변경
        state.currentState = "extraction";

        // 채취 장비 활성화
        const extractionModuleEntry = Object.entries(
          state.installedModules
        ).find(([_, module]) => {
          const moduleInfo = getModuleById(module.id);
          return (
            moduleInfo?.category === ModuleCategory.RESOURCE &&
            moduleInfo.id.startsWith("RE_")
          );
        });

        if (extractionModuleEntry) {
          const [moduleId, module] = extractionModuleEntry;
          module.isActive = true;
          module.energyAllocation = 100; // 최대 에너지 할당
          // 에너지 시스템 재계산
          _recalculateEnergySystems(state);
        } else {
          console.warn("⚠️ 자원 채취 장비가 설치되지 않았습니다.");
        }
      })
      .addCase(startStellarExtraction.rejected, (state, action) => {
        console.error("항성 자원 채취 시작 실패:", action.error.message);
      })

      // 항성 자원 채취 완료
      .addCase(completeStellarExtraction.fulfilled, (state, action) => {
        const { success, starId, obtainedResources, recoveredResources } =
          action.payload;

        // 함선 상태 변경
        state.currentState = "idle";

        // 채취 작업 제거
        delete state.stellarExtraction.activeExtractions[starId];

        // 채취 장비 비활성화 및 내구도 감소
        const extractionModuleEntry = Object.entries(
          state.installedModules
        ).find(([_, module]) => {
          const moduleInfo = getModuleById(module.id);
          return (
            moduleInfo?.category === ModuleCategory.RESOURCE &&
            moduleInfo.id.startsWith("RE_")
          );
        });

        if (extractionModuleEntry) {
          const [moduleId, module] = extractionModuleEntry;
          module.isActive = false;
          module.currentDurability = Math.max(0, module.currentDurability - 10);

          console.log(
            `🔧 채취 장비 비활성화: ${moduleId}, 내구도: ${module.currentDurability}`
          );

          // 에너지 시스템 재계산
          _recalculateEnergySystems(state);
        }

        // 자원 추가
        const resourcesToAdd = success ? obtainedResources : recoveredResources;
        if (resourcesToAdd) {
          Object.entries(resourcesToAdd).forEach(([resource, amount]) => {
            state.resources.inventory[resource] =
              (state.resources.inventory[resource] || 0) + amount;
          });

          // 현재 용량 재계산
          state.resources.currentCapacity = Object.values(
            state.resources.inventory
          ).reduce((sum, amount) => sum + amount, 0);
        }

        // 채취 이력 업데이트 (여기서는 직접 업데이트)
        const currentTime = Date.now();
        const currentHour = Math.floor(currentTime / (1000 * 60 * 60));

        if (!state.stellarExtraction.extractionHistory[starId]) {
          state.stellarExtraction.extractionHistory[starId] = {
            lastExtraction: currentTime,
            totalExtractions: 1,
            extractionsThisHour: 1,
          };
        } else {
          const history = state.stellarExtraction.extractionHistory[starId];
          const lastHour = Math.floor(
            history.lastExtraction / (1000 * 60 * 60)
          );

          history.lastExtraction = currentTime;
          history.totalExtractions += 1;

          if (currentHour === lastHour) {
            history.extractionsThisHour += 1;
          } else {
            history.extractionsThisHour = 1;
          }
        }
      })
      .addCase(completeStellarExtraction.rejected, (state, action) => {
        console.error("항성 자원 채취 완료 처리 실패:", action.error.message);
      });
  },
});

// === 액션 내보내기 ===
export const {
  updateShipPosition,
  moveToStar,
  toggleModuleActive,
  updateModuleEnergyAllocation,
  damageModule,
  repairModule,
  setEnergyPriority,
  toggleEmergencyMode,
  updateEnergyStorage,
  addResources,
  consumeResources,
  startScan,
  updateScanProgress,
  cancelScan,
  updateCommunicationStatus,
  addTransmissionToQueue,
  updateTransmissionProgress,
  updateHullIntegrity,
  updateShieldIntegrity,
  updateAutomationSettings,
  addResearchPoints,
  spendResearchPoints,
  completeResearch,
  startResearch,
  updateResearchProgress,
  cancelResearch,
  toggleModuleGroup,
  emergencyShutdown,
  rebootSystems,
  applyPerformanceProfile,
  recalculateEnergySystems,
  updateExtractionProgress,
  cancelStellarExtraction,
  updateExtractionHistory,
  navigateToStar,
  updateNavigationProgress,
  completeNavigation,
  cancelNavigation,
  navigateToStarWarp,
} = shipSystemsSlice.actions;

// === 기본 내보내기 ===
export default shipSystemsSlice.reducer;
