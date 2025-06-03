"use client";

import { Route } from "lucide-react";
import { StarData } from "../../data/starData";

interface StarConnection {
  toStarId: string;
  distance: number;
}

interface JumpRoutesSectionProps {
  starConnections: StarConnection[];
  getStarById: (id: string) => StarData | undefined;
}

export default function JumpRoutesSection({
  starConnections,
  getStarById,
}: JumpRoutesSectionProps) {
  return (
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
  );
} 