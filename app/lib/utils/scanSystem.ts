import { AppDispatch } from "../store";
import {
  handleShipScanCompleteAction,
  ShipSystemsState,
  updateScanProgress,
} from "../features/shipSystemsSlice";
import { calculateShipPerformance } from "./shipPerformanceUtils";

export default class ScanSystemManager {
  private dispatch: AppDispatch;

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  updateScanningSystems(state: ShipSystemsState, deltaTime: number): void {
    const performance = calculateShipPerformance(state);
    const scanSpeed = performance.exploration.analysisSpeed;

    Object.entries(state.activeScans).forEach(([scanId, scan]) => {
        const progressIncrement = 20;
    //   const progressIncrement = (scanSpeed / 3600) * deltaTime; // 시간당 속도를 초당으로 변환
      const newProgress = Math.min(100, scan.progress + progressIncrement);

      this.dispatch(updateScanProgress({ scanId, progress: newProgress }));

      // 스캔 완료 시 보상 지급
      if (newProgress >= 100) {
        this.completeScan(scanId);
      }
    });
  }

  private completeScan(scanId: string): void {
    this.dispatch(handleShipScanCompleteAction(scanId));
  }
}
