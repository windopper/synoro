"use client";
import React, { useMemo } from "react";
import { useAppSelector } from "../../lib/hooks";

export default function SignalStrengthDisplay() {
  const communicationStatus = useAppSelector((state) => state.shipSystems.communicationStatus);
  const currentPosition = useAppSelector((state) => state.shipSystems.position);

  // 신호 강도에 따른 지연 시간 계산 (시뮬레이션)
  const estimatedDelay = useMemo(() => {
    const baseDelay = 0.5; // 기본 0.5초
    const signalStrength = communicationStatus.signalStrength;
    
    if (signalStrength > 80) return baseDelay;
    if (signalStrength > 60) return baseDelay * 1.5;
    if (signalStrength > 40) return baseDelay * 2.5;
    if (signalStrength > 20) return baseDelay * 4;
    return baseDelay * 8;
  }, [communicationStatus.signalStrength]);

  const getSignalQuality = () => {
    const strength = communicationStatus.signalStrength;
    if (strength > 80) return { label: "EXCELLENT", color: "emerald" };
    if (strength > 60) return { label: "GOOD", color: "green" };
    if (strength > 40) return { label: "FAIR", color: "yellow" };
    if (strength > 20) return { label: "POOR", color: "orange" };
    return { label: "CRITICAL", color: "red" };
  };

  const signalQuality = getSignalQuality();

  const renderSignalBars = () => {
    const bars = [];
    const signalLevel = Math.ceil((communicationStatus.signalStrength / 100) * 5);
    
    for (let i = 1; i <= 5; i++) {
      const isActive = i <= signalLevel;
      const height = `${20 + (i * 8)}px`;
      
      bars.push(
        <div
          key={i}
          className={`w-2 transition-all duration-300 ${
            isActive 
              ? `bg-${signalQuality.color}-400 shadow-${signalQuality.color}-500/50 shadow-sm`
              : 'bg-zinc-700/50'
          }`}
          style={{ height }}
        />
      );
    }
    
    return bars;
  };

  return (
    <div className="space-y-4">
      {/* Signal Strength Header */}
      <div className="p-4 bg-zinc-900/50 border border-zinc-700/50 rounded-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-emerald-300 font-mono text-sm uppercase tracking-wider">
            Signal Status
          </h3>
          <div className={`px-2 py-1 rounded text-xs font-mono bg-${signalQuality.color}-900/50 text-${signalQuality.color}-300`}>
            {signalQuality.label}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs text-zinc-400 font-mono">Signal Strength</div>
            <div className={`text-2xl font-mono text-${signalQuality.color}-300`}>
              {communicationStatus.signalStrength.toFixed(1)}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-zinc-400 font-mono">Est. Delay</div>
            <div className={`text-2xl font-mono text-${signalQuality.color}-300`}>
              {estimatedDelay.toFixed(1)}s
            </div>
          </div>
        </div>
      </div>

      {/* Visual Signal Strength */}
      <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg">
        <h4 className="text-zinc-200 font-mono text-sm mb-4 uppercase tracking-wider">Signal Visualization</h4>
        
        {/* Signal Bars */}
        <div className="flex items-end justify-center space-x-1 mb-4 h-16">
          {renderSignalBars()}
        </div>
        
        {/* Signal Strength Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-400 font-mono">
            <span>Weak</span>
            <span>Strong</span>
          </div>
          <div className="w-full bg-zinc-900/50 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 transition-all duration-500 bg-gradient-to-r ${
                communicationStatus.signalStrength > 80 
                  ? 'from-emerald-600 to-emerald-400'
                  : communicationStatus.signalStrength > 60 
                  ? 'from-green-600 to-green-400'
                  : communicationStatus.signalStrength > 40
                  ? 'from-yellow-600 to-yellow-400'
                  : communicationStatus.signalStrength > 20
                  ? 'from-orange-600 to-orange-400'
                  : 'from-red-600 to-red-400'
              }`}
              style={{ width: `${communicationStatus.signalStrength}%` }}
            />
          </div>
        </div>
      </div>

      {/* Connection Details */}
      <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg">
        <h4 className="text-zinc-200 font-mono text-sm mb-3 uppercase tracking-wider">Connection Details</h4>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 font-mono">Home Base Link:</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                communicationStatus.homeBaseConnection ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
              }`} />
              <span className={`font-mono text-xs ${
                communicationStatus.homeBaseConnection ? 'text-emerald-300' : 'text-red-300'
              }`}>
                {communicationStatus.homeBaseConnection ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 font-mono">Current Position:</span>
            <span className="font-mono text-xs text-cyan-300">
              {currentPosition?.x?.toFixed(2) || '0.00'}, {currentPosition?.y?.toFixed(2) || '0.00'}, {currentPosition?.z?.toFixed(2) || '0.00'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 font-mono">Range Status:</span>
            <span className={`font-mono text-xs ${
              communicationStatus.signalStrength > 50 ? 'text-emerald-300' : 
              communicationStatus.signalStrength > 20 ? 'text-yellow-300' : 'text-red-300'
            }`}>
              {communicationStatus.signalStrength > 50 ? 'OPTIMAL' : 
               communicationStatus.signalStrength > 20 ? 'MARGINAL' : 'CRITICAL'}
            </span>
          </div>
        </div>
      </div>

      {/* Signal Interference Warning */}
      {communicationStatus.signalStrength < 30 && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-red-400 animate-pulse">⚠️</span>
            <span className="text-red-300 font-mono text-sm uppercase tracking-wider">Signal Warning</span>
          </div>
          <p className="text-red-200 text-xs font-mono">
            Low signal strength detected. Transmission reliability may be compromised. 
            Consider moving closer to communication relay or checking antenna systems.
          </p>
        </div>
      )}
    </div>
  );
} 