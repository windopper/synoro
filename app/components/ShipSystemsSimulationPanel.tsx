'use client';

import React, { useState } from 'react';
import { useShipSystemsSimulation } from '@/app/hooks/useShipSystemsSimulation';

interface SimulationConfig {
  enabled: boolean;
  updateInterval: number;
  enableRandomEvents: boolean;
  enableAutomation: boolean;
}

export function ShipSystemsSimulationPanel() {
  const [config, setConfig] = useState<SimulationConfig>({
    enabled: false,
    updateInterval: 1000,
    enableRandomEvents: true,
    enableAutomation: true
  });

  const simulation = useShipSystemsSimulation(config);
  const diagnostics = simulation.getDiagnostics();
  const upgradeSuggestions = simulation.getUpgradeSuggestions();

  // 상태 색상 매핑
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return '최적';
      case 'good': return '양호';
      case 'fair': return '보통';
      case 'poor': return '불량';
      case 'critical': return '위험';
      default: return '알 수 없음';
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* 시뮬레이션 제어판 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            ⚡ 함선 시스템 시뮬레이션
          </h3>
        </div>
        <div className="p-4 space-y-4">
          {/* 시뮬레이션 상태 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                simulation.isRunning 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {simulation.isRunning ? '▶ 실행 중' : '⏸ 정지됨'}
              </span>
              <span className="text-sm text-gray-600">
                업데이트 간격: {config.updateInterval}ms
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                onClick={simulation.triggerUpdate}
                disabled={!simulation.shipState}
              >
                🔄 수동 업데이트
              </button>
              <button
                className={`px-3 py-1 text-sm rounded ${
                  config.enabled 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
              >
                {config.enabled ? '⏸ 일시정지' : '▶ 시작'}
              </button>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 설정 옵션 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">랜덤 이벤트</label>
              <input
                type="checkbox"
                checked={config.enableRandomEvents}
                onChange={(e) => 
                  setConfig(prev => ({ ...prev, enableRandomEvents: e.target.checked }))
                }
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">자동화 시스템</label>
              <input
                type="checkbox"
                checked={config.enableAutomation}
                onChange={(e) => 
                  setConfig(prev => ({ ...prev, enableAutomation: e.target.checked }))
                }
                className="w-4 h-4"
              />
            </div>
          </div>

          {/* 업데이트 간격 설정 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">업데이트 간격 (ms)</label>
            <div className="flex gap-2">
              {[500, 1000, 2000, 5000].map((interval) => (
                <button
                  key={interval}
                  className={`px-3 py-1 text-sm border rounded ${
                    config.updateInterval === interval 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, updateInterval: interval }))}
                >
                  {interval}ms
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 시스템 진단 */}
      {diagnostics && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              📊 시스템 진단
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {/* 전체 상태 */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">전체 상태</span>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(diagnostics.overallStatus)} text-white`}>
                {getStatusText(diagnostics.overallStatus)}
              </span>
            </div>

            {/* 효율성 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">시스템 효율성</span>
                <span className="text-sm text-gray-600">
                  {diagnostics.efficiency.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${diagnostics.efficiency}%` }}
                />
              </div>
            </div>

            {/* 치명적 문제 */}
            {diagnostics.criticalIssues.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  <span className="text-sm font-medium text-red-500">치명적 문제</span>
                </div>
                <div className="space-y-1">
                  {diagnostics.criticalIssues.map((issue, index) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {issue}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 권장사항 */}
            {diagnostics.recommendations.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">✅</span>
                  <span className="text-sm font-medium text-blue-500">권장사항</span>
                </div>
                <div className="space-y-1">
                  {diagnostics.recommendations.map((recommendation, index) => (
                    <div key={index} className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      {recommendation}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 업그레이드 제안 */}
      {upgradeSuggestions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              ⚙️ 업그레이드 제안
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {upgradeSuggestions.map((suggestion, index) => (
              <div key={index} className="text-sm bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 실시간 상태 */}
      {simulation.shipState && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              📈 실시간 상태
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {/* 에너지 상태 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">⚡</span>
                  <span className="text-sm font-medium">에너지 저장량</span>
                </div>
                <span className="text-sm text-gray-600">
                  {simulation.shipState.energy.currentStored.toFixed(1)} / {simulation.shipState.energy.totalStorage.toFixed(1)} PU
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${(simulation.shipState.energy.currentStored / simulation.shipState.energy.totalStorage) * 100}%` 
                  }}
                />
              </div>
            </div>

            {/* 방어막 상태 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">🛡️</span>
                  <span className="text-sm font-medium">방어막 무결성</span>
                </div>
                <span className="text-sm text-gray-600">
                  {simulation.shipState.overallShieldIntegrity.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${simulation.shipState.overallShieldIntegrity}%` }}
                />
              </div>
            </div>

            {/* 함체 무결성 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">🚀</span>
                  <span className="text-sm font-medium">함체 무결성</span>
                </div>
                <span className="text-sm text-gray-600">
                  {simulation.shipState.overallHullIntegrity.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${simulation.shipState.overallHullIntegrity}%` }}
                />
              </div>
            </div>

            {/* 활성 스캔 */}
            {Object.keys(simulation.shipState.activeScans).length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium">활성 스캔</span>
                {Object.entries(simulation.shipState.activeScans).map(([scanId, scan]) => (
                  <div key={scanId} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        스캔 {scanId.substring(0, 8)}...
                      </span>
                      <span className="text-xs text-gray-600">
                        {scan.progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-purple-500 h-1 rounded-full transition-all duration-300" 
                        style={{ width: `${scan.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 