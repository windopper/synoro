// 항법 시스템 전용 관리 클래스
import {
  ShipSystemsState,
  updateEnergyStorage,
  completeNavigation,
  damageModule,
  addResources,
  addResearchPoints,
  updateNavigationProgress,
} from "../features/shipSystemsSlice";
import { calculateShipPerformance } from "./shipPerformanceUtils";
import { AppDispatch } from "../store";

// === 항법 시스템 인터페이스 ===
export interface NavigationEvent {
  id: string;
  type: "anomaly" | "debris" | "signal" | "malfunction" | "discovery";
  probability: number;
  description: string;
}

export interface NavigationStatus {
  isActive: boolean;
  targetStarId: string | null;
  targetPosition: { x: number; y: number; z: number } | null;
  progress: number; // 0-100%
  estimatedTimeRemaining: number; // seconds
  energyConsumptionRate: number; // energy per second
  currentSpeed: number; // AU/hour
}

// === 항법 시스템 관리자 ===
export class NavigationSystemManager {
  private dispatch: AppDispatch;
  private eventHistory: NavigationEvent[] = [];

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  /**
   * 항법 시스템 상태 업데이트
   */
  updateNavigationSystem(state: ShipSystemsState, deltaTime: number): void {
    // 항법이 활성화되어 있지 않으면 스킵
    if (!this.isNavigationActive(state)) {
      return;
    }

    const performance = calculateShipPerformance(state);
    const navigationSpeed = performance.navigation.systemSpeed;

    // 항법 시스템이 비활성화되어 있으면 경고
    if (navigationSpeed <= 0) {
      console.warn(
        "⚠️ 항법 시스템이 비활성화되어 있습니다. 기본 속도로 항법합니다."
      );
      this.processSlowNavigation(state, deltaTime);
      return;
    }

    if (state.navigation?.navigationMode === "warp") {
      this.processWarpNavigation(state, deltaTime);
      return;
    }

    // 정상 항법 처리
    this.processNormalNavigation(state, deltaTime, navigationSpeed);
  }

  /**
   * 항법 활성화 상태 확인
   */
  private isNavigationActive(state: ShipSystemsState): boolean {
    return !!(
      state.navigation?.targetStarId && state.navigation?.targetPosition
    );
  }

  /**
   * 정상 항법 처리
   */
  private processNormalNavigation(
    state: ShipSystemsState,
    deltaTime: number,
    navigationSpeed: number
  ): void {
    if (!state.navigation?.targetPosition) return;

    const currentPosition = state.position;
    const targetPosition = state.navigation.targetPosition;

    // 목표까지의 총 거리 계산
    const totalDistance = this.calculateDistance(
      currentPosition,
      targetPosition
    );

    // 거리가 너무 짧으면 즉시 도착 처리
    if (totalDistance < 0.1) {
      this.completeNavigation(state);
      return;
    }

    // 항법 속도에 따른 진행도 계산
    const effectiveSpeed = this.calculateEffectiveSpeed(state, navigationSpeed);
    const distanceTraveled = (effectiveSpeed / 3600) * deltaTime; // 이번 업데이트에서 이동한 거리

    // 이동 진행도 업데이트 (0~100%)
    const progressIncrement = (distanceTraveled / totalDistance) * 100;
    const newProgress = Math.min(
      100,
      state.navigation.travelProgress + progressIncrement
    );

    // 현재까지 항해한 총 시간 계산 (기존 시간 + 이번 업데이트 시간)
    const currentTravelTime = state.navigation.travelTime + deltaTime;

    // 항해 완료 예상 시간 계산
    const remainingDistance = totalDistance * (1 - newProgress / 100);
    const estimatedTimeToCompletion =
      remainingDistance / (effectiveSpeed / 3600); // 초 단위
    const estimatedCompletion = Date.now() + estimatedTimeToCompletion * 1000; // 완료 예상 시각

    this.dispatch(
      updateNavigationProgress({
        progress: newProgress,
        travelSpeed: effectiveSpeed, // 현재 속도 (AU/시간)
        travelTime: currentTravelTime, // 현재까지 항해한 시간 (초)
        estimatedCompletion: estimatedCompletion, // 항해 완료 예상 시각 (timestamp)
      })
    );

    // 에너지 소모 처리
    // this.consumeNavigationEnergy(state, deltaTime, effectiveSpeed);

    // 항법 완료 체크
    if (newProgress >= 100) {
      this.completeNavigation(state);
    } else {
      // 항법 중 이벤트 체크
      this.checkNavigationEvents(state, deltaTime);
    }
  }

  /**
   * 워프 항법 처리 - 3초 이내 도착
   * @param state
   * @param deltaTime
   * @param navigationSpeed 워프 속도
   */
  private processWarpNavigation(
    state: ShipSystemsState,
    deltaTime: number
  ): void {
    const warpSpeed = 9999;
    if (!state.navigation?.targetPosition) return;

    const currentPosition = state.position;
    const targetPosition = state.navigation.targetPosition;

    const totalDistance = this.calculateDistance(
      currentPosition,
      targetPosition
    );
    const distanceTraveled = (warpSpeed / 3600) * deltaTime;

    const progressIncrement = (distanceTraveled / totalDistance) * 100;
    const newProgress = Math.min(
      100,
      state.navigation.travelProgress + progressIncrement
    );

    const currentTravelTime = state.navigation.travelTime + deltaTime;

    const remainingDistance = totalDistance * (1 - newProgress / 100);
    const estimatedTimeToCompletion = remainingDistance / (warpSpeed / 3600);
    const estimatedCompletion = Date.now() + estimatedTimeToCompletion * 1000;

    this.dispatch(
      updateNavigationProgress({
        progress: newProgress,
        travelSpeed: warpSpeed,
        travelTime: currentTravelTime,
        estimatedCompletion: estimatedCompletion,
      })
    );

    if (newProgress >= 100) {
      this.completeNavigation(state);
    }
  }

  /**
   * 느린 항법 처리 (시스템 비활성화 시)
   */
  private processSlowNavigation(
    state: ShipSystemsState,
    deltaTime: number
  ): void {
    if (!state.navigation?.targetPosition) return;

    const slowSpeed = 0.1; // 매우 느린 기본 속도
    const currentPosition = state.position;
    const targetPosition = state.navigation.targetPosition;
    const totalDistance = this.calculateDistance(
      currentPosition,
      targetPosition
    );

    if (totalDistance < 0.1) {
      this.completeNavigation(state);
      return;
    }

    const distanceTraveled = (slowSpeed / 3600) * deltaTime;
    const progressIncrement = (distanceTraveled / totalDistance) * 100;
    const newProgress = Math.min(
      100,
      state.navigation.travelProgress + progressIncrement
    );

    // 현재까지 항해한 총 시간 계산
    const currentTravelTime = state.navigation.travelTime + deltaTime;

    // 항해 완료 예상 시간 계산 (느린 속도 기준)
    const remainingDistance = totalDistance * (1 - newProgress / 100);
    const estimatedTimeToCompletion = remainingDistance / (slowSpeed / 3600); // 초 단위
    const estimatedCompletion = Date.now() + estimatedTimeToCompletion * 1000; // 완료 예상 시각

    this.dispatch(
      updateNavigationProgress({
        progress: newProgress,
        travelSpeed: slowSpeed, // 현재 속도 (AU/시간)
        travelTime: currentTravelTime, // 현재까지 항해한 시간 (초)
        estimatedCompletion: estimatedCompletion, // 항해 완료 예상 시각 (timestamp)
      })
    );

    if (newProgress >= 100) {
      this.completeNavigation(state);
    }
  }

  /**
   * 거리 계산 (3D 유클리드 거리)
   */
  private calculateDistance(
    pos1: { x: number; y: number; z: number },
    pos2: { x: number; y: number; z: number }
  ): number {
    return Math.sqrt(
      Math.pow(pos2.x - pos1.x, 2) +
        Math.pow(pos2.y - pos1.y, 2) +
        Math.pow(pos2.z - pos1.z, 2)
    );
  }

  /**
   * 효과적인 항법 속도 계산
   */
  private calculateEffectiveSpeed(
    state: ShipSystemsState,
    baseNavigationSpeed: number
  ): number {
    const baseSpeed = 1.0; // 기본 속도 (AU/시간)
    let speedMultiplier = 1 + baseNavigationSpeed;

    // 에너지 상태에 따른 속도 조정
    const energyRatio = state.energy.currentStored / state.energy.totalStorage;
    if (energyRatio < 0.2) {
      speedMultiplier *= 0.5; // 에너지 부족 시 50% 속도
    } else if (energyRatio < 0.1) {
      speedMultiplier *= 0.25; // 에너지 매우 부족 시 25% 속도
    }

    // 항법 관련 모듈 손상도에 따른 속도 조정
    const navigationModuleDamage = this.calculateNavigationModuleDamage(state);
    speedMultiplier *= 1 - navigationModuleDamage;

    return baseSpeed * speedMultiplier;
  }

  /**
   * 항법 관련 모듈 손상도 계산
   */
  private calculateNavigationModuleDamage(state: ShipSystemsState): number {
    const navigationModules = Object.values(state.installedModules).filter(
      (module) => module.id.startsWith("CB_") && module.isActive
    );

    if (navigationModules.length === 0) return 0.5; // 항법 모듈 없음

    const totalDamage = navigationModules.reduce((sum, module) => {
      return sum + (100 - module.currentDurability);
    }, 0);

    return Math.min(0.8, totalDamage / (navigationModules.length * 100)); // 최대 80% 손상
  }

  /**
   * 항법 중 에너지 소모 처리
   */
  private consumeNavigationEnergy(
    state: ShipSystemsState,
    deltaTime: number,
    effectiveSpeed: number
  ): void {
    // 항법 중 에너지 소모량 계산 (속도에 비례)
    const baseEnergyConsumption = 5; // 기본 에너지 소모량 (kW)
    const speedMultiplier = Math.max(1, effectiveSpeed / 1.0); // 속도에 따른 배수
    const energyConsumption =
      baseEnergyConsumption * speedMultiplier * (deltaTime / 3600);

    // 현재 저장된 에너지에서 차감
    const newStoredEnergy = Math.max(
      0,
      state.energy.currentStored - energyConsumption
    );
    this.dispatch(updateEnergyStorage(newStoredEnergy));

    // 에너지 부족 시 경고
    if (newStoredEnergy < state.energy.totalStorage * 0.1) {
      console.warn("⚡ 항법 중 에너지 부족! 속도가 감소될 수 있습니다.");
    }
  }

  /**
   * 항법 완료 처리
   */
  private completeNavigation(state: ShipSystemsState): void {
    if (!state.navigation?.targetStarId) return;

    const targetStarId = state.navigation.targetStarId;

    console.log(`🚀 항법 완료: ${targetStarId}에 도착했습니다.`);
    this.dispatch(completeNavigation());

    // 도착 시 보상 처리
    this.handleNavigationArrival(state, targetStarId);
  }

  /**
   * 항법 도착 시 보상 처리
   */
  private handleNavigationArrival(
    state: ShipSystemsState,
    targetStarId: string
  ): void {
    // 도착 보상 계산
    const arrivalRewards = this.calculateArrivalRewards(state, targetStarId);
    this.dispatch(addResources(arrivalRewards.resources));

    // 연구 포인트 보너스
    if (arrivalRewards.researchPoints > 0) {
      this.dispatch(addResearchPoints(arrivalRewards.researchPoints));
    }

    console.log(`🎯 ${targetStarId} 도착 보상:`, arrivalRewards);

    // 자동 스캔 시작 (설정이 활성화된 경우)
    if (state.automationSettings.scanningMode === "active") {
      console.log("🔍 자동 스캔을 시작합니다.");
      // 실제로는 새로운 스캔 시작 로직 호출
    }
  }

  /**
   * 도착 보상 계산
   */
  private calculateArrivalRewards(
    state: ShipSystemsState,
    targetStarId: string
  ): {
    resources: Record<string, number>;
    researchPoints: number;
  } {
    const distance = state.navigation?.targetPosition
      ? this.calculateDistance(state.position, state.navigation.targetPosition)
      : 1;

    // 거리에 비례한 보상 계산
    const distanceBonus = Math.floor(distance * 2);

    const baseRewards = {
      resources: {
        "항법 경험치": 10 + distanceBonus,
        "탐사 데이터":
          Math.floor(Math.random() * 3) + 1 + Math.floor(distanceBonus / 2),
      } as Record<string, number>,
      researchPoints: Math.floor(Math.random() * 20) + 10 + distanceBonus,
    };

    // 특별한 별계 타입에 따른 추가 보상
    if (targetStarId.includes("binary")) {
      baseRewards.resources["이진성 데이터"] =
        Math.floor(Math.random() * 2) + 1;
      baseRewards.researchPoints += 15;
    } else if (targetStarId.includes("giant")) {
      baseRewards.resources["거대별 관측 데이터"] =
        Math.floor(Math.random() * 2) + 1;
      baseRewards.researchPoints += 20;
    }

    return baseRewards;
  }

  /**
   * 항법 중 랜덤 이벤트 체크
   */
  private checkNavigationEvents(
    state: ShipSystemsState,
    deltaTime: number
  ): void {
    // 항법 중에만 발생하는 특별한 이벤트들
    const baseEventChance = 0.0005; // 기본 이벤트 확률
    const eventChance = baseEventChance * deltaTime;

    if (Math.random() < eventChance) {
      const availableEvents = this.getAvailableEvents(state);

      if (availableEvents.length > 0) {
        const randomEvent =
          availableEvents[Math.floor(Math.random() * availableEvents.length)];
        this.triggerNavigationEvent(state, randomEvent);
      }
    }
  }

  /**
   * 사용 가능한 이벤트 목록 가져오기
   */
  private getAvailableEvents(state: ShipSystemsState): NavigationEvent[] {
    const events: NavigationEvent[] = [
      {
        id: "space_anomaly",
        type: "anomaly",
        probability: 0.25,
        description: "우주 이상 현상 발견",
      },
      {
        id: "drifting_debris",
        type: "debris",
        probability: 0.35,
        description: "표류하는 잔해 발견",
      },
      {
        id: "unknown_signal",
        type: "signal",
        probability: 0.2,
        description: "미지의 신호 탐지",
      },
      {
        id: "navigation_malfunction",
        type: "malfunction",
        probability: 0.15,
        description: "항법 시스템 일시적 오작동",
      },
      {
        id: "scientific_discovery",
        type: "discovery",
        probability: 0.05,
        description: "중요한 과학적 발견",
      },
    ];

    // 통신 시스템이 없으면 신호 관련 이벤트 제외
    const hasActiveCommunication = Object.values(state.installedModules).some(
      (module) => module.id.startsWith("CA_") && module.isActive
    );

    return events.filter((event) => {
      if (event.type === "signal" && !hasActiveCommunication) {
        return false;
      }
      return true;
    });
  }

  /**
   * 항법 이벤트 발생
   */
  private triggerNavigationEvent(
    state: ShipSystemsState,
    event: NavigationEvent
  ): void {
    // 이벤트 히스토리에 추가
    this.eventHistory.push({
      ...event,
      id: `${event.id}_${Date.now()}`,
    });

    // 이벤트 타입별 처리
    switch (event.type) {
      case "anomaly":
        this.handleSpaceAnomalyEvent(state);
        break;
      case "debris":
        this.handleDriftingDebrisEvent(state);
        break;
      case "signal":
        this.handleUnknownSignalEvent(state);
        break;
      case "malfunction":
        this.handleNavigationMalfunctionEvent(state);
        break;
      case "discovery":
        this.handleScientificDiscoveryEvent(state);
        break;
    }
  }

  /**
   * 우주 이상 현상 이벤트 처리
   */
  private handleSpaceAnomalyEvent(state: ShipSystemsState): void {
    console.log("🌌 우주 이상 현상을 발견했습니다!");

    const anomalyRewards = {
      "이상 현상 데이터": Math.floor(Math.random() * 2) + 1,
      "에너지 크리스탈": Math.floor(Math.random() * 3) + 1,
    };

    this.dispatch(addResources(anomalyRewards));

    // 연구 포인트 대량 획득
    const researchBonus = Math.floor(Math.random() * 50) + 25;
    this.dispatch(addResearchPoints(researchBonus));
  }

  /**
   * 표류 잔해 이벤트 처리
   */
  private handleDriftingDebrisEvent(state: ShipSystemsState): void {
    console.log("🛸 표류하는 잔해를 발견했습니다!");

    const debrisRewards = {
      "고급 부품": Math.floor(Math.random() * 2) + 1,
      "희귀 금속": Math.floor(Math.random() * 5) + 2,
    };

    this.dispatch(addResources(debrisRewards));
  }

  /**
   * 미지의 신호 이벤트 처리
   */
  private handleUnknownSignalEvent(state: ShipSystemsState): void {
    console.log("📡 미지의 신호를 탐지했습니다!");

    const signalRewards = {
      "통신 데이터": Math.floor(Math.random() * 3) + 2,
      "암호화된 정보": 1,
    };

    this.dispatch(addResources(signalRewards));

    const researchBonus = Math.floor(Math.random() * 30) + 15;
    this.dispatch(addResearchPoints(researchBonus));
  }

  /**
   * 항법 시스템 오작동 이벤트 처리
   */
  private handleNavigationMalfunctionEvent(state: ShipSystemsState): void {
    console.log("⚠️ 항법 시스템에 일시적 오작동이 발생했습니다!");

    // 항법 관련 모듈에 경미한 손상
    const navigationModules = Object.entries(state.installedModules).filter(
      ([_, module]) => module.id.startsWith("CB_") && module.isActive
    );

    if (navigationModules.length > 0) {
      const [moduleId, _] =
        navigationModules[Math.floor(Math.random() * navigationModules.length)];
      const damage = Math.random() * 5 + 2; // 2-7% 손상

      this.dispatch(damageModule({ moduleId, damage }));
      console.log(`${moduleId} 모듈이 경미한 손상을 입었습니다.`);
    }
  }

  /**
   * 과학적 발견 이벤트 처리
   */
  private handleScientificDiscoveryEvent(state: ShipSystemsState): void {
    console.log("🔬 중요한 과학적 발견을 했습니다!");

    const discoveryRewards = {
      "과학 데이터": Math.floor(Math.random() * 3) + 2,
      "특별한 샘플": 1,
    };

    this.dispatch(addResources(discoveryRewards));

    // 대량의 연구 포인트 획득
    const majorResearchBonus = Math.floor(Math.random() * 100) + 50;
    this.dispatch(addResearchPoints(majorResearchBonus));
  }

  /**
   * 항법 시스템 상태 가져오기
   */
  getNavigationStatus(state: ShipSystemsState): NavigationStatus {
    if (!this.isNavigationActive(state)) {
      return {
        isActive: false,
        targetStarId: null,
        targetPosition: null,
        progress: 0,
        estimatedTimeRemaining: 0,
        energyConsumptionRate: 0,
        currentSpeed: 0,
      };
    }

    const performance = calculateShipPerformance(state);
    const effectiveSpeed = this.calculateEffectiveSpeed(
      state,
      performance.navigation.systemSpeed
    );
    const totalDistance = state.navigation!.targetPosition
      ? this.calculateDistance(state.position, state.navigation!.targetPosition)
      : 0;

    // 남은 거리와 예상 시간 계산
    const remainingDistance =
      totalDistance * (1 - state.navigation!.travelProgress / 100);
    const estimatedTimeRemaining =
      effectiveSpeed > 0
        ? remainingDistance / (effectiveSpeed / 3600)
        : Infinity; // seconds

    return {
      isActive: true,
      targetStarId: state.navigation!.targetStarId!,
      targetPosition: state.navigation!.targetPosition!,
      progress: state.navigation!.travelProgress,
      estimatedTimeRemaining: Math.max(0, estimatedTimeRemaining), // 음수 방지
      energyConsumptionRate:
        this.calculateEnergyConsumptionRate(effectiveSpeed),
      currentSpeed: state.navigation!.travelSpeed, // 실제 저장된 현재 속도 사용
    };
  }

  /**
   * 에너지 소모율 계산
   */
  private calculateEnergyConsumptionRate(effectiveSpeed: number): number {
    const baseEnergyConsumption = 5; // 기본 에너지 소모량 (kW)
    const speedMultiplier = Math.max(1, effectiveSpeed / 1.0);
    return (baseEnergyConsumption * speedMultiplier) / 3600; // per second
  }

  /**
   * 이벤트 히스토리 가져오기
   */
  getEventHistory(): NavigationEvent[] {
    return [...this.eventHistory];
  }

  /**
   * 이벤트 히스토리 정리 (오래된 이벤트 제거)
   */
  cleanupEventHistory(maxEvents: number = 50): void {
    if (this.eventHistory.length > maxEvents) {
      this.eventHistory = this.eventHistory.slice(-maxEvents);
    }
  }
}

// === 외부 API ===

/**
 * 항법 시스템 관리자 초기화
 */
export function initializeNavigationSystem(
  dispatch: AppDispatch
): NavigationSystemManager {
  return new NavigationSystemManager(dispatch);
}

/**
 * 항법 효율성 분석
 */
export function analyzeNavigationEfficiency(state: ShipSystemsState): {
  efficiency: number; // 0-100%
  bottlenecks: string[];
  recommendations: string[];
} {
  const performance = calculateShipPerformance(state);
  const bottlenecks: string[] = [];
  const recommendations: string[] = [];

  // 에너지 상태 체크
  const energyRatio = state.energy.currentStored / state.energy.totalStorage;
  if (energyRatio < 0.3) {
    bottlenecks.push("에너지 부족으로 인한 항법 속도 저하");
    recommendations.push(
      "에너지 저장량을 늘리거나 에너지 생산량을 증가시키세요"
    );
  }

  // 항법 모듈 상태 체크
  const navigationModules = Object.values(state.installedModules).filter(
    (module) => module.id.startsWith("CB_") && module.isActive
  );

  const damagedModules = navigationModules.filter(
    (module) => module.currentDurability < 80
  );

  if (damagedModules.length > 0) {
    bottlenecks.push("항법 관련 모듈 손상");
    recommendations.push("손상된 제어 브리지 모듈을 수리하세요");
  }

  if (navigationModules.length === 0) {
    bottlenecks.push("항법 시스템 미설치");
    recommendations.push(
      "제어 브리지 모듈을 설치하여 항법 성능을 향상시키세요"
    );
  }

  // 전체 효율성 계산
  let efficiency = 100;

  if (energyRatio < 0.1) efficiency -= 75;
  else if (energyRatio < 0.2) efficiency -= 50;
  else if (energyRatio < 0.3) efficiency -= 25;

  const avgModuleDurability =
    navigationModules.length > 0
      ? navigationModules.reduce(
          (sum, module) => sum + module.currentDurability,
          0
        ) / navigationModules.length
      : 0;

  efficiency -= (100 - avgModuleDurability) * 0.5;

  if (navigationModules.length === 0) efficiency = Math.min(efficiency, 20);

  return {
    efficiency: Math.max(0, Math.min(100, efficiency)),
    bottlenecks,
    recommendations,
  };
}
