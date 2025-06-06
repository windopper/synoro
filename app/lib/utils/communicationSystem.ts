import { updateTransmissionProgress } from "@/app/lib/features/shipSystemsSlice";
import { completeTransmission } from "@/app/lib/features/actions/shipCommunicationAction";
import { ShipSystemsState } from "../features/shipSystemsSlice";
import { AppDispatch } from "../store";
import { calculateShipPerformance } from "./shipPerformanceUtils";

class CommunicationSystemManager {
  private dispatch: AppDispatch;

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  updateCommunicationSystems(state: ShipSystemsState, deltaTime: number): void {
    const performance = calculateShipPerformance(state);
    let transmissionSpeed = performance.communication.transmissionSpeed;
    
    // 기본 전송 속도 보장 (통신 모듈이 없거나 비활성화되어도 최소한의 전송 가능)
    if (transmissionSpeed <= 0) {
      transmissionSpeed = 0.1; // 최소 전송 속도
    }
    
    // 신호 강도에 따른 전송 속도 조정
    const signalMultiplier = Math.max(0.1, state.communicationStatus.signalStrength / 100);
    transmissionSpeed *= signalMultiplier;
    
    // 연결 상태 확인
    if (!state.communicationStatus.homeBaseConnection) {
      transmissionSpeed *= 0.1; // 연결이 끊어진 경우 10%로 감소
    }
    
    Object.entries(state.communicationStatus.transmissionQueue).forEach(([transmissionId, transmission]) => {
      // 전송이 이미 완료된 경우 스킵
      if (transmission.progress >= 100) {
        return;
      }
      
      // 우선순위에 따른 전송 속도 조정 (1-10 범위를 0.1-1.0으로 정규화)
      const priorityMultiplier = Math.max(0.1, transmission.priority / 10);
      const effectiveSpeed = transmissionSpeed * priorityMultiplier;
      
      // 진행도 계산 개선
      // deltaTime이 초 단위라고 가정하고, 데이터 크기당 전송 시간 계산
      const transmissionRate = effectiveSpeed * 10; // KB/s 단위로 조정
      const progressPerSecond = (transmissionRate / Math.max(1, transmission.dataSize)) * 100;
      const progressIncrement = progressPerSecond * deltaTime;
      
      const newProgress = Math.min(100, transmission.progress + progressIncrement);
      
      // 진행도가 실제로 변했을 때만 dispatch
      if (Math.abs(newProgress - transmission.progress) > 0.01) {
        console.log(`전송 진행도 업데이트: ${transmissionId} - ${transmission.progress.toFixed(1)}% -> ${newProgress.toFixed(1)}%`);
        this.dispatch(updateTransmissionProgress({ transmissionId, progress: newProgress }));
        
        // 전송 완료 시 RP 보상
        if (newProgress >= 100 && transmission.progress < 100) {
          console.log(`전송 완료 처리: ${transmissionId}`);
          this._completeTransmission(transmissionId, transmission);
        }
      }
    });
  }

  private _completeTransmission(transmissionId: string, transmission: any): void {
    console.log(`전송 완료: ${transmissionId}`);
    // 전송 완료 시 RP 보상 또는 기타 처리
    this.dispatch(completeTransmission(transmissionId));
  }
}

export function estimateTransmissionTime(
  dataSize: number, 
  transmissionSpeed: number, 
  priority: number = 5, 
  signalStrength: number = 100, 
  homeBaseConnection: boolean = true
): number {
  // 기본 전송 속도를 기준으로 예상 시간 계산 (초 단위)
  
  // 최소 전송 속도 보장
  let effectiveSpeed = transmissionSpeed <= 0 ? 0.1 : transmissionSpeed;
  
  // 신호 강도에 따른 전송 속도 조정
  const signalMultiplier = Math.max(0.1, signalStrength / 100);
  effectiveSpeed *= signalMultiplier;
  
  // 연결 상태 확인
  if (!homeBaseConnection) {
    effectiveSpeed *= 0.1; // 연결이 끊어진 경우 10%로 감소
  }
  
  // 우선순위에 따른 전송 속도 조정 (1-10 범위를 0.1-1.0으로 정규화)
  const priorityMultiplier = Math.max(0.1, priority / 10);
  effectiveSpeed *= priorityMultiplier;
  
  // 전송률을 KB/s 단위로 조정
  const transmissionRate = effectiveSpeed * 10;
  
  // 예상 시간 계산 (초)
  const estimatedTime = Math.max(1, dataSize / Math.max(0.1, transmissionRate));
  
  return Math.ceil(estimatedTime);
}

export default CommunicationSystemManager;  