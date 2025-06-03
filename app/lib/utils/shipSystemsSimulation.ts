// 함선 시스템 시뮬레이션 및 자동 업데이트 관리
import { 
  ShipSystemsState, 
  updateEnergyStorage,
  updateScanProgress,
  updateTransmissionProgress,
  repairModule,
  damageModule,
  addResources,
  updateHullIntegrity,
  updateShieldIntegrity,
  recalculateEnergySystems,
  addResearchPoints,
  updateResearchProgress,
  completeResearch,
  updateExtractionProgress,
  completeStellarExtraction
} from '../features/shipSystemsSlice';
import { 
  calculateShipPerformance,
  autoDistributeEnergy 
} from './shipPerformanceUtils';
import { NavigationSystemManager } from './navigationSystem';
import { AppDispatch, store } from '../store';
import { getModuleById } from '@/app/data/shipModules';
import { getResearchById } from '@/app/data/researchTechs';

// === 시뮬레이션 매니저 클래스 ===
export class ShipSystemsSimulation {
  private dispatch: AppDispatch;
  private intervalId: NodeJS.Timeout | null = null;
  private lastUpdateTime: number = Date.now();
  private navigationManager: NavigationSystemManager;
  
  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
    this.navigationManager = new NavigationSystemManager(dispatch);
  }
  
  /**
   * 시뮬레이션 시작
   */
  start(updateInterval: number = 1000): void {
    if (this.intervalId) {
      this.stop();
    }
    
    this.lastUpdateTime = Date.now();
    this.intervalId = setInterval(() => {
      this.update();
    }, updateInterval);
  }
  
  /**
   * 시뮬레이션 중지
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  /**
   * 메인 업데이트 루프 (deprecated - useShipSystemsSimulation 훅에서 대신 사용)
   */
  private update(): void {
    console.warn('직접적인 update() 메서드는 더 이상 사용되지 않습니다. useShipSystemsSimulation 훅을 사용하세요.');
  }
  
  /**
   * 함선 시스템 업데이트 (외부에서 상태를 전달받아 처리)
   */
  updateSystems(state: ShipSystemsState, deltaTime: number): void {
    this.updateEnergySystem(state, deltaTime);
    this.updateScanningSystems(state, deltaTime);
    this.updateCommunicationSystems(state, deltaTime);
    this.updateRepairSystems(state, deltaTime);
    this.updateExtractionSystems(state, deltaTime);
    this.updateShieldSystems(state, deltaTime);
    this.updateUpgradeQueue(state, deltaTime);
    this.updateResearchSystem(state, deltaTime);
    // 새로운 항법 시스템 사용
    this.navigationManager.updateNavigationSystem(state, deltaTime);
  }
  
  /**
   * 항법 시스템 관리자 가져오기
   */
  getNavigationManager(): NavigationSystemManager {
    return this.navigationManager;
  }
  
  /**
   * 에너지 시스템 업데이트
   */
  private updateEnergySystem(state: ShipSystemsState, deltaTime: number): void {
    const performance = calculateShipPerformance(state);
    const energyBalance = performance.power.energyBalance;
    
    // 에너지 저장량 업데이트
    let newStoredEnergy = state.energy.currentStored;
    
    if (energyBalance > 0) {
      // 잉여 에너지가 있으면 축전
      const maxChargeRate = this.calculateChargeRate(state);
      const chargeAmount = Math.min(energyBalance * deltaTime, maxChargeRate * deltaTime);
      newStoredEnergy = Math.min(state.energy.totalStorage, newStoredEnergy + chargeAmount);
    } else if (energyBalance < 0) {
      // 에너지가 부족하면 저장된 에너지 사용
      const deficitAmount = Math.abs(energyBalance) * deltaTime;
      newStoredEnergy = Math.max(0, newStoredEnergy - deficitAmount);
      
      // 에너지가 부족하면 자동 분배 시스템 작동
      if (newStoredEnergy < state.energy.totalStorage * 0.1) {
        this.triggerEnergyEmergency(state);
      }
    }
    
    this.dispatch(updateEnergyStorage(newStoredEnergy));
    this.dispatch(recalculateEnergySystems());
  }
  
  /**
   * 스캐닝 시스템 업데이트
   */
  private updateScanningSystems(state: ShipSystemsState, deltaTime: number): void {
    const performance = calculateShipPerformance(state);
    const scanSpeed = performance.exploration.analysisSpeed;
    
    Object.entries(state.activeScans).forEach(([scanId, scan]) => {
      const progressIncrement = (scanSpeed / 3600) * deltaTime; // 시간당 속도를 초당으로 변환
      const newProgress = Math.min(100, scan.progress + progressIncrement);
      
      this.dispatch(updateScanProgress({ scanId, progress: newProgress }));
      
      // 스캔 완료 시 보상 지급
      if (newProgress >= 100) {
        this.completeScan(scanId, scan.targetId);
      }
    });
  }
  
  /**
   * 통신 시스템 업데이트
   */
  private updateCommunicationSystems(state: ShipSystemsState, deltaTime: number): void {
    const performance = calculateShipPerformance(state);
    const transmissionSpeed = performance.communication.transmissionSpeed;
    
    Object.entries(state.communicationStatus.transmissionQueue).forEach(([transmissionId, transmission]) => {
      // 우선순위에 따른 전송 속도 조정
      const priorityMultiplier = transmission.priority / 10;
      const effectiveSpeed = transmissionSpeed * priorityMultiplier;
      
      // 진행도 계산 (데이터 크기에 비례)
      const progressIncrement = (effectiveSpeed / transmission.dataSize) * deltaTime * 100;
      const newProgress = Math.min(100, transmission.progress + progressIncrement);
      
      this.dispatch(updateTransmissionProgress({ transmissionId, progress: newProgress }));
      
      // 전송 완료 시 RP 보상
      if (newProgress >= 100) {
        this.completeTransmission(transmissionId, transmission);
      }
    });
  }
  
  /**
   * 수리 시스템 업데이트
   */
  private updateRepairSystems(state: ShipSystemsState, deltaTime: number): void {
    if (!state.automationSettings.autoRepair) return;
    
    const performance = calculateShipPerformance(state);
    const repairRate = performance.defense.autoRepairRate;
    
    if (repairRate > 0) {
      // 손상된 모듈 찾기
      const damagedModules = Object.entries(state.installedModules)
        .filter(([_, module]) => module.currentDurability < 100)
        .sort(([_, a], [__, b]) => a.currentDurability - b.currentDurability); // 가장 손상된 것부터
      
      if (damagedModules.length > 0) {
        const [moduleId, _] = damagedModules[0];
        const repairAmount = repairRate * deltaTime;
        
        this.dispatch(repairModule({ moduleId, repairAmount }));
      }
    }
  }
  
  /**
   * 자원 채취 시스템 업데이트
   */
  private updateExtractionSystems(state: ShipSystemsState, deltaTime: number): void {
    const performance = calculateShipPerformance(state);
    const extractionRate = performance.resource.maxExtractionRate;

    Object.entries(state.stellarExtraction.activeExtractions).forEach(([starId, extraction]) => {
      if (extraction.progress < 100) {
        // 기본 진행 속도: 시간 기반으로 계산
        // 기본 채취 시간을 60초로 가정하고, extractionRate가 0이면 기본값 사용
        const baseProgressRate = 100 / 60; // 60초에 100% 완료
        const rateBonus = extractionRate > 0 ? (1 + extractionRate / 10) : 1; // extractionRate를 보너스로 적용
        
        const progressIncrement = baseProgressRate * rateBonus * deltaTime;
        const newProgress = Math.min(100, extraction.progress + progressIncrement);

        this.dispatch(updateExtractionProgress({ starId, progress: newProgress }));

        if (newProgress >= 100) {
          console.log(`✅ 채취 완료: ${starId}`);
          this.dispatch(completeStellarExtraction({ starId }));
        }
      }
    });
  }
  
  /**
   * 방어막 시스템 업데이트
   */
  private updateShieldSystems(state: ShipSystemsState, deltaTime: number): void {
    const performance = calculateShipPerformance(state);
    const rechargeRate = performance.defense.shieldRechargeRate;
    
    if (rechargeRate > 0 && state.overallShieldIntegrity < 100) {
      const rechargeAmount = (rechargeRate / performance.defense.totalShieldCapacity) * 100 * deltaTime;
      const newShieldIntegrity = Math.min(100, state.overallShieldIntegrity + rechargeAmount);
      
      this.dispatch(updateShieldIntegrity(newShieldIntegrity));
    }
  }
  
  /**
   * 업그레이드 큐 업데이트
   */
  private updateUpgradeQueue(state: ShipSystemsState, deltaTime: number): void {
    Object.entries(state.upgradeQueue).forEach(([queueId, upgrade]) => {
      // 업그레이드 진행도 계산 (임의의 속도로 진행)
      const progressIncrement = (1 / 600) * deltaTime * 100; // 10분에 100% 완료
      const newProgress = Math.min(100, upgrade.progress + progressIncrement);
      
      if (newProgress >= 100) {
        this.completeUpgrade(queueId, upgrade);
      }
    });
  }
  
  /**
   * 연구 시스템 업데이트
   */
  private updateResearchSystem(state: ShipSystemsState, deltaTime: number): void {
    // 연구 포인트 자동 생성 (연구 모듈 기반)
    this.generateResearchPoints(state, deltaTime);
    
    // 진행 중인 연구 업데이트
    this.updateActiveResearch(state, deltaTime);
    
    // 연구 완료 확인 및 처리
    this.checkResearchCompletion(state);
  }
  
  

  /**
   * 연구 포인트 생성
   */
  private generateResearchPoints(state: ShipSystemsState, deltaTime: number): void {
    const performance = calculateShipPerformance(state);
    
    // 기본 연구 포인트 생성량 계산
    let baseResearchRate = 0;
    
    // 분석 시스템 기반 연구 포인트 생성
    Object.values(state.installedModules).forEach(module => {
      if (!module.isActive) return;
      
      const moduleInfo = getModuleById(module.id);
      if (!moduleInfo) return;
      
      // 모듈 타입에 따른 연구 포인트 생성
      if (module.id.startsWith('SE_')) {
        // 스캐닝 엔진 - 탐사를 통한 연구 포인트
        const damageMultiplier = module.currentDurability / moduleInfo.durability;
        const allocationMultiplier = module.energyAllocation / 100;
        baseResearchRate += 0.5 * damageMultiplier * allocationMultiplier;
      } else if (module.id.startsWith('CB_')) {
        // 제어 브리지 - 컴퓨팅 파워를 통한 연구 포인트
        const damageMultiplier = module.currentDurability / moduleInfo.durability;
        const allocationMultiplier = module.energyAllocation / 100;
        baseResearchRate += 0.3 * damageMultiplier * allocationMultiplier;
      } else if (module.id.startsWith('LAB_')) {
        // 연구실 모듈 (향후 추가될 수 있음)
        const damageMultiplier = module.currentDurability / moduleInfo.durability;
        const allocationMultiplier = module.energyAllocation / 100;
        baseResearchRate += 2.0 * damageMultiplier * allocationMultiplier;
      }
    });
    
    // 활성 스캔이 있을 때 보너스 연구 포인트
    const activeScanBonus = Object.keys(state.activeScans).length * 0.2;
    
    // 통신 상태에 따른 보너스 (본부와의 데이터 공유)
    const communicationBonus = state.communicationStatus.homeBaseConnection ? 
      (state.communicationStatus.signalStrength / 100) * 0.3 : 0;
    
    const totalResearchRate = baseResearchRate + activeScanBonus + communicationBonus;
    const researchPointsGenerated = totalResearchRate * deltaTime;
    
    if (researchPointsGenerated > 0) {
      this.dispatch(addResearchPoints(researchPointsGenerated));
    }
  }
  
  /**
   * 활성 연구 진행도 업데이트
   */
  private updateActiveResearch(state: ShipSystemsState, deltaTime: number): void {
    if (!state.currentResearch) return;
    
    const tech = getResearchById(state.currentResearch.techId);
    if (!tech) return;
    
    // 연구 속도 계산 (기본값 + 모듈 보너스)
    let researchSpeed = 1.0; // 기본 연구 속도
    
    // 제어 브리지의 컴퓨팅 파워에 따른 연구 속도 보너스
    Object.values(state.installedModules).forEach(module => {
      if (!module.isActive) return;
      
             if (module.id.startsWith('CB_')) {
         const moduleInfo = getModuleById(module.id);
         if (moduleInfo) {
           const damageMultiplier = module.currentDurability / moduleInfo.durability;
           const allocationMultiplier = module.energyAllocation / 100;
           researchSpeed += 0.5 * damageMultiplier * allocationMultiplier;
         }
       } else if (module.id.startsWith('LAB_')) {
         // 연구실 모듈의 전용 연구 속도 보너스
         const moduleInfo = getModuleById(module.id);
         if (moduleInfo) {
           const damageMultiplier = module.currentDurability / moduleInfo.durability;
           const allocationMultiplier = module.energyAllocation / 100;
           researchSpeed += 1.5 * damageMultiplier * allocationMultiplier;
         }
       }
    });
    
    // 에너지 부족 시 연구 속도 페널티
    const performance = calculateShipPerformance(state);
    if (performance.power.energyBalance < 0) {
      researchSpeed *= 0.5; // 에너지 부족 시 50% 속도
    }
    
    // 진행도 계산 (시간 기반)
    const progressIncrement = (researchSpeed / tech.cost.timeRequired) * deltaTime * 100;
    const newProgress = Math.min(100, state.currentResearch.currentPoints + progressIncrement);
    
    this.dispatch(updateResearchProgress(newProgress));
  }
  
  /**
   * 연구 완료 확인 및 처리
   */
  private checkResearchCompletion(state: ShipSystemsState): void {
    if (!state.currentResearch) return;
    
    if (state.currentResearch.currentPoints >= state.currentResearch.totalPoints) {
      const techId = state.currentResearch.techId;
      const tech = getResearchById(techId);
      
      if (tech) {
        console.log(`🧪 연구 완료: ${tech.nameKo}`);
        
        // 연구 완료 처리
        this.dispatch(completeResearch(techId));
        
        // 완료 보상 지급
        this.grantResearchRewards(tech);
      }
    }
  }
  
  /**
   * 연구 완료 보상 지급
   */
  private grantResearchRewards(tech: any): void {
    if (tech.rewards) {
      // 연구 포인트 보상
      if (tech.rewards.researchPoints) {
        this.dispatch(addResearchPoints(tech.rewards.researchPoints));
      }
      
      // 자원 보상
      if (tech.rewards.resources) {
        this.dispatch(addResources(tech.rewards.resources));
      }
      
      // 기타 보상 처리 (모듈 해금, 능력 향상 등)
      console.log(`연구 보상 지급: ${JSON.stringify(tech.rewards)}`);
    }
  }
  


  /**
   * 헬퍼 메서드들
   */
  private calculateChargeRate(state: ShipSystemsState): number {
    // 축전기 모듈들의 충전 속도 계산
    return Object.values(state.installedModules)
      .filter(module => module.id.startsWith('CB_01') && module.isActive)
      .reduce((total, module) => {
        // 모듈 정보에서 충전 속도 가져오기
        return total + 10; // 임시 값
      }, 0);
  }
  
  private triggerEnergyEmergency(state: ShipSystemsState): void {
    // 비상 에너지 분배 실행
    const distribution = autoDistributeEnergy(state);
    Object.entries(distribution).forEach(([moduleId, allocation]) => {
      // dispatch는 여기서 직접 사용하지 않고 상위 컴포넌트에서 처리하도록 이벤트 발생
      console.log(`에너지 비상 분배: ${moduleId} -> ${allocation}%`);
    });
  }
  
  private isNearResource(state: ShipSystemsState): boolean {
    // 현재 위치에서 자원 채취 가능한지 확인
    // 실제 구현에서는 별계 데이터와 연동
    return false; // 임시
  }
  
  private getCurrentResourceType(state: ShipSystemsState): string | null {
    // 현재 채취 중인 자원 타입 반환
    return '티타늄'; // 임시
  }
  
  private completeScan(scanId: string, targetId: string): void {
    console.log(`스캔 완료: ${scanId} -> ${targetId}`);
    // 스캔 완료 보상 처리
    // 발견된 정보에 따라 지식 포인트 지급
  }
  
  private completeTransmission(transmissionId: string, transmission: any): void {
    console.log(`전송 완료: ${transmissionId}`);
    // 전송 완료 시 RP 보상 또는 기타 처리
  }
  
  private completeUpgrade(queueId: string, upgrade: any): void {
    console.log(`업그레이드 완료: ${upgrade.moduleId} -> ${upgrade.targetModuleId}`);
    // 실제 모듈 교체 처리
    // this.dispatch(uninstallModule(upgrade.moduleId));
    // this.dispatch(installModule({ moduleId: upgrade.targetModuleId }));
  }
}

// === 함선 시스템 이벤트 처리 ===

/**
 * 랜덤 이벤트 생성기
 */
export class ShipSystemsEventManager {
  private dispatch: AppDispatch;
  private lastEventTime: number = Date.now();
  
  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }
  
  /**
   * 랜덤 이벤트 체크 및 발생
   */
  checkRandomEvents(state: ShipSystemsState): void {
    const currentTime = Date.now();
    const timeSinceLastEvent = currentTime - this.lastEventTime;
    
    // 1시간에 한 번 정도 이벤트 발생 확률
    if (timeSinceLastEvent > 3600000 && Math.random() < 0.1) {
      this.triggerRandomEvent(state);
      this.lastEventTime = currentTime;
    }
  }
  
  /**
   * 랜덤 이벤트 발생
   */
  private triggerRandomEvent(state: ShipSystemsState): void {
    const events = [
      () => this.meteoriteHit(state),
      () => this.energyFluctuation(state),
      () => this.systemMalfunction(state),
      () => this.unexpectedDiscovery(state),
      () => this.researchBreakthrough(state),
      () => this.dataCorruption(state),
      () => this.scientificDiscovery(state)
    ];
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    randomEvent();
  }
  
  /**
   * 운석 충돌 이벤트
   */
  private meteoriteHit(state: ShipSystemsState): void {
    console.log('🌠 운석 충돌 발생!');
    
    const damage = Math.random() * 20 + 10; // 10-30 데미지
    const randomModules = Object.keys(state.installedModules)
      .filter(id => state.installedModules[id].isActive)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 1); // 1-3개 모듈
    
    randomModules.forEach(moduleId => {
      this.dispatch(damageModule({ moduleId, damage: damage * Math.random() }));
    });
    
    // 함체 손상
    this.dispatch(updateHullIntegrity(Math.max(0, state.overallHullIntegrity - damage)));
  }
  
  /**
   * 에너지 변동 이벤트
   */
  private energyFluctuation(state: ShipSystemsState): void {
    console.log('⚡ 에너지 변동 발생!');
    
    const fluctuation = (Math.random() - 0.5) * 100; // -50 ~ +50
    const newEnergy = Math.max(0, Math.min(state.energy.totalStorage, state.energy.currentStored + fluctuation));
    
    this.dispatch(updateEnergyStorage(newEnergy));
  }
  
  /**
   * 시스템 오작동 이벤트
   */
  private systemMalfunction(state: ShipSystemsState): void {
    console.log('⚠️ 시스템 오작동 발생!');
    
    const activeModules = Object.keys(state.installedModules)
      .filter(id => state.installedModules[id].isActive);
    
    if (activeModules.length > 0) {
      const randomModule = activeModules[Math.floor(Math.random() * activeModules.length)];
      this.dispatch(damageModule({ moduleId: randomModule, damage: Math.random() * 15 + 5 }));
    }
  }
  
  /**
   * 예상치 못한 발견 이벤트
   */
  private unexpectedDiscovery(state: ShipSystemsState): void {
    console.log('🎉 예상치 못한 발견!');
    
    const bonusResources = ['희귀 금속', '에너지 크리스탈', '고급 부품'];
    const randomResource = bonusResources[Math.floor(Math.random() * bonusResources.length)];
    const amount = Math.floor(Math.random() * 10) + 5;
    
    this.dispatch(addResources({ [randomResource]: amount }));
  }
  
  /**
   * 연구 돌파구 이벤트
   */
  private researchBreakthrough(state: ShipSystemsState): void {
    console.log('💡 연구 돌파구 발견!');
    
    // 진행 중인 연구가 있으면 진행도 증가
    if (state.currentResearch) {
      const bonusProgress = Math.random() * 20 + 10; // 10-30% 진행도 증가
      this.dispatch(updateResearchProgress(state.currentResearch.currentPoints + bonusProgress));
    }
    
    // 연구 포인트 보너스 지급
    const bonusRP = Math.floor(Math.random() * 50) + 25;
    this.dispatch(addResearchPoints(bonusRP));
  }
  
  /**
   * 데이터 손상 이벤트
   */
  private dataCorruption(state: ShipSystemsState): void {
    console.log('💾 데이터 손상 발생!');
    
    // 진행 중인 연구의 진행도 일부 손실
    if (state.currentResearch) {
      const lossAmount = Math.random() * 15 + 5; // 5-20% 손실
      const newProgress = Math.max(0, state.currentResearch.currentPoints - lossAmount);
      this.dispatch(updateResearchProgress(newProgress));
    }
    
    // 연구 포인트 일부 손실
    const rpLoss = Math.floor(Math.random() * 30) + 10;
    this.dispatch(addResearchPoints(-rpLoss));
  }
  
  /**
   * 과학적 발견 이벤트
   */
  private scientificDiscovery(state: ShipSystemsState): void {
    console.log('🔬 중요한 과학적 발견!');
    
    // 대량의 연구 포인트 획득
    const majorBonus = Math.floor(Math.random() * 100) + 50;
    this.dispatch(addResearchPoints(majorBonus));
    
    // 특별한 연구 자료 획득
    this.dispatch(addResources({ 
      '연구 데이터': Math.floor(Math.random() * 5) + 3,
      '과학 샘플': Math.floor(Math.random() * 3) + 1
    }));
  }
}

// === 자동화 시스템 ===

/**
 * 자동화된 함선 관리 시스템
 */
export class AutomationManager {
  private dispatch: AppDispatch;
  
  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }
  
  /**
   * 자동 에너지 관리
   */
  autoManageEnergy(state: ShipSystemsState): void {
    if (state.automationSettings.energyManagementMode === 'manual') return;
    
    const distribution = autoDistributeEnergy(state);
    
    // 실제로는 각 모듈의 에너지 할당을 업데이트
    // Object.entries(distribution).forEach(([moduleId, allocation]) => {
    //   this.dispatch(updateModuleEnergyAllocation({ moduleId, allocation }));
    // });
  }
  
  /**
   * 자동 스캔 관리
   */
  autoManageScanning(state: ShipSystemsState): void {
    if (state.automationSettings.scanningMode === 'passive') return;
    
    // 활성 스캔이 없고 탐사 모드가 활성화되어 있으면 자동으로 새 스캔 시작
    const hasActiveScans = Object.keys(state.activeScans).length > 0;
    
    if (!hasActiveScans && state.automationSettings.scanningMode === 'active') {
      // 새로운 스캔 대상 찾기 및 시작
      console.log('자동 스캔 시작');
    }
  }
  
  /**
   * 자동 연구 관리
   */
  autoManageResearch(state: ShipSystemsState): void {
    // 연구가 진행 중이지 않고 연구 포인트가 충분할 때 자동으로 새 연구 시작
    if (!state.currentResearch && state.researchPoints >= 50) {
      this.suggestNextResearch(state);
    }
    
    // 연구 효율 최적화 제안
    if (state.currentResearch) {
      this.optimizeResearchEfficiency(state);
    }
  }
  
  /**
   * 다음 연구 제안
   */
  private suggestNextResearch(state: ShipSystemsState): string[] {
    const suggestions: string[] = [];
    
    // 완료되지 않은 기초 연구 우선 제안
    const basicResearchIds = ['BASIC_POWER', 'BASIC_SCAN', 'BASIC_COMM'];
    
    basicResearchIds.forEach(techId => {
      if (!state.completedResearch.includes(techId)) {
        const tech = getResearchById(techId);
        if (tech) {
          suggestions.push(`기초 연구 "${tech.nameKo}"를 시작하는 것을 권장합니다.`);
        }
      }
    });
    
    return suggestions;
  }
  
  /**
   * 연구 효율 최적화
   */
  private optimizeResearchEfficiency(state: ShipSystemsState): void {
    if (!state.currentResearch) return;
    
    // 연구 속도를 위해 제어 브리지 에너지 할당 최적화
    Object.entries(state.installedModules).forEach(([moduleId, module]) => {
      if (module.id.startsWith('CB_') && module.isActive) {
        // 연구 중일 때는 제어 브리지에 더 많은 에너지 할당
        if (module.energyAllocation < 90) {
          console.log(`연구 효율을 위해 ${moduleId} 에너지 할당량을 증가시키는 것을 권장합니다.`);
        }
      }
    });
  }
  
  /**
   * 자동 업그레이드 제안
   */
  suggestUpgrades(state: ShipSystemsState): string[] {
    const suggestions: string[] = [];
    
    // 에너지 부족 시 동력 시스템 업그레이드 제안
    const performance = calculateShipPerformance(state);
    if (performance.power.energyBalance < 0) {
      suggestions.push('에너지 생산량이 부족합니다. 핵융합로 업그레이드를 고려해보세요.');
    }
    
    // 저장 공간 부족 시 화물칸 업그레이드 제안
    if (state.resources.currentCapacity / state.resources.maxCapacity > 0.9) {
      suggestions.push('화물칸이 거의 가득 찼습니다. 저장 용량을 늘려보세요.');
    }
    
    // 스캔 범위가 제한적일 때 탐사 장비 업그레이드 제안
    if (performance.exploration.maxScanRange < 2) {
      suggestions.push('스캔 범위가 제한적입니다. 장거리 스캐너 업그레이드를 권장합니다.');
    }
    
    // 연구 관련 제안 추가
    const researchSuggestions = this.suggestResearchUpgrades(state);
    suggestions.push(...researchSuggestions);
    
    return suggestions;
  }
  
  /**
   * 연구 관련 업그레이드 제안
   */
  private suggestResearchUpgrades(state: ShipSystemsState): string[] {
    const suggestions: string[] = [];
    
    // 연구 포인트 생성이 낮을 때
    const hasResearchModules = Object.values(state.installedModules).some(module => 
      module.id.startsWith('LAB_') && module.isActive
    );
    
    if (!hasResearchModules && state.researchPoints < 100) {
      suggestions.push('연구실 모듈 설치를 고려해보세요. 연구 효율이 크게 향상됩니다.');
    }
    
    // 제어 브리지 성능이 낮을 때
    const controlBridges = Object.values(state.installedModules).filter(module => 
      module.id.startsWith('CB_') && module.isActive
    );
    
    const lowPerformanceBridges = controlBridges.filter(module => {
      const moduleInfo = getModuleById(module.id);
      return moduleInfo && (module.currentDurability / moduleInfo.durability) < 0.6;
    });
    
    if (lowPerformanceBridges.length > 0) {
      suggestions.push('제어 브리지의 성능이 저하되었습니다. 수리 또는 업그레이드가 필요합니다.');
    }
    
    return suggestions;
  }
}

// === 외부 API ===

/**
 * 함선 시스템 시뮬레이션 초기화
 */
export function initializeShipSystemsSimulation(dispatch: AppDispatch) {
  const simulation = new ShipSystemsSimulation(dispatch);
  const eventManager = new ShipSystemsEventManager(dispatch);
  const automationManager = new AutomationManager(dispatch);
  const navigationManager = simulation.getNavigationManager();
  
  return {
    simulation,
    eventManager,
    automationManager,
    navigationManager
  };
}

/**
 * 함선 상태 종합 진단
 */
export function diagnoseShipSystems(state: ShipSystemsState): {
  overallStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  criticalIssues: string[];
  recommendations: string[];
  efficiency: number; // 0-100
} {
  const performance = calculateShipPerformance(state);
  const criticalIssues: string[] = [];
  const recommendations: string[] = [];
  
  // 치명적 문제 확인
  if (performance.power.energyBalance < -50) {
    criticalIssues.push('심각한 에너지 부족 상태입니다.');
  }
  
  if (state.overallHullIntegrity < 30) {
    criticalIssues.push('함체 무결성이 위험 수준입니다.');
  }
  
  const damagedModules = Object.values(state.installedModules)
    .filter(module => module.currentDurability < 50).length;
  
  if (damagedModules > 3) {
    criticalIssues.push('다수의 모듈이 심각하게 손상되었습니다.');
  }
  
  // 전체 효율성 계산
  const moduleEfficiencies = Object.values(state.installedModules).map(module => {
    const moduleInfo = getModuleById(module.id);
    if (!moduleInfo) return 0;
    return (module.currentDurability / moduleInfo.durability) * (module.energyAllocation / 100);
  });
  
  const efficiency = moduleEfficiencies.reduce((sum, eff) => sum + eff, 0) / moduleEfficiencies.length * 100;
  
  // 연구 시스템 상태 확인
  if (state.currentResearch) {
    const researchProgress = (state.currentResearch.currentPoints / state.currentResearch.totalPoints) * 100;
    if (researchProgress < 10 && Date.now() - state.currentResearch.startTime > 3600000) {
      recommendations.push('연구 진행이 매우 느립니다. 연구 시설을 점검하거나 에너지 할당을 조정하세요.');
    }
  } else if (state.researchPoints > 200) {
    recommendations.push('연구 포인트가 충분합니다. 새로운 연구를 시작하는 것을 고려해보세요.');
  }
  
  // 연구 효율성 평가
  const researchModuleCount = Object.values(state.installedModules).filter(module => 
    (module.id.startsWith('CB_') || module.id.startsWith('LAB_')) && module.isActive
  ).length;
  
  if (researchModuleCount === 0) {
    recommendations.push('연구 시설이 없습니다. 연구 발전을 위해 연구실이나 고성능 제어 브리지 설치를 권장합니다.');
  }
  
  // 전체 상태 평가
  let overallStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  if (criticalIssues.length > 0) overallStatus = 'critical';
  else if (efficiency >= 90) overallStatus = 'excellent';
  else if (efficiency >= 75) overallStatus = 'good';
  else if (efficiency >= 50) overallStatus = 'fair';
  else overallStatus = 'poor';
  
  return {
    overallStatus,
    criticalIssues,
    recommendations,
    efficiency
  };
}
