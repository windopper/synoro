'use client';

import React from 'react';
import { ShipSystemsSimulationPanel } from '@/app/components/ShipSystemsSimulationPanel';
import { ShipSystemsManager } from '@/app/components/ShipSystemsManager';

export default function SimulationDemoPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          함선 시스템 시뮬레이션 데모
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 시뮬레이션 매니저 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">시스템 매니저</h2>
            <div className="relative min-h-[400px]">
              <ShipSystemsManager isVisible={true} />
            </div>
          </div>
          
          {/* 상세 시뮬레이션 패널 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">상세 시뮬레이션</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <ShipSystemsSimulationPanel />
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">사용 방법</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• 시뮬레이션을 시작하려면 '시작' 버튼을 클릭하세요</li>
            <li>• 업데이트 간격을 조정하여 시뮬레이션 속도를 변경할 수 있습니다</li>
            <li>• 랜덤 이벤트와 자동화 시스템을 활성화할 수 있습니다</li>
            <li>• 실시간으로 함선의 에너지, 방어막, 함체 상태가 업데이트됩니다</li>
            <li>• 시스템 진단을 통해 함선의 전체적인 상태를 확인할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 