"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { runSystemDiagnostics } from "../../lib/features/shipSystemsSlice";
import { diagnoseShipSystems } from "../../lib/utils/shipSystemsSimulation";
import { calculateShipPerformance } from "../../lib/utils/shipPerformanceUtils";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Gauge,
  RefreshCw,
  Shield,
  Zap,
  TrendingUp,
  AlertCircle,
  Info,
} from "lucide-react";

export default function SystemDiagnosticsPanel() {
  const dispatch = useAppDispatch();
  const shipSystems = useAppSelector((state) => state.shipSystems);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  // 실시간 진단 데이터 계산
  const currentDiagnostics = diagnoseShipSystems(shipSystems);
  const performanceMetrics = calculateShipPerformance(shipSystems);

  // 자동 진단 실행
  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    try {
      await dispatch(runSystemDiagnostics()).unwrap();
      setLastUpdateTime(Date.now());
    } catch (error) {
      console.error("진단 실행 실패:", error);
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  // 자동 업데이트 (30초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdateTime(Date.now());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // 상태별 색상 반환
  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-400";
      case "good":
        return "text-blue-400";
      case "fair":
        return "text-yellow-400";
      case "poor":
        return "text-orange-400";
      case "critical":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "good":
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case "fair":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case "poor":
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "excellent":
        return "최적";
      case "good":
        return "양호";
      case "fair":
        return "보통";
      case "poor":
        return "불량";
      case "critical":
        return "위험";
      default:
        return "알 수 없음";
    }
  };

  // 효율성 바 색상
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "bg-green-400";
    if (efficiency >= 75) return "bg-blue-400";
    if (efficiency >= 50) return "bg-yellow-400";
    if (efficiency >= 25) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <div className="h-full flex flex-col space-y-4 p-4 bg-black/95 text-gray-300 font-mono overflow-y-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-gray-200">시스템 진단</h2>
        </div>
        <button
          onClick={runDiagnostics}
          disabled={isRunningDiagnostics}
          className="flex items-center space-x-2 px-3 py-1 bg-purple-600/20 border border-purple-500/50 rounded hover:bg-purple-600/30 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRunningDiagnostics ? "animate-spin" : ""}`}
          />
          <span className="text-xs">진단 실행</span>
        </button>
      </div>

      {/* 전체 상태 개요 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900/50 border border-gray-700 rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              전체 상태
            </span>
            {getStatusIcon(currentDiagnostics.overallStatus)}
          </div>
          <div
            className={`text-lg font-bold ${getStatusColor(
              currentDiagnostics.overallStatus
            )}`}
          >
            {getStatusText(currentDiagnostics.overallStatus)}
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              시스템 효율성
            </span>
            <Gauge className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-blue-400">
            {currentDiagnostics.efficiency.toFixed(1)}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div
              className={`h-1 rounded-full transition-all duration-300 ${getEfficiencyColor(
                currentDiagnostics.efficiency
              )}`}
              style={{ width: `${currentDiagnostics.efficiency}%` }}
            />
          </div>
        </div>
      </div>

      {/* 성능 메트릭 */}
      <div className="bg-gray-900/50 border border-gray-700 rounded p-3">
        <div className="flex items-center space-x-2 mb-3">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-sm font-semibold text-gray-200">
            성능 메트릭
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">에너지 수지</span>
              <span
                className={
                  performanceMetrics.power.energyBalance >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {performanceMetrics.power.energyBalance > 0 ? "+" : ""}
                {performanceMetrics.power.energyBalance.toFixed(1)} PU
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">전력 효율</span>
              <span className="text-blue-400">
                {performanceMetrics.power.efficiency.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">스캔 범위</span>
              <span className="text-purple-400">
                {performanceMetrics.exploration.maxScanRange.toFixed(1)} AU
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">최대 속도</span>
              <span className="text-cyan-400">
                {performanceMetrics.navigation.systemSpeed.toFixed(1)} SU
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">워프 범위</span>
              <span className="text-indigo-400">
                {performanceMetrics.navigation.maxWarpRange.toFixed(1)} LY
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">방어막 용량</span>
              <span className="text-amber-400">
                {performanceMetrics.defense.totalShieldCapacity.toFixed(0)} SP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 치명적 문제 */}
      {currentDiagnostics.criticalIssues.length > 0 && (
        <div className="bg-red-900/20 border border-red-500/50 rounded p-3">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-400">
              치명적 문제
            </span>
            <span className="text-xs bg-red-500/20 px-2 py-1 rounded text-red-300">
              {currentDiagnostics.criticalIssues.length}개
            </span>
          </div>
          <div className="space-y-2">
            {currentDiagnostics.criticalIssues.map((issue, index) => (
              <div
                key={index}
                className="text-xs text-red-300 bg-red-900/30 p-2 rounded border-l-2 border-red-500"
              >
                {issue}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 권장사항 */}
      {currentDiagnostics.recommendations.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-500/50 rounded p-3">
          <div className="flex items-center space-x-2 mb-3">
            <Info className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">
              권장사항
            </span>
            <span className="text-xs bg-blue-500/20 px-2 py-1 rounded text-blue-300">
              {currentDiagnostics.recommendations.length}개
            </span>
          </div>
          <div className="space-y-2">
            {currentDiagnostics.recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="text-xs text-blue-300 bg-blue-900/30 p-2 rounded border-l-2 border-blue-500"
              >
                {recommendation}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 마지막 업데이트 시간 */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-700 pt-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-3 h-3" />
          <span>마지막 업데이트</span>
        </div>
        <span>{new Date(lastUpdateTime).toLocaleTimeString()}</span>
      </div>

      {/* 저장된 진단 데이터 */}
      {shipSystems.lastDiagnostics && (
        <div className="bg-gray-900/30 border border-gray-700/50 rounded p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              저장된 진단
            </span>
          </div>
          <div className="text-xs text-gray-500">
            <div className="flex justify-between mb-1">
              <span>진단 시간</span>
              <span>
                {new Date(
                  shipSystems.lastDiagnostics.timestamp
                ).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>전체 상태</span>
              <span className="text-blue-400">
                {shipSystems.lastDiagnostics.overallHealth.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
