"use client";

import { useCallback } from "react";
import { useAppSelector } from "../../lib/hooks";
import { Route, MapPin, Zap } from "lucide-react";

export default function NavigationPanel() {
  const { stars, starConnections } = useAppSelector(
    (state) => state.starSystem
  );
  const spaceShip = useAppSelector((state) => state.shipSystems);

  const getStarById = useCallback(
    (id: string) => {
      return stars.find((star) => star.id === id);
    },
    [stars]
  );

  // 현재 위치 근처의 별들 (임시로 가까운 별 5개 선택)
  const nearbyStars = stars
    .filter((star) => star.id !== spaceShip.currentStarId)
    .slice(0, 5);

  return (
    <div className="h-full w-full relative">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(156, 163, 175, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(156, 163, 175, 0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative z-10 h-full overflow-y-auto ">
        {/* Jump Connections Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Route className="w-4 h-4 text-blue-400" />
            <h3 className="text-gray-200 font-mono text-sm uppercase tracking-wider">
              Jump Routes
            </h3>
          </div>
          
          {starConnections.length === 0 ? (
            <div className="text-center py-4">
              <div className="w-8 h-8 border border-gray-600 mx-auto mb-2 flex items-center justify-center rounded">
                <div className="w-2 h-2 bg-gray-500 animate-pulse rounded-full" />
              </div>
              <div className="text-gray-400 font-mono text-xs uppercase tracking-wider">
                No Jump Routes Available
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {starConnections.map((connection, index) => {
                const targetStar = getStarById(connection.toStarId);
                return (
                  <div
                    key={index}
                    className="group relative border border-gray-700/40 bg-gray-900/40 p-3 hover:border-blue-500/60 hover:bg-blue-900/20 transition-all duration-300 rounded cursor-pointer"
                  >
                    {/* Jump Line Indicator */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-blue-400 to-transparent rounded-full" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        <div>
                          <div className="text-gray-100 font-mono text-sm tracking-wide">
                            {targetStar?.name || "Unknown System"}
                          </div>
                          <div className="text-gray-500 font-mono text-xs">
                            {connection.toStarId.slice(0, 8)}...
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-blue-300 font-mono text-sm font-bold">
                          {connection.distance.toFixed(2)} LY
                        </div>
                        <div className="text-gray-500 font-mono text-xs uppercase">
                          Distance
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Nearby Stars Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-amber-400" />
            <h3 className="text-gray-200 font-mono text-sm uppercase tracking-wider">
              Nearby Systems
            </h3>
          </div>
          
          <div className="space-y-2">
            {nearbyStars.map((star, index) => (
              <div
                key={star.id}
                className="group border border-gray-700/40 bg-gray-900/40 p-3 hover:border-amber-500/60 hover:bg-amber-900/20 transition-all duration-300 rounded cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full" />
                    <div>
                      <div className="text-gray-100 font-mono text-sm tracking-wide">
                        {star.name}
                      </div>
                      <div className="text-gray-500 font-mono text-xs">
                        {star.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-amber-300 font-mono text-sm">
                      {(Math.random() * 10 + 1).toFixed(2)} LY
                    </div>
                    <div className="text-gray-500 font-mono text-xs uppercase">
                      Distance
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Scanner Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-green-400" />
            <h3 className="text-gray-200 font-mono text-sm uppercase tracking-wider">
              Scanner Status
            </h3>
          </div>
          
          <div className="border border-gray-700/40 bg-gray-900/40 p-3 rounded">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 font-mono text-xs uppercase">
                Long Range Scanner
              </span>
              <span className="text-green-400 font-mono text-xs">ACTIVE</span>
            </div>
            
            <div className="w-full bg-gray-800 rounded-full h-1 mb-2">
              <div 
                className="bg-green-400 h-1 rounded-full animate-pulse"
                style={{ width: '75%' }}
              />
            </div>
            
            <div className="text-gray-400 font-mono text-xs">
              Scanning for anomalies and jump signatures...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 