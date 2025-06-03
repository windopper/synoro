"use client"

import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/lib/hooks';
import { 
  ShipSystemsSimulation, 
  ShipSystemsEventManager, 
  AutomationManager,
  initializeShipSystemsSimulation,
  diagnoseShipSystems
} from '@/app/lib/utils/shipSystemsSimulation';

/**
 * 함선 시스템 시뮬레이션을 관리하는 React Hook
 */
export function useShipSystemsSimulation(config: {
  enabled: boolean;
  updateInterval?: number;
  enableRandomEvents?: boolean;
  enableAutomation?: boolean;
}) {
  const dispatch = useAppDispatch();
  const shipState = useAppSelector((state) => state.shipSystems);
  
  const simulationRef = useRef<ShipSystemsSimulation | null>(null);
  const eventManagerRef = useRef<ShipSystemsEventManager | null>(null);
  const automationManagerRef = useRef<AutomationManager | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // 시뮬레이션 매니저들 초기화
  useEffect(() => {
    if (!simulationRef.current) {
      const managers = initializeShipSystemsSimulation(dispatch);
      simulationRef.current = managers.simulation;
      eventManagerRef.current = managers.eventManager;
      automationManagerRef.current = managers.automationManager;
    }
  }, [dispatch]);
  
  // 메인 업데이트 루프
  const updateSimulation = useCallback(() => {
    if (!simulationRef.current) return;
    
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000;
    lastUpdateTimeRef.current = currentTime;
    
    // 시스템 업데이트
    simulationRef.current.updateSystems(shipState, deltaTime);
    
    // 랜덤 이벤트 체크
    // if (config.enableRandomEvents && eventManagerRef.current) {
    //   eventManagerRef.current.checkRandomEvents();
    // }
    
    // // 자동화 시스템 실행
    // if (config.enableAutomation && automationManagerRef.current) {
    //   automationManagerRef.current.autoManageEnergy();
    //   automationManagerRef.current.autoManageScanning();
    // }
    
  }, [shipState, config.enableRandomEvents, config.enableAutomation]);

  // 시뮬레이션 시작/중지
  useEffect(() => {
    if (config.enabled) {
      lastUpdateTimeRef.current = Date.now();
      intervalRef.current = setInterval(updateSimulation, config.updateInterval || 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [config.enabled, config.updateInterval, updateSimulation]);
  
  // 수동 업데이트 트리거
  const triggerUpdate = useCallback(() => {
    updateSimulation();
  }, [updateSimulation]);
  
  // 함선 진단
  const getDiagnostics = useCallback(() => {
    if (!shipState) return null;
    return diagnoseShipSystems(shipState);
  }, []);
  
  // 업그레이드 제안 가져오기
  const getUpgradeSuggestions = useCallback(() => {
    if (!automationManagerRef.current || !shipState) return [];
    return automationManagerRef.current.suggestUpgrades(shipState);
  }, []);
  
  // 시뮬레이션 상태
  const isRunning = intervalRef.current !== null;
  
  return {
    isRunning,
    triggerUpdate,
    getDiagnostics,
    getUpgradeSuggestions,
    // shipState,
    simulation: simulationRef.current,
    eventManager: eventManagerRef.current,
    automationManager: automationManagerRef.current
  };
} 