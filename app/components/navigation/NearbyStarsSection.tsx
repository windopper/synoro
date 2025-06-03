"use client";

import { MapPin } from "lucide-react";
import { StarData } from "../../data/starData";

interface NearbyStarsSectionProps {
  nearbyStars: StarData[];
}

export default function NearbyStarsSection({ nearbyStars }: NearbyStarsSectionProps) {
  return (
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
  );
} 