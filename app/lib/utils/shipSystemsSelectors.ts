// 함선 시스템 상태 셀렉터 (Redux 상태에서 특정 데이터를 효율적으로 추출)
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { 
  ShipSystemsState, 
  InstalledModule 
} from '../features/shipSystemsSlice';
import { 
  getModuleById, 
  ModuleCategory,
  CompleteModuleInfo,
  getNextTierModule,
  getModulesByCategory 
} from '../../data/shipModules';
import { 
  calculateShipPerformance,
  ShipPerformanceMetrics 
} from './shipPerformanceUtils';

// === 기본 셀렉터 ===

/**
 * 함선 시스템 전체 상태 선택
 */
export const selectShipSystems = (state: RootState): ShipSystemsState => state.shipSystems;

/**
 * 설치된 모듈들 선택
 */
export const selectInstalledModules = createSelector(
  [selectShipSystems],
  (shipSystems) => shipSystems.installedModules
);

/**
 * 에너지 관리 상태 선택
 */
export const selectEnergyManagement = createSelector(
  [selectShipSystems],
  (shipSystems) => shipSystems.energy
);

/**
 * 자원 관리 상태 선택
 */
export const selectResourceManagement = createSelector(
  [selectShipSystems],
  (shipSystems) => shipSystems.resources
);

// === 카테고리별 모듈 셀렉터 ===

/**
 * 카테고리별 설치된 모듈 선택
 */
export const selectModulesByCategory = createSelector(
  [selectInstalledModules, (_: RootState, category: ModuleCategory) => category],
  (modules, category) => {
    return Object.entries(modules)
      .filter(([moduleId, _]) => {
        const moduleInfo = getModuleById(moduleId);
        return moduleInfo?.category === category;
      })
      .reduce((acc, [moduleId, module]) => {
        acc[moduleId] = module;
        return acc;
      }, {} as { [moduleId: string]: InstalledModule });
  }
);

/**
 * 동력 시스템 모듈들 선택
 */
export const selectPowerModules = createSelector(
  [selectInstalledModules],
  (modules) => {
    return Object.entries(modules)
      .filter(([moduleId, _]) => {
        const moduleInfo = getModuleById(moduleId);
        return moduleInfo?.category === ModuleCategory.POWER;
      })
      .reduce((acc, [moduleId, module]) => {
        acc[moduleId] = { ...module, info: getModuleById(moduleId)! };
        return acc;
      }, {} as { [moduleId: string]: InstalledModule & { info: CompleteModuleInfo } });
  }
);

/**
 * 항행 시스템 모듈들 선택
 */
export const selectNavigationModules = createSelector(
  [selectInstalledModules],
  (modules) => {
    return Object.entries(modules)
      .filter(([moduleId, _]) => {
        const moduleInfo = getModuleById(moduleId);
        return moduleInfo?.category === ModuleCategory.NAVIGATION;
      })
      .reduce((acc, [moduleId, module]) => {
        acc[moduleId] = { ...module, info: getModuleById(moduleId)! };
        return acc;
      }, {} as { [moduleId: string]: InstalledModule & { info: CompleteModuleInfo } });
  }
);

/**
 * 탐사 시스템 모듈들 선택
 */
export const selectExplorationModules = createSelector(
  [selectInstalledModules],
  (modules) => {
    return Object.entries(modules)
      .filter(([moduleId, _]) => {
        const moduleInfo = getModuleById(moduleId);
        return moduleInfo?.category === ModuleCategory.EXPLORATION;
      })
      .reduce((acc, [moduleId, module]) => {
        acc[moduleId] = { ...module, info: getModuleById(moduleId)! };
        return acc;
      }, {} as { [moduleId: string]: InstalledModule & { info: CompleteModuleInfo } });
  }
);

// === 성능 메트릭 셀렉터 ===

/**
 * 전체 함선 성능 계산
 */
export const selectShipPerformance = createSelector(
  [selectShipSystems],
  (shipSystems): ShipPerformanceMetrics => {
    return calculateShipPerformance(shipSystems);
  }
);

/**
 * 동력 시스템 성능만 선택
 */
export const selectPowerPerformance = createSelector(
  [selectShipPerformance],
  (performance) => performance.power
);

/**
 * 항행 시스템 성능만 선택
 */
export const selectNavigationPerformance = createSelector(
  [selectShipPerformance],
  (performance) => performance.navigation
);

/**
 * 탐사 시스템 성능만 선택
 */
export const selectExplorationPerformance = createSelector(
  [selectShipPerformance],
  (performance) => performance.exploration
);

// === 상태 분석 셀렉터 ===

/**
 * 손상된 모듈들 선택
 */
export const selectDamagedModules = createSelector(
  [selectInstalledModules],
  (modules) => {
    return Object.entries(modules)
      .filter(([moduleId, module]) => {
        const moduleInfo = getModuleById(moduleId);
        return moduleInfo && module.currentDurability < moduleInfo.durability * 0.8;
      })
      .map(([moduleId, module]) => ({
        moduleId,
        module,
        info: getModuleById(moduleId)!,
        damagePercentage: Math.round((1 - module.currentDurability / getModuleById(moduleId)!.durability) * 100)
      }))
      .sort((a, b) => b.damagePercentage - a.damagePercentage); // 손상도가 높은 순으로 정렬
  }
);

/**
 * 비활성화된 모듈들 선택
 */
export const selectInactiveModules = createSelector(
  [selectInstalledModules],
  (modules) => {
    return Object.entries(modules)
      .filter(([_, module]) => !module.isActive)
      .map(([moduleId, module]) => ({
        moduleId,
        module,
        info: getModuleById(moduleId)!
      }));
  }
);

/**
 * 업그레이드 가능한 모듈들 선택
 */
export const selectUpgradeableModules = createSelector(
  [selectInstalledModules],
  (modules) => {
    return Object.entries(modules)
      .map(([moduleId, module]) => {
        const nextTierModule = getNextTierModule(moduleId);
        if (!nextTierModule) return null;
        
        return {
          moduleId,
          currentModule: module,
          currentInfo: getModuleById(moduleId)!,
          nextTierInfo: nextTierModule
        };
      })
      .filter(item => item !== null)
      .sort((a, b) => {
        // 티어가 낮고 효율이 떨어지는 순으로 정렬 (업그레이드 우선순위)
        const aEfficiency = a!.currentModule.currentDurability / a!.currentInfo.durability;
        const bEfficiency = b!.currentModule.currentDurability / b!.currentInfo.durability;
        const aTierPriority = (3 - a!.currentInfo.tier) * 100;
        const bTierPriority = (3 - b!.currentInfo.tier) * 100;
        
        return (bTierPriority + (100 - bEfficiency * 100)) - (aTierPriority + (100 - aEfficiency * 100));
      });
  }
);

/**
 * 에너지 부족 상태 확인
 */
export const selectEnergyStatus = createSelector(
  [selectPowerPerformance, selectEnergyManagement],
  (powerPerformance, energyManagement) => {
    const isDeficit = powerPerformance.energyBalance < 0;
    const isLowStorage = energyManagement.currentStored < energyManagement.totalStorage * 0.2;
    const isCritical = isDeficit && isLowStorage;
    
    return {
      isDeficit,
      isLowStorage,
      isCritical,
      energyBalance: powerPerformance.energyBalance,
      storagePercentage: energyManagement.totalStorage > 0 
        ? (energyManagement.currentStored / energyManagement.totalStorage) * 100 
        : 0,
      status: isCritical ? 'critical' : isDeficit ? 'deficit' : isLowStorage ? 'low' : 'normal'
    };
  }
);

/**
 * 자원 저장 상태 확인
 */
export const selectResourceStatus = createSelector(
  [selectResourceManagement],
  (resourceManagement) => {
    const usagePercentage = resourceManagement.maxCapacity > 0 
      ? (resourceManagement.currentCapacity / resourceManagement.maxCapacity) * 100 
      : 0;
    
    const isFull = usagePercentage >= 100;
    const isNearFull = usagePercentage >= 90;
    const isEmpty = resourceManagement.currentCapacity === 0;
    
    return {
      usagePercentage,
      isFull,
      isNearFull,
      isEmpty,
      availableSpace: resourceManagement.maxCapacity - resourceManagement.currentCapacity,
      status: isFull ? 'full' : isNearFull ? 'near-full' : isEmpty ? 'empty' : 'normal'
    };
  }
);

/**
 * 활성 작업 상태 (스캔, 전송, 업그레이드 등)
 */
export const selectActiveOperations = createSelector(
  [selectShipSystems],
  (shipSystems) => {
    const activeScans = Object.keys(shipSystems.activeScans).length;
    const activeTransmissions = Object.keys(shipSystems.communicationStatus.transmissionQueue).length;
    const activeUpgrades = Object.keys(shipSystems.upgradeQueue).length;
    
    return {
      scans: {
        count: activeScans,
        details: shipSystems.activeScans
      },
      transmissions: {
        count: activeTransmissions,
        details: shipSystems.communicationStatus.transmissionQueue
      },
      upgrades: {
        count: activeUpgrades,
        details: shipSystems.upgradeQueue
      },
      totalOperations: activeScans + activeTransmissions + activeUpgrades,
      isIdle: activeScans === 0 && activeTransmissions === 0 && activeUpgrades === 0
    };
  }
);

/**
 * 함선 전체 상태 요약
 */
export const selectShipStatusSummary = createSelector(
  [
    selectEnergyStatus,
    selectResourceStatus,
    selectDamagedModules,
    selectInactiveModules,
    selectActiveOperations,
    selectShipSystems
  ],
  (energyStatus, resourceStatus, damagedModules, inactiveModules, operations, shipSystems) => {
    // 전체 건강도 계산
    let healthScore = 100;
    
    // 에너지 상태에 따른 점수 차감
    if (energyStatus.isCritical) healthScore -= 30;
    else if (energyStatus.isDeficit) healthScore -= 15;
    else if (energyStatus.isLowStorage) healthScore -= 5;
    
    // 손상된 모듈에 따른 점수 차감
    damagedModules.forEach(damaged => {
      healthScore -= damaged.damagePercentage * 0.1;
    });
    
    // 비활성화된 모듈에 따른 점수 차감
    healthScore -= inactiveModules.length * 5;
    
    // 함체 상태에 따른 점수 차감
    healthScore -= (100 - shipSystems.overallHullIntegrity) * 0.3;
    
    healthScore = Math.max(0, Math.min(100, healthScore));
    
    // 상태 등급 결정
    let statusGrade: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    if (healthScore >= 90) statusGrade = 'excellent';
    else if (healthScore >= 75) statusGrade = 'good';
    else if (healthScore >= 50) statusGrade = 'fair';
    else if (healthScore >= 25) statusGrade = 'poor';
    else statusGrade = 'critical';
    
    // 주요 경고사항
    const warnings: string[] = [];
    if (energyStatus.isCritical) warnings.push('에너지 위기 상황');
    if (resourceStatus.isFull) warnings.push('화물칸 포화');
    if (damagedModules.length > 0) warnings.push(`${damagedModules.length}개 모듈 손상`);
    if (shipSystems.overallHullIntegrity < 50) warnings.push('함체 손상 심각');
    
    return {
      healthScore: Math.round(healthScore),
      statusGrade,
      warnings,
      energy: energyStatus,
      resources: resourceStatus,
      damagedModulesCount: damagedModules.length,
      inactiveModulesCount: inactiveModules.length,
      activeOperations: operations.totalOperations,
      isInCombat: shipSystems.isInCombat,
      hullIntegrity: shipSystems.overallHullIntegrity,
      shieldIntegrity: shipSystems.overallShieldIntegrity
    };
  }
);

/**
 * 특정 모듈의 상세 정보 선택 (UI에서 모듈 클릭 시 사용)
 */
export const selectModuleDetails = createSelector(
  [selectInstalledModules, (_: RootState, moduleId: string) => moduleId],
  (modules, moduleId) => {
    const module = modules[moduleId];
    if (!module) return null;
    
    const moduleInfo = getModuleById(moduleId);
    if (!moduleInfo) return null;
    
    const nextTierModule = getNextTierModule(moduleId);
    const damagePercentage = Math.round((1 - module.currentDurability / moduleInfo.durability) * 100);
    const efficiencyPercentage = Math.round((module.currentDurability / moduleInfo.durability) * (module.energyAllocation / 100) * 100);
    
    return {
      module,
      info: moduleInfo,
      nextTier: nextTierModule,
      damagePercentage,
      efficiencyPercentage,
      canUpgrade: nextTierModule !== undefined,
      needsRepair: damagePercentage > 20,
      isEnergyEfficient: module.energyAllocation > 80,
      statusText: module.isActive 
        ? damagePercentage > 50 
          ? '심각한 손상' 
          : damagePercentage > 20 
            ? '경미한 손상' 
            : '정상 작동'
        : '비활성화됨'
    };
  }
);

/**
 * 모듈 카테고리별 성능 요약
 */
export const selectCategoryPerformanceSummary = createSelector(
  [selectShipPerformance, selectInstalledModules],
  (performance, modules) => {
    const categorySummary = {
      [ModuleCategory.POWER]: {
        name: '동력 시스템',
        score: Math.min(100, (performance.power.totalGeneration / Math.max(1, performance.power.totalConsumption)) * 100),
        status: performance.power.energyBalance >= 0 ? 'normal' : 'deficit',
        details: `발전: ${performance.power.totalGeneration}PU, 소모: ${performance.power.totalConsumption}PU`
      },
      [ModuleCategory.NAVIGATION]: {
        name: '항행 시스템',
        score: Math.min(100, performance.navigation.systemSpeed / 2), // 200이 만점이라고 가정
        status: performance.navigation.systemSpeed > 50 ? 'normal' : 'low',
        details: `속도: ${performance.navigation.systemSpeed}SU, 워프: ${performance.navigation.maxWarpRange}LY`
      },
      [ModuleCategory.EXPLORATION]: {
        name: '탐사 시스템',
        score: Math.min(100, (performance.exploration.maxScanRange / 5) * 50 + (performance.exploration.analysisSpeed / 50) * 50),
        status: performance.exploration.maxScanRange > 1 ? 'normal' : 'limited',
        details: `스캔 범위: ${performance.exploration.maxScanRange}AU, 분석: ${performance.exploration.analysisSpeed}DP/h`
      },
      [ModuleCategory.COMMUNICATION]: {
        name: '통신 시스템',
        score: Math.min(100, performance.communication.transmissionSpeed * 20), // 5가 만점이라고 가정
        status: performance.communication.transmissionSpeed > 1 ? 'normal' : 'slow',
        details: `전송 속도: ${performance.communication.transmissionSpeed}KP/s`
      },
      [ModuleCategory.DEFENSE]: {
        name: '방어 시스템',
        score: Math.min(100, (performance.defense.totalHullIntegrity / 1000) * 60 + (performance.defense.totalShieldCapacity / 300) * 40),
        status: performance.defense.totalHullIntegrity > 800 ? 'normal' : 'vulnerable',
        details: `함체: ${performance.defense.totalHullIntegrity}HP, 방어막: ${performance.defense.totalShieldCapacity}SP`
      },
      [ModuleCategory.RESOURCE]: {
        name: '자원 관리',
        score: Math.min(100, (performance.resource.maxExtractionRate * 10) + (performance.resource.totalCargoCapacity / 10)),
        status: performance.resource.totalCargoCapacity > 400 ? 'normal' : 'limited',
        details: `채취: ${performance.resource.maxExtractionRate}RU/s, 저장: ${performance.resource.totalCargoCapacity}CU`
      }
    };
    
    return categorySummary;
  }
);

/**
 * 업그레이드 추천 목록
 */
export const selectUpgradeRecommendations = createSelector(
  [selectUpgradeableModules, selectEnergyStatus, selectResourceStatus, selectDamagedModules],
  (upgradeableModules, energyStatus, resourceStatus, damagedModules) => {
    const recommendations = [];
    
    // 에너지 부족 시 동력 시스템 우선 추천
    if (energyStatus.isDeficit) {
      const powerUpgrades = upgradeableModules.filter(item => 
        item && item.currentInfo.category === ModuleCategory.POWER
      );
      recommendations.push(...powerUpgrades.slice(0, 2).map(item => ({
        ...item,
        priority: 'high' as const,
        reason: '에너지 부족 해결을 위해 동력 시스템 업그레이드가 필요합니다.'
      })));
    }
    
    // 저장 공간 부족 시 자원 관리 시스템 추천
    if (resourceStatus.isNearFull) {
      const resourceUpgrades = upgradeableModules.filter(item => 
        item && item.currentInfo.category === ModuleCategory.RESOURCE && item.currentInfo.id.startsWith('CH_01')
      );
      recommendations.push(...resourceUpgrades.slice(0, 1).map(item => ({
        ...item,
        priority: 'medium' as const,
        reason: '화물칸 확장으로 더 많은 자원을 저장할 수 있습니다.'
      })));
    }
    
    // 손상된 모듈 수리 우선 추천 (업그레이드 대신)
    damagedModules.slice(0, 3).forEach(damaged => {
      recommendations.push({
        moduleId: damaged.moduleId,
        type: 'repair' as const,
        priority: damaged.damagePercentage > 50 ? 'high' as const : 'medium' as const,
        reason: `${damaged.info.nameKo}이(가) ${damaged.damagePercentage}% 손상되었습니다.`
      });
    });
    
    // 일반 업그레이드 추천 (T0 모듈 우선)
    const generalUpgrades = upgradeableModules
      .filter(item => item && item.currentInfo.tier === 0)
      .slice(0, 3)
      .map(item => ({
        ...item,
        priority: 'low' as const,
        reason: '더 나은 성능을 위해 업그레이드를 고려해보세요.'
      }));
    
    recommendations.push(...generalUpgrades);
    
    return recommendations.slice(0, 5); // 최대 5개 추천
  }
);

export default {
  // 기본 셀렉터
  selectShipSystems,
  selectInstalledModules,
  selectEnergyManagement,
  selectResourceManagement,
  
  // 카테고리별 모듈 셀렉터
  selectModulesByCategory,
  selectPowerModules,
  selectNavigationModules,
  selectExplorationModules,
  
  // 성능 메트릭 셀렉터
  selectShipPerformance,
  selectPowerPerformance,
  selectNavigationPerformance,
  selectExplorationPerformance,
  
  // 상태 분석 셀렉터
  selectDamagedModules,
  selectInactiveModules,
  selectUpgradeableModules,
  selectEnergyStatus,
  selectResourceStatus,  selectActiveOperations,
  selectShipStatusSummary,
  selectModuleDetails,
  selectCategoryPerformanceSummary,
  selectUpgradeRecommendations
};

// === 추가 셀렉터 (UI 컴포넌트용) ===

/**
 * 위험한 시스템들 선택 (임계 상태인 시스템들)
 */
export const selectCriticalSystems = createSelector(
  [selectDamagedModules, selectEnergyStatus, selectShipSystems],
  (damagedModules, energyStatus, shipSystems) => {
    const criticalSystems = [];
    
    // 심각하게 손상된 모듈들
    damagedModules.forEach(damaged => {
      if (damaged.damagePercentage > 70) {
        criticalSystems.push({
          type: 'module',
          id: damaged.moduleId,
          name: damaged.info.nameEn,
          severity: 'critical',
          message: `모듈 손상 ${damaged.damagePercentage}%`
        });
      }
    });
    
    // 에너지 부족 상태
    if (energyStatus.isCritical) {
      criticalSystems.push({
        type: 'energy',
        id: 'energy_critical',
        name: '에너지 시스템',
        severity: 'critical',
        message: '에너지 부족으로 인한 임계 상태'
      });
    }
    
    // 함체 손상
    if (shipSystems.overallHullIntegrity < 30) {
      criticalSystems.push({
        type: 'hull',
        id: 'hull_critical',
        name: '함체 구조',
        severity: 'critical',
        message: `함체 손상 ${Math.round(100 - shipSystems.overallHullIntegrity)}%`
      });
    }
    
    return criticalSystems;
  }
);

/**
 * 전체 시스템 건강도 선택
 */
export const selectSystemHealth = createSelector(
  [selectShipStatusSummary],
  (statusSummary) => {
    return {
      overallHealth: statusSummary.healthScore,
      status: statusSummary.statusGrade,
      criticalIssues: statusSummary.warnings.length || 0,
      warnings: statusSummary.warnings || []
    };
  }
);

/**
 * 상세한 에너지 정보 선택 (발전량, 소비량 포함)
 */
export const selectDetailedEnergyStatus = createSelector(
  [selectEnergyManagement, selectPowerPerformance, selectEnergyStatus],
  (energyManagement, powerPerformance, energyStatus) => {
    return {
      // 기존 에너지 상태
      ...energyStatus,
      // 상세 정보 추가
      generation: energyManagement.totalGeneration,
      consumption: energyManagement.totalConsumption,
      stored: energyManagement.currentStored,
      capacity: energyManagement.totalStorage,
      efficiency: energyManagement.distributionEfficiency
    };
  }
);
