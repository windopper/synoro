// 함선 시스템 성능 계산 및 상태 관리 유틸리티
import { 
  ShipSystemsState, 
  InstalledModule 
} from '../features/shipSystemsSlice';
import { 
  getModuleById, 
  ModuleCategory,
  PowerModulePerformance,
  NavigationModulePerformance,
  ExplorationModulePerformance,
  CommunicationModulePerformance,
  DefenseModulePerformance,
  ResourceModulePerformance
} from '../../data/shipModules';

// === 함선 성능 통합 인터페이스 ===
export interface ShipPerformanceMetrics {
  // 동력 성능
  power: {
    totalGeneration: number;        // 총 발전량 (PU)
    totalConsumption: number;       // 총 소모량 (PU)
    totalStorage: number;           // 총 축전량 (CU)
    efficiency: number;             // 전체 효율 (%)
    energyBalance: number;          // 에너지 수지 (발전량 - 소모량)
    capacityUsage: number;          // 용량 사용률 (%)
  };
  
  // 항행 성능
  navigation: {
    systemSpeed: number;            // 성계 내 최대 속도 (SU)
    accelerationBonus: number;      // 가속도 보너스 (%)
    maxWarpRange: number;          // 최대 워프 거리 (LY)
    warpPrepTime: number;          // 워프 준비 시간 (초)
    warpAccuracy: number;          // 워프 정확도 (%)
    navigationEfficiency: number;   // 항법 효율성 (%)
  };
  
  // 탐사 성능
  exploration: {
    maxScanRange: number;          // 최대 스캔 범위 (AU)
    scanResolution: number;        // 스캔 해상도 (기준치 대비 %)
    analysisSpeed: number;         // 분석 속도 (DP/hour)
    knowledgeConversion: number;   // 지식 변환 효율 (%)
    totalDroneCapacity: number;    // 총 드론 운용 수
    specialDroneSlots: number;     // 특수 드론 슬롯 수
  };
  
  // 통신 성능
  communication: {
    maxCommRange: number;          // 최대 통신 거리 (LY, 0이면 무제한)
    transmissionSpeed: number;     // 전송 속도 (KP/sec)
    localSignalRange: number;      // 근거리 신호 범위 (AU)
    encryptionLevel: number;       // 암호화 수준
  };
  
  // 방어 성능
  defense: {
    totalHullIntegrity: number;    // 총 함체 내구도 (HP)
    kineticResistance: number;     // 운동 에너지 저항 (%)
    energyResistance: number;      // 에너지 저항 (%)
    totalShieldCapacity: number;   // 총 방어막 용량 (SP)
    shieldRechargeRate: number;    // 방어막 재충전 속도 (SP/sec)
    autoRepairRate: number;        // 자동 수리 속도 (HP/sec)
  };
  
  // 자원 관리 성능
  resource: {
    maxExtractionRate: number;     // 최대 채취 속도 (RU/sec)
    extractionEfficiency: number;  // 채취 효율 (%)
    totalCargoCapacity: number;    // 총 화물 용량 (CU)
    specialCargoSlots: number;     // 특수 화물 슬롯 수
    refiningEfficiency: number;    // 정제 효율 (%)
  };
}

// === 카테고리별 성능 계산 함수 ===

/**
 * 동력 시스템 성능 계산
 */
export function calculatePowerPerformance(state: ShipSystemsState): ShipPerformanceMetrics['power'] {
  let totalGeneration = 0;
  let totalConsumption = 0;
  let totalStorage = 0;
  let distributionEfficiency = 100;
  
  Object.values(state.installedModules).forEach(module => {
    if (!module.isActive) return;
    
    const moduleInfo = getModuleById(module.id);
    if (!moduleInfo || moduleInfo.category !== ModuleCategory.POWER) return;
    
    const performance = moduleInfo.performance as PowerModulePerformance;
    const damageMultiplier = calculateDamageMultiplier(module);
    const allocationMultiplier = module.energyAllocation / 100;
    
    // 발전량 계산
    if (performance.powerGeneration) {
      totalGeneration += performance.powerGeneration * damageMultiplier * allocationMultiplier;
    }
    
    // 저장량 계산
    if (performance.storageCapacity) {
      totalStorage += performance.storageCapacity * damageMultiplier;
    }
    
    // 분배 효율 계산 (가장 좋은 효율 적용)
    if (performance.distributionEfficiency) {
      distributionEfficiency = Math.max(distributionEfficiency, 
        performance.distributionEfficiency * damageMultiplier);
    }
    
    // 에너지 소모량 계산
    const energyConsumption = moduleInfo.energyConsumption.base + 
      (moduleInfo.energyConsumption.max - moduleInfo.energyConsumption.base) * allocationMultiplier;
    totalConsumption += energyConsumption;
  });
  
  // 다른 시스템의 에너지 소모량도 계산
  Object.values(state.installedModules).forEach(module => {
    if (!module.isActive || getModuleById(module.id)?.category === ModuleCategory.POWER) return;
    
    const moduleInfo = getModuleById(module.id);
    if (!moduleInfo) return;
    
    const allocationMultiplier = module.energyAllocation / 100;
    const energyConsumption = moduleInfo.energyConsumption.base + 
      (moduleInfo.energyConsumption.max - moduleInfo.energyConsumption.base) * allocationMultiplier;
    totalConsumption += energyConsumption;
  });
  
  const efficiency = distributionEfficiency;
  const energyBalance = totalGeneration - totalConsumption;
  const capacityUsage = totalStorage > 0 ? (state.energy.currentStored / totalStorage) * 100 : 0;
  
  return {
    totalGeneration,
    totalConsumption,
    totalStorage,
    efficiency,
    energyBalance,
    capacityUsage
  };
}

/**
 * 항행 시스템 성능 계산
 */
export function calculateNavigationPerformance(state: ShipSystemsState): ShipPerformanceMetrics['navigation'] {
  let systemSpeed = 0;
  let accelerationBonus = 100;
  let maxWarpRange = 0;
  let warpPrepTime = 0;
  let warpAccuracy = 0;
  let navigationEfficiency = 100;
  
  Object.values(state.installedModules).forEach(module => {
    if (!module.isActive) return;
    
    const moduleInfo = getModuleById(module.id);
    if (!moduleInfo || moduleInfo.category !== ModuleCategory.NAVIGATION) return;
    
    const performance = moduleInfo.performance as NavigationModulePerformance;
    const damageMultiplier = calculateDamageMultiplier(module);
    const allocationMultiplier = module.energyAllocation / 100;
    
    // 성계 내 속도 (가장 빠른 엔진 적용)
    if (performance.systemSpeed) {
      systemSpeed = Math.max(systemSpeed, 
        performance.systemSpeed * damageMultiplier * allocationMultiplier);
    }
    
    // 가속도 보너스 (누적)
    if (performance.acceleration) {
      accelerationBonus += (performance.acceleration - 100) * damageMultiplier * allocationMultiplier;
    }
    
    // 워프 성능 (가장 좋은 워프 드라이브 적용)
    if (performance.warpRange && performance.warpRange * damageMultiplier * allocationMultiplier > maxWarpRange) {
      maxWarpRange = performance.warpRange * damageMultiplier * allocationMultiplier;
      warpPrepTime = (performance.warpPrepTime || 0) / damageMultiplier;
      warpAccuracy = (performance.warpAccuracy || 0) * damageMultiplier;
    }
    
    // 항법 효율성 (가장 좋은 항법 컴퓨터 적용)
    if (performance.calculationSpeed) {
      const calculationEfficiency = performance.calculationSpeed * damageMultiplier * allocationMultiplier;
      navigationEfficiency = Math.max(navigationEfficiency, calculationEfficiency);
    }
  });
  
  return {
    systemSpeed,
    accelerationBonus,
    maxWarpRange,
    warpPrepTime,
    warpAccuracy,
    navigationEfficiency
  };
}

/**
 * 탐사 시스템 성능 계산
 */
export function calculateExplorationPerformance(state: ShipSystemsState): ShipPerformanceMetrics['exploration'] {
  let maxScanRange = 0;
  let scanResolution = 100;
  let analysisSpeed = 0;
  let knowledgeConversion = 100;
  let totalDroneCapacity = 0;
  let specialDroneSlots = 0;
  
  Object.values(state.installedModules).forEach(module => {
    if (!module.isActive) return;
    
    const moduleInfo = getModuleById(module.id);
    if (!moduleInfo || moduleInfo.category !== ModuleCategory.EXPLORATION) return;
    
    const performance = moduleInfo.performance as ExplorationModulePerformance;
    const damageMultiplier = calculateDamageMultiplier(module);
    const allocationMultiplier = module.energyAllocation / 100;
    
    // 스캔 범위 (가장 긴 범위 적용)
    if (performance.scanRange) {
      maxScanRange = Math.max(maxScanRange, 
        performance.scanRange * damageMultiplier * allocationMultiplier);
    }
    
    // 스캔 해상도 (보너스 누적)
    if (performance.scanResolution) {
      scanResolution += (performance.scanResolution - 100) * damageMultiplier * allocationMultiplier;
    }
    
    // 분석 정밀도 향상도 해상도에 반영
    if (performance.analysisAccuracy) {
      scanResolution += (performance.analysisAccuracy - 100) * damageMultiplier * allocationMultiplier * 0.5;
    }
    
    // 데이터 처리 속도 (누적)
    if (performance.dataProcessingRate) {
      analysisSpeed += performance.dataProcessingRate * damageMultiplier * allocationMultiplier;
    }
    
    // 지식 변환 효율 (보너스 누적)
    if (performance.knowledgeConversionRate) {
      knowledgeConversion += (performance.knowledgeConversionRate - 100) * damageMultiplier * allocationMultiplier;
    }
    
    // 드론 용량 (누적)
    if (performance.droneCapacity) {
      totalDroneCapacity += Math.floor(performance.droneCapacity * damageMultiplier);
    }
    
    // 특수 드론 슬롯 (누적)
    if (performance.specialDroneSlots) {
      specialDroneSlots += Math.floor(performance.specialDroneSlots * damageMultiplier);
    }
  });
  
  return {
    maxScanRange,
    scanResolution,
    analysisSpeed,
    knowledgeConversion,
    totalDroneCapacity,
    specialDroneSlots
  };
}

/**
 * 통신 시스템 성능 계산
 */
export function calculateCommunicationPerformance(state: ShipSystemsState): ShipPerformanceMetrics['communication'] {
  let maxCommRange = 0;
  let transmissionSpeed = 0;
  let localSignalRange = 0;
  let encryptionLevel = 0;
  
  Object.values(state.installedModules).forEach(module => {
    if (!module.isActive) return;
    
    const moduleInfo = getModuleById(module.id);
    if (!moduleInfo || moduleInfo.category !== ModuleCategory.COMMUNICATION) return;
    
    const performance = moduleInfo.performance as CommunicationModulePerformance;
    const damageMultiplier = calculateDamageMultiplier(module);
    const allocationMultiplier = module.energyAllocation / 100;
    
    // 통신 거리 (가장 긴 거리 적용, 0이면 무제한)
    if (performance.communicationRange !== undefined) {
      if (performance.communicationRange === 0) {
        maxCommRange = 0; // 무제한
      } else if (maxCommRange !== 0) {
        maxCommRange = Math.max(maxCommRange, 
          performance.communicationRange * damageMultiplier * allocationMultiplier);
      }
    }
    
    // 전송 속도 (누적)
    if (performance.transmissionSpeed) {
      transmissionSpeed += performance.transmissionSpeed * damageMultiplier * allocationMultiplier;
    }
    
    // 근거리 신호 범위 (가장 긴 범위 적용)
    if (performance.signalRange) {
      localSignalRange = Math.max(localSignalRange, 
        performance.signalRange * damageMultiplier * allocationMultiplier);
    }
    
    // 암호화 수준 (가장 높은 수준 적용)
    if (performance.encryptionLevel) {
      encryptionLevel = Math.max(encryptionLevel, 
        performance.encryptionLevel * damageMultiplier);
    }
  });
  
  return {
    maxCommRange,
    transmissionSpeed,
    localSignalRange,
    encryptionLevel
  };
}

/**
 * 방어 시스템 성능 계산
 */
export function calculateDefensePerformance(state: ShipSystemsState): ShipPerformanceMetrics['defense'] {
  let totalHullIntegrity = 0;
  let kineticResistance = 0;
  let energyResistance = 0;
  let totalShieldCapacity = 0;
  let shieldRechargeRate = 0;
  let autoRepairRate = 0;
  
  Object.values(state.installedModules).forEach(module => {
    if (!module.isActive) return;
    
    const moduleInfo = getModuleById(module.id);
    if (!moduleInfo || moduleInfo.category !== ModuleCategory.DEFENSE) return;
    const performance = moduleInfo.performance as DefenseModulePerformance;
    const damageMultiplier = calculateDamageMultiplier(module);
    console.log(module)
    const allocationMultiplier = module.energyAllocation / 100;
    
    // 함체 내구도 (누적)
    if (performance.hullIntegrity) {
      totalHullIntegrity += performance.hullIntegrity * damageMultiplier;
    }
    
    // 저항력 (가장 높은 값 적용)
    if (performance.kineticResistance) {
      kineticResistance = Math.max(kineticResistance, 
        performance.kineticResistance * damageMultiplier);
    }
    
    if (performance.energyResistance) {
      energyResistance = Math.max(energyResistance, 
        performance.energyResistance * damageMultiplier);
    }
    
    // 방어막 (누적)
    if (performance.shieldCapacity) {
      totalShieldCapacity += performance.shieldCapacity * damageMultiplier * allocationMultiplier;
    }
    
    if (performance.shieldRechargeRate) {
      shieldRechargeRate += performance.shieldRechargeRate * damageMultiplier * allocationMultiplier;
    }
    
    // 자동 수리 (누적)
    if (performance.repairRate && performance.selfRepair) {
      autoRepairRate += performance.repairRate * damageMultiplier * allocationMultiplier;
    }
  });
  
  return {
    totalHullIntegrity,
    kineticResistance,
    energyResistance,
    totalShieldCapacity,
    shieldRechargeRate,
    autoRepairRate
  };
}

/**
 * 자원 관리 시스템 성능 계산
 */
export function calculateResourcePerformance(state: ShipSystemsState): ShipPerformanceMetrics['resource'] {
  let maxExtractionRate = 0;
  let extractionEfficiency = 100;
  let totalCargoCapacity = 0;
  let specialCargoSlots = 0;
  let refiningEfficiency = 0;
  
  Object.values(state.installedModules).forEach(module => {
    if (!module.isActive) return;
    
    const moduleInfo = getModuleById(module.id);
    if (!moduleInfo || moduleInfo.category !== ModuleCategory.RESOURCE) return;
    
    const performance = moduleInfo.performance as ResourceModulePerformance;
    const damageMultiplier = calculateDamageMultiplier(module);
    const allocationMultiplier = module.energyAllocation / 100;
    
    // 채취 속도 (누적)
    if (performance.extractionRate) {
      maxExtractionRate += performance.extractionRate * damageMultiplier * allocationMultiplier;
    }
    
    // 채취 효율 (보너스 누적)
    if (performance.extractionEfficiency) {
      extractionEfficiency += (performance.extractionEfficiency - 100) * damageMultiplier * allocationMultiplier;
    }
    
    // 저장 용량 (누적)
    if (performance.storageCapacity) {
      totalCargoCapacity += performance.storageCapacity * damageMultiplier;
    }
    
    // 특수 슬롯 (누적)
    if (performance.specialSlots) {
      specialCargoSlots += Math.floor(performance.specialSlots * damageMultiplier);
    }
    
    // 정제 효율 (가장 높은 효율 적용)
    if (performance.refiningEfficiency) {
      refiningEfficiency = Math.max(refiningEfficiency, 
        performance.refiningEfficiency * damageMultiplier * allocationMultiplier);
    }
  });
  
  return {
    maxExtractionRate,
    extractionEfficiency,
    totalCargoCapacity,
    specialCargoSlots,
    refiningEfficiency
  };
}

/**
 * 전체 함선 성능 계산
 */
export function calculateShipPerformance(state: ShipSystemsState): ShipPerformanceMetrics {
  return {
    power: calculatePowerPerformance(state),
    navigation: calculateNavigationPerformance(state),
    exploration: calculateExplorationPerformance(state),
    communication: calculateCommunicationPerformance(state),
    defense: calculateDefensePerformance(state),
    resource: calculateResourcePerformance(state)
  };
}

/**
 * 모듈 손상도에 따른 성능 배수 계산
 */
function calculateDamageMultiplier(module: InstalledModule): number {
  const moduleInfo = getModuleById(module.id);
  if (!moduleInfo) return 0;
  
  const durabilityRatio = module.currentDurability / moduleInfo.durability;
  
  // 내구도에 따른 성능 저하 곡선
  if (durabilityRatio <= 0) return 0;           // 완전 파괴
  if (durabilityRatio <= 0.1) return 0.1;      // 심각한 손상
  if (durabilityRatio <= 0.3) return 0.5;      // 중간 손상
  if (durabilityRatio <= 0.7) return 0.8;      // 경미한 손상
  return 1.0;                                   // 정상
}

/**
 * 에너지 우선순위에 따른 자동 에너지 분배
 */
export function autoDistributeEnergy(state: ShipSystemsState): { [moduleId: string]: number } {
  const energyDistribution: { [moduleId: string]: number } = {};
  const powerMetrics = calculatePowerPerformance(state);
  
  if (powerMetrics.energyBalance >= 0) {
    // 에너지가 충분한 경우: 모든 모듈에 100% 할당
    Object.keys(state.installedModules).forEach(moduleId => {
      if (state.installedModules[moduleId].isActive) {
        energyDistribution[moduleId] = 100;
      }
    });
  } else {
    // 에너지가 부족한 경우: 우선순위에 따라 분배
    const availableEnergy = powerMetrics.totalGeneration;
    const modules = Object.entries(state.installedModules)
      .filter(([_, module]) => module.isActive)
      .sort(([aId, _], [bId, __]) => {
        const aPriority = state.energy.prioritySettings[aId] || 5;
        const bPriority = state.energy.prioritySettings[bId] || 5;
        return bPriority - aPriority; // 높은 우선순위부터
      });
    
    let remainingEnergy = availableEnergy;
    
    modules.forEach(([moduleId, module]) => {
      const moduleInfo = getModuleById(moduleId);
      if (!moduleInfo) return;
      
      const minEnergy = moduleInfo.energyConsumption.base;
      const maxEnergy = moduleInfo.energyConsumption.max;
      
      if (remainingEnergy >= minEnergy) {
        const allocatedEnergy = Math.min(remainingEnergy, maxEnergy);
        const allocationPercentage = (allocatedEnergy / maxEnergy) * 100;
        energyDistribution[moduleId] = allocationPercentage;
        remainingEnergy -= allocatedEnergy;
      } else {
        energyDistribution[moduleId] = 0;
      }
    });
  }
  
  return energyDistribution;
}

/**
 * 모듈 효율성 분석 (업그레이드 추천용)
 */
export function analyzeModuleEfficiency(state: ShipSystemsState): {
  [moduleId: string]: {
    currentEfficiency: number;
    upgradeRecommendation: number; // 0-100 (높을수록 업그레이드 권장)
    bottleneckScore: number; // 0-100 (높을수록 병목 요소)
  }
} {
  const analysis: any = {};
  const overallPerformance = calculateShipPerformance(state);
  
  Object.entries(state.installedModules).forEach(([moduleId, module]) => {
    const moduleInfo = getModuleById(moduleId);
    if (!moduleInfo) return;
    
    const damageMultiplier = calculateDamageMultiplier(module);
    const currentEfficiency = damageMultiplier * (module.energyAllocation / 100) * 100;
    
    // 업그레이드 추천도 계산 (티어가 낮고 효율이 떨어질수록 높음)
    const tierFactor = (3 - moduleInfo.tier) / 3; // T0: 1.0, T1: 0.67, T2: 0.33
    const efficiencyFactor = (100 - currentEfficiency) / 100;
    const upgradeRecommendation = (tierFactor * 0.6 + efficiencyFactor * 0.4) * 100;
    
    // 병목 요소 점수 계산 (해당 카테고리의 성능이 다른 카테고리보다 낮으면 높음)
    let bottleneckScore = 0;
    switch (moduleInfo.category) {
      case ModuleCategory.POWER:
        if (overallPerformance.power.energyBalance < 0) bottleneckScore = 80;
        break;
      case ModuleCategory.NAVIGATION:
        if (overallPerformance.navigation.systemSpeed < 100) bottleneckScore = 60;
        break;
      case ModuleCategory.EXPLORATION:
        if (overallPerformance.exploration.maxScanRange < 2) bottleneckScore = 70;
        break;
      // 다른 카테고리들도 추가...
    }
    
    analysis[moduleId] = {
      currentEfficiency,
      upgradeRecommendation,
      bottleneckScore
    };
  });
  
  return analysis;
}
