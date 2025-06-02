"use client";
import React, { useMemo } from "react";
import { useAppSelector } from "../../lib/hooks";

export default function ShipStatusOverview() {
  const spaceship = useAppSelector((state) => state.shipSystems);
  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return "text-emerald-400";
    if (percentage >= 50) return "text-amber-400";
    if (percentage >= 25) return "text-orange-400";
    return "text-red-400";
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= 75) return "bg-emerald-500";
    if (percentage >= 50) return "bg-amber-500";
    if (percentage >= 25) return "bg-orange-500";
    return "bg-red-500";
  };
  // Memoize computed values for performance
  const computedValues = useMemo(() => {
    const energyPercentage = spaceship.energy?.totalStorage
      ? (spaceship.energy.currentStored / spaceship.energy.totalStorage) * 100
      : 0;

    const fuelPercentage = Math.min(
      spaceship.resources?.inventory?.fuel || 0,
      100
    );

    return {
      energyPercentage,
      fuelPercentage,
      shipName: spaceship.shipName || "UNKNOWN VESSEL",
      location: spaceship.currentStarId?.slice(0, 8) || "DEEP_SPACE",
      moduleCount: Object.keys(spaceship.installedModules || {}).length,
      hullIntegrity: spaceship.overallHullIntegrity || 0,
      shieldIntegrity: spaceship.overallShieldIntegrity || 0,
      energyCurrent: spaceship.energy?.currentStored?.toFixed(0) || "0",
      energyMax: spaceship.energy?.totalStorage || 0,
      fuel: spaceship.resources?.inventory?.fuel?.toFixed(0) || "0",
      oxygen: spaceship.resources?.inventory?.oxygen?.toFixed(0) || "0",
      homeBaseConnection: spaceship.communicationStatus.homeBaseConnection,
      signalStrength: spaceship.communicationStatus.signalStrength || 0,
      transmissionQueue: spaceship.communicationStatus.transmissionQueue,
      upgradeQueue: Object.keys(spaceship.upgradeQueue || {}).length,
      lastDiagnostics: spaceship.lastDiagnostics,
    };
  }, [spaceship]);

  return (
    <div className="w-full grid grid-cols-4 grid-rows-[repeat(2, auto)] gap-x-4 gap-y-1 backdrop-blur-sm">
      {/* Ship Name and Location */}
      <div className="flex flex-col">
        {/* Hull Integrity */}
        <div className="p-2 rounded-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-300 font-mono text-xs uppercase tracking-wider">
              HULL
            </span>
            <span
              className={`font-mono text-xs ${getStatusColor(
                computedValues.hullIntegrity
              )}`}
            >
              {computedValues.hullIntegrity.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-900/80 rounded-none h-1">
            <div
              className={`h-1 transition-all duration-300 ${getBarColor(
                computedValues.hullIntegrity
              )}`}
              style={{ width: `${computedValues.hullIntegrity}%` }}
            />
          </div>
        </div>

        {/* Shield Integrity */}
        <div className="p-2 rounded-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-300 font-mono text-xs uppercase tracking-wider">
              SHLD
            </span>
            <span
              className={`font-mono text-xs ${getStatusColor(
                computedValues.shieldIntegrity
              )}`}
            >
              {computedValues.shieldIntegrity.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-900/80 rounded-none h-1">
            <div
              className={`h-1 transition-all duration-300 ${getBarColor(
                computedValues.shieldIntegrity
              )}`}
              style={{ width: `${computedValues.shieldIntegrity}%` }}
            />
          </div>
        </div>

        {/* Energy Status */}
        <div className="p-2 rounded-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-300 font-mono text-xs uppercase tracking-wider">
              PWR
            </span>
            <span className="text-cyan-400 font-mono text-xs">
              {computedValues.energyCurrent}/{computedValues.energyMax}
            </span>
          </div>
          <div className="w-full bg-gray-900/80 rounded-none h-1">
            <div
              className="h-1 transition-all duration-300 bg-cyan-500"
              style={{ width: `${computedValues.energyPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Critical Resources */}
      <div className="border border-gray-600/20 bg-black/50 p-2 rounded-sm">
        <div className="text-gray-300 font-mono text-xs uppercase tracking-wider mb-2">
          RSRC
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400 font-mono">FUEL</span>
              <span className="text-cyan-400 font-mono">
                {computedValues.fuel}
              </span>
            </div>
            <div className="w-full bg-gray-900/80 rounded-none h-0.5">
              <div
                className="h-0.5 bg-cyan-500 transition-all duration-300"
                style={{ width: `${computedValues.fuelPercentage}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400 font-mono">O2</span>
              <span className="text-emerald-400 font-mono">
                {computedValues.oxygen}%
              </span>
            </div>
            <div className="w-full bg-gray-900/80 rounded-none h-0.5">
              <div
                className="h-0.5 bg-emerald-500 transition-all duration-300"
                style={{
                  width: `${Math.min(Number(computedValues.oxygen), 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Communication Status */}
      <div className="border border-blue-600/20 bg-black/50 p-2 rounded-sm">
        <div className="text-gray-300 font-mono text-xs uppercase tracking-wider mb-2">
          COMM
        </div>
        <div className="space-y-2">
          {/* Home Base Connection */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-mono">BASE</span>
            <div className="flex items-center space-x-1">
              <div
                className={`w-1 h-1 rounded-full ${
                  computedValues.homeBaseConnection
                    ? "bg-emerald-400"
                    : "bg-red-400"
                }`}
              />
              <span
                className={`font-mono text-xs ${
                  computedValues.homeBaseConnection
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {computedValues.homeBaseConnection ? "CONN" : "DISC"}
              </span>
            </div>
          </div>

          {/* Signal Strength */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400 font-mono">SIG</span>
              <span
                className={`font-mono text-xs ${getStatusColor(
                  computedValues.signalStrength
                )}`}
              >
                {computedValues.signalStrength.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-900/80 rounded-none h-0.5">
              <div
                className={`h-0.5 transition-all duration-300 ${getBarColor(
                  computedValues.signalStrength
                )}`}
                style={{ width: `${computedValues.signalStrength}%` }}
              />
            </div>
          </div>

          {/* Transmission Queue */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-mono">QUEUE</span>
            <span className="text-cyan-400 font-mono">
              {Array.isArray(computedValues.transmissionQueue)
                ? computedValues.transmissionQueue.length
                : 0}
            </span>
          </div>
        </div>
      </div>

      {/* System Status Summary */}
      <div className="border border-green-600/20 bg-black/50 p-2 rounded-sm">
        <div className="text-gray-300 font-mono text-xs uppercase tracking-wider mb-2">
          SYS
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-emerald-400 animate-pulse rounded-full" />
              <span className="text-gray-400 font-mono">OPERATIONAL</span>
            </div>
            <div className="text-gray-500 font-mono">
              {computedValues.moduleCount}
            </div>
          </div>

          {/* Upgrade Queue */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-mono">UPG QUEUE</span>
            <span className="text-amber-400 font-mono">
              {computedValues.upgradeQueue}
            </span>
          </div>

          {/* Quick status indicators */}
          <div className="grid grid-cols-3 gap-1 pt-1 border-t border-gray-700/30">
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1 font-mono">ENG</div>
              <div className="w-1 h-1 bg-emerald-400 rounded-full mx-auto" />
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1 font-mono">LSS</div>
              <div className="w-1 h-1 bg-emerald-400 rounded-full mx-auto" />
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1 font-mono">COM</div>
              <div
                className={`w-1 h-1 rounded-full mx-auto ${
                  computedValues.homeBaseConnection
                    ? "bg-emerald-400"
                    : "bg-amber-400"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ship Name and Location */}
      <div className="rounded-sm backdrop-blur-sm p-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-amber-400 animate-pulse rounded-full" />
            <span className="text-amber-100 font-mono text-xs tracking-widest uppercase">
              {computedValues.shipName}
            </span>
          </div>
        </div>
        <div className="text-xs text-amber-600/80 font-mono mt-1">
          LOC: {computedValues.location}
        </div>
      </div>

      {/* Diagnostics Panel */}
      <div className="border border-purple-600/20 bg-black/50 p-2 rounded-sm col-span-2">
        <div className="text-gray-300 font-mono text-xs uppercase tracking-wider mb-2">
          DIAG
        </div>
        <div className="flex items-center justify-between space-x-4">
          {computedValues.lastDiagnostics ? (
            <>
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-gray-400 font-mono">SCAN</span>
                <span className="text-gray-500 font-mono">
                  {new Date(
                    computedValues.lastDiagnostics.timestamp || Date.now()
                  ).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-gray-400 font-mono">HEALTH</span>
                <span
                  className={`font-mono text-xs ${getStatusColor(
                    computedValues.lastDiagnostics.overallHealth || 0
                  )}`}
                >
                  {(computedValues.lastDiagnostics.overallHealth || 0).toFixed(
                    1
                  )}
                  %
                </span>
              </div>
              {computedValues.lastDiagnostics.criticalIssues &&
                computedValues.lastDiagnostics.criticalIssues.length > 0 && (
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-gray-400 font-mono">CRIT</span>
                    <span className="text-red-400 font-mono">
                      {computedValues.lastDiagnostics.criticalIssues.length}
                    </span>
                  </div>
                )}
              {computedValues.lastDiagnostics.recommendations &&
                computedValues.lastDiagnostics.recommendations.length > 0 && (
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-gray-400 font-mono">REC</span>
                    <span className="text-amber-400 font-mono">
                      {computedValues.lastDiagnostics.recommendations.length}
                    </span>
                  </div>
                )}
            </>
          ) : (
            <div className="text-xs text-gray-500 font-mono">
              NO DIAGNOSTIC DATA
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
