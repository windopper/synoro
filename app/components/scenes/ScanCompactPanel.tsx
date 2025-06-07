'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/lib/store';
import { handleShipStartScanAction, handleShipCancelScanAction } from '@/app/lib/features/shipSystemsSlice';
import { useState } from 'react';
import { EXPLORATION_MODULE_SCANNER_PREFIX } from '@/app/data/shipModules';
// 아이콘 컴포넌트를 직접 구현
const ChevronUpIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

export default function ScanCompactPanel() {
    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(false);
    
    const { activeScans, currentState, energy, installedModules } = useSelector((state: RootState) => ({
        activeScans: state.shipSystems.activeScans,
        currentState: state.shipSystems.currentState,
        energy: state.shipSystems.energy,
        installedModules: state.shipSystems.installedModules
    }));

    const isScanning = Object.keys(activeScans).length > 0;
    const activeScanList = Object.entries(activeScans);
    
    // 스캐너 모듈이 설치되어 있는지 확인
    const hasScanner = Object.values(installedModules).some(module => {
        return module.id.startsWith(EXPLORATION_MODULE_SCANNER_PREFIX)
    });

    const handleStartScan = async () => {
        try {
            await dispatch(handleShipStartScanAction() as any);
        } catch (error) {
            console.error('스캔 시작 실패:', error);
        }
    };

    const handleCancelScan = async (targetId: string) => {
        try {
            await dispatch(handleShipCancelScanAction(targetId) as any);
        } catch (error) {
            console.error('스캔 취소 실패:', error);
        }
    };

    const getProgressPercentage = (scan: any) => {
        return scan.progress;
    };

    const getRemainingTime = (scan: any) => {
        const remaining = Math.max(0, scan.estimatedCompletion - Date.now());
        return Math.ceil(remaining / 1000);
    };

    return (
        <div className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2">
            <div className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg min-w-64">
                {/* 헤더 */}
                <div 
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-cyan-400 animate-pulse' : hasScanner ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                        <h3 className="text-sm font-medium text-zinc-100">
                            탐사 시스템
                        </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                        {isScanning && (
                            <span className="text-xs text-cyan-400 font-mono">
                                {activeScanList.length}개 활성
                            </span>
                        )}
                        {isExpanded ? (
                            <ChevronUpIcon className="w-4 h-4 text-zinc-400" />
                        ) : (
                            <ChevronDownIcon className="w-4 h-4 text-zinc-400" />
                        )}
                    </div>
                </div>

                {/* 확장된 내용 */}
                {isExpanded && (
                    <div className="border-t border-zinc-700/50">
                        {/* 상태 정보 */}
                        <div className="p-3 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-400">상태:</span>
                                <span className={`font-mono ${
                                    currentState === 'scanning' ? 'text-cyan-400' : 
                                    currentState === 'idle' ? 'text-emerald-400' : 'text-yellow-400'
                                }`}>
                                    {currentState === 'scanning' ? '스캔 중' : 
                                     currentState === 'idle' ? '대기 중' : currentState.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-400">스캐너:</span>
                                <span className={`font-mono ${hasScanner ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {hasScanner ? '온라인' : '오프라인'}
                                </span>
                            </div>
                        </div>

                        {/* 활성 스캔 목록 */}
                        {activeScanList.length > 0 && (
                            <div className="border-t border-zinc-700/50 p-3 space-y-2">
                                <h4 className="text-xs font-medium text-zinc-300 mb-2">활성 스캔</h4>
                                {activeScanList.map(([scanId, scan]) => {
                                    const progress = getProgressPercentage(scan);
                                    const remaining = getRemainingTime(scan);
                                    
                                    return (
                                        <div key={scanId} className="bg-zinc-800/50 rounded p-2 space-y-2">
                                            <div className="flex justify-between items-center">
                                                {/* <span className="text-xs text-zinc-300 font-mono">
                                                    {scan.targetId}
                                                </span> */}
                                                <button
                                                    onClick={() => handleCancelScan(scanId)}
                                                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                                >
                                                    취소
                                                </button>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-zinc-400">진행률:</span>
                                                    <span className="text-cyan-400 font-mono">{progress.toFixed(1)}%</span>
                                                </div>
                                                <div className="w-full bg-zinc-700 rounded-full h-1.5">
                                                    <div 
                                                        className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-1.5 rounded-full transition-all duration-500"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                {/* <div className="flex justify-between text-xs">
                                                    <span className="text-zinc-400">남은 시간:</span>
                                                    <span className="text-zinc-100 font-mono">{remaining}초</span>
                                                </div> */}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* 액션 버튼 */}
                        <div className="border-t border-zinc-700/50 p-3">
                            {!hasScanner ? (
                                <div className="text-xs text-red-400 text-center py-2">
                                    스캐너 모듈이 필요합니다
                                </div>
                            ) : !isScanning ? (
                                <button
                                    onClick={handleStartScan}
                                    disabled={energy.currentStored < 300}
                                    className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:from-zinc-700 disabled:to-zinc-600 disabled:text-zinc-400 text-white text-sm font-medium py-2 px-4 rounded transition-all duration-200 disabled:cursor-not-allowed"
                                >
                                    {energy.currentStored < 300 ? '에너지 부족' : '스캔 시작'}
                                </button>
                            ) : (
                                <div className="text-center text-xs text-cyan-400 py-2">
                                    스캔 진행 중...
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 축소된 상태에서의 간단한 정보 */}
                {!isExpanded && isScanning && (
                    <div className="px-3 pb-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-400">진행 중</span>
                            <span className="text-cyan-400 font-mono">
                                {getProgressPercentage(activeScanList[0][1]).toFixed(0)}%
                            </span>
                        </div>
                        <div className="w-full bg-zinc-700 rounded-full h-1 mt-1">
                            <div 
                                className="bg-cyan-400 h-1 rounded-full transition-all duration-500"
                                style={{ width: `${getProgressPercentage(activeScanList[0][1])}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}