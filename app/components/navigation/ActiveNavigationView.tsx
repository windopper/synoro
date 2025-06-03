"use client";

import { Route } from "lucide-react";
import { StarData } from "../../data/starData";
import { cancelNavigation, navigateToStar, navigateToStarWarp } from "@/app/lib/features/shipSystemsSlice";
import { useAppDispatch } from "@/app/lib/hooks";

interface ActiveNavigationViewProps {
  navigation: {
    navigationMode: "warp" | "normal";
    targetStarId: string | null;
    travelProgress: number;
    travelSpeed: number;
    estimatedCompletion: number;
  };
  targetStar: StarData | undefined;
  shipPosition: { x: number; y: number; z: number };
}

export default function ActiveNavigationView({
  navigation,
  targetStar,
  shipPosition,
}: ActiveNavigationViewProps) {
  const dispatch = useAppDispatch();
  const progress = navigation.travelProgress;
  const currentSpeed = navigation.travelSpeed;
  const estimatedCompletion = navigation.estimatedCompletion;

  // 남은 시간 계산 (밀리초를 초로 변환)
  const timeRemaining = Math.max(0, estimatedCompletion - Date.now()) / 1000;
  const hoursRemaining = Math.floor(timeRemaining / 3600);
  const minutesRemaining = Math.floor((timeRemaining % 3600) / 60);
  const secondsRemaining = Math.floor(timeRemaining % 60);

  // 거리 계산
  const distance = targetStar?.position
    ? Math.sqrt(
        Math.pow(targetStar.position.x - shipPosition.x, 2) +
        Math.pow(targetStar.position.y - shipPosition.y, 2) +
        Math.pow(targetStar.position.z - shipPosition.z, 2)
      ).toFixed(2)
    : "---";

  const handleCancelNavigation = () => {
    dispatch(cancelNavigation());
  }

  const handleWarpNavigation = () => {
    if (!targetStar) return;
    dispatch(navigateToStarWarp({ star: targetStar }));
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Route className="w-4 h-4 text-cyan-400 animate-pulse" />
        <h3 className="text-gray-200 font-mono text-sm uppercase tracking-wider">
          Navigation Active
        </h3>
        <div className="ml-auto">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-400 font-mono text-xs uppercase">
              {navigation.navigationMode}
            </span>
          </div>
        </div>
      </div>

      {/* Target Star Information */}
      <div className="border border-cyan-500/60 bg-cyan-900/20 p-4 rounded mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
            <div>
              <div className="text-cyan-100 font-mono text-lg font-bold tracking-wide">
                {targetStar?.name || "Unknown System"}
              </div>
              <div className="text-cyan-300 font-mono text-xs">
                Target: {navigation.targetStarId?.slice(0, 12)}...
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-cyan-200 font-mono text-sm">
              {distance} LY
            </div>
            <div className="text-cyan-400 font-mono text-xs uppercase">
              Distance
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-cyan-300 font-mono text-xs uppercase">
              Travel Progress
            </span>
            <span className="text-cyan-200 font-mono text-xs font-bold">
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 border border-cyan-500/30">
            <div
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-2 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Progress bar animation effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Speed and ETA Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-cyan-200 font-mono text-lg font-bold">
              {currentSpeed.toFixed(2)}
            </div>
            <div className="text-cyan-400 font-mono text-xs uppercase">
              Current Speed (AU/h)
            </div>
          </div>
          <div className="text-center">
            <div className="text-cyan-200 font-mono text-lg font-bold">
              {timeRemaining > 0
                ? `${hoursRemaining.toString().padStart(2, "0")}:${minutesRemaining
                    .toString()
                    .padStart(2, "0")}:${secondsRemaining.toString().padStart(2, "0")}`
                : "00:00:00"}
            </div>
            <div className="text-cyan-400 font-mono text-xs uppercase">
              ETA Remaining
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Navigation Button */}
    


      {/* Navigation Status */}
      <div className="border border-gray-700/40 bg-gray-900/40 p-3 rounded">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 font-mono text-xs uppercase">
            Navigation Computer
          </span>
          <span className="text-cyan-400 font-mono text-xs animate-pulse">
            CALCULATING
          </span>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-1 mb-2">
          <div
            className="bg-cyan-400 h-1 rounded-full animate-pulse"
            style={{ width: "85%" }}
          />
        </div>

        <div className="text-gray-400 font-mono text-xs">
          Monitoring trajectory and hazard detection...
        </div>
      </div>
    </div>
  );
} 