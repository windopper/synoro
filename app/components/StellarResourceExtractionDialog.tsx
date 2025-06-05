"use client";

import React, { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle,
  Settings,
  Star,
  Gauge,
  TrendingUp,
  Shield,
  Sparkles,
  Timer,
  Target,
  Activity,
  Gem,
  Cpu,
  Battery,
  Thermometer,
} from "lucide-react";
import { StarData } from "../data/starData";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
  startStellarExtraction,
  completeStellarExtraction,
  updateExtractionProgress,
  cancelStellarExtraction,
} from "../lib/features/shipSystemsSlice";

interface StellarResourceExtractionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  star: StarData | null;
}

const StellarResourceExtractionDialog: React.FC<
  StellarResourceExtractionDialogProps
> = ({ isOpen, onClose, star }) => {
  const dispatch = useAppDispatch();
  const stellarExtraction = useAppSelector(
    (state) => state.shipSystems.stellarExtraction
  );
  const [selectedResourceType, setSelectedResourceType] = useState<
    "primary" | "rare"
  >("primary");
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [extractionMessage, setExtractionMessage] = useState<string>("");
  const [extractionError, setExtractionError] = useState<string>("");

  const activeExtraction = star
    ? stellarExtraction.activeExtractions[star.id]
    : null;
  const extractionHistory = star
    ? stellarExtraction.extractionHistory[star.id]
    : null;

  const handleStartExtraction = async () => {
    if (!star || !selectedResource) return;

    try {
      setExtractionError("");
      await dispatch(
        startStellarExtraction({
          star,
          extractionType: selectedResourceType,
          resourceType: selectedResource,
        })
      ).unwrap();

      setExtractionMessage("Resource extraction started!");
      setTimeout(() => setExtractionMessage(""), 3000);
    } catch (error: any) {
      setExtractionError(error.message);
      setTimeout(() => setExtractionError(""), 5000);
    }
  };

  const handleCancelExtraction = () => {
    if (!star) return;
    dispatch(cancelStellarExtraction(star.id));
    setExtractionMessage("Resource extraction cancelled.");
    setTimeout(() => setExtractionMessage(""), 3000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-emerald-400";
      case "medium":
        return "text-cyan-400";
      case "hard":
        return "text-orange-400";
      case "extreme":
        return "text-red-400";
      default:
        return "text-zinc-400";
    }
  };

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-emerald-500/20 border-emerald-500/30 text-emerald-300";
      case "medium":
        return "bg-cyan-500/20 border-cyan-500/30 text-cyan-300";
      case "hard":
        return "bg-orange-500/20 border-orange-500/30 text-orange-300";
      case "extreme":
        return "bg-red-500/20 border-red-500/30 text-red-300";
      default:
        return "bg-zinc-500/20 border-zinc-500/30 text-zinc-300";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Easy";
      case "medium":
        return "Medium";
      case "hard":
        return "Hard";
      case "extreme":
        return "Extreme";
      default:
        return "Unknown";
    }
  };

  const getResourceIcon = (resourceName: string, isRare: boolean) => {
    if (isRare) {
      return <Gem className="w-4 h-4 text-purple-400" />;
    }

    const name = resourceName.toLowerCase();
    if (name.includes("energy") || name.includes("plasma")) {
      return <Zap className="w-4 h-4 text-yellow-400" />;
    }
    if (name.includes("metal") || name.includes("iron")) {
      return <Shield className="w-4 h-4 text-gray-400" />;
    }
    if (name.includes("crystal") || name.includes("quantum")) {
      return <Sparkles className="w-4 h-4 text-blue-400" />;
    }
    return <Cpu className="w-4 h-4 text-cyan-400" />;
  };

  const getStarTypeInfo = (star: StarData) => {
    const type = star.spectralClass || "Unknown";
    const temp = star.temperature || 0;
    const mass = star.mass || 1;

    return { type, temp, mass };
  };

  // 자원 데이터 계산 (조건부 return 이전에 해야 함)
  const resources = star?.stellarResources;
  const currentResources =
    resources && selectedResourceType === "primary"
      ? resources.primaryResources
      : resources?.rareResources || {};

  // 첫 번째 자원을 기본 선택으로 설정 (조건부 return 이전에 해야 함)
  useEffect(() => {
    if (!star || !star.stellarResources) return;

    const resourceKeys = Object.keys(currentResources);
    if (resourceKeys.length > 0 && !selectedResource) {
      setSelectedResource(resourceKeys[0]);
    }
  }, [currentResources, selectedResource, star]);

  // 조건부 return
  if (!star || !star.stellarResources || !resources) {
    return null;
  }

  const starInfo = getStarTypeInfo(star);
  const totalResources =
    Object.keys(resources.primaryResources).length +
    Object.keys(resources.rareResources || {}).length;
  const extractionEfficiency = Math.round(
    100 -
      (resources.extractionDifficulty === "easy"
        ? 10
        : resources.extractionDifficulty === "medium"
        ? 25
        : resources.extractionDifficulty === "hard"
        ? 40
        : 60)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-xl shadow-2xl p-4 max-w-6xl w-full mx-4 max-h-[98vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="relative p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Stellar Resource Extraction
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-zinc-300 font-medium text-sm">
                        {star.name}
                      </span>
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyBadgeColor(
                        resources.extractionDifficulty
                      )}`}
                    >
                      {starInfo.type}
                    </div>
                    <div className="px-2 py-0.5 bg-zinc-700/50 rounded-full text-xs text-zinc-300 border border-zinc-600/50">
                      {totalResources} Resources
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-zinc-800/50 rounded-lg transition-colors group"
              >
                <X className="w-4 h-4 text-zinc-400 group-hover:text-white" />
              </button>
            </div>

            {/* Star Stats Bar */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/30">
                <div className="flex items-center space-x-1.5 mb-1">
                  <Thermometer className="w-3 h-3 text-orange-400" />
                  <span className="text-zinc-400 text-xs">Temperature</span>
                </div>
                <div className="text-white font-bold text-sm">
                  {starInfo.temp.toLocaleString()}K
                </div>
              </div>
              <div className="bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/30">
                <div className="flex items-center space-x-1.5 mb-1">
                  <Gauge className="w-3 h-3 text-blue-400" />
                  <span className="text-zinc-400 text-xs">Solar Mass</span>
                </div>
                <div className="text-white font-bold text-sm">
                  {starInfo.mass.toFixed(2)}M☉
                </div>
              </div>
              <div className="bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/30">
                <div className="flex items-center space-x-1.5 mb-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-zinc-400 text-xs">Efficiency</span>
                </div>
                <div className="text-white font-bold text-sm">
                  {extractionEfficiency}%
                </div>
              </div>
            </div>

            {/* Messages */}
            {extractionMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center space-x-2"
              >
                <div className="p-0.5 bg-emerald-500/20 rounded-full">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-emerald-200 font-medium text-sm">
                  {extractionMessage}
                </span>
              </motion.div>
            )}

            {extractionError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-2"
              >
                <div className="p-0.5 bg-red-500/20 rounded-full">
                  <AlertCircle className="w-3 h-3 text-red-400" />
                </div>
                <span className="text-red-200 font-medium text-sm">
                  {extractionError}
                </span>
              </motion.div>
            )}

            {/* Active Extraction Status */}
            {activeExtraction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-3 p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="relative p-1.5 bg-cyan-500/20 rounded-lg">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <motion.div
                        className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-cyan-400 rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </div>
                    <div>
                      <span className="text-cyan-200 font-semibold text-sm">
                        Extraction in Progress
                      </span>
                      <div className="text-zinc-400 text-xs flex items-center">
                        {getResourceIcon(
                          activeExtraction.resourceType,
                          selectedResourceType === "rare"
                        )}
                        <span className="ml-1">
                          {activeExtraction.resourceType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelExtraction}
                    className="px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors font-medium border border-red-500/30 text-sm"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Target className="w-3 h-3 text-zinc-400" />
                        <span className="text-zinc-400">Yield</span>
                      </div>
                      <span className="text-white font-bold">
                        {activeExtraction.expectedYield}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Timer className="w-3 h-3 text-zinc-400" />
                        <span className="text-zinc-400">Time</span>
                      </div>
                      <span className="text-white font-bold">
                        {Math.round((100 - activeExtraction.progress) * 0.6)}s
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Battery className="w-3 h-3 text-zinc-400" />
                        <span className="text-zinc-400">Power</span>
                      </div>
                      <span className="text-yellow-400 font-bold">85%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Gauge className="w-3 h-3 text-zinc-400" />
                        <span className="text-zinc-400">Status</span>
                      </div>
                      <span className="text-emerald-400 font-bold">OK</span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-zinc-300 font-medium text-sm">
                        Progress
                      </span>
                      <span className="text-cyan-400 font-bold text-sm">
                        {activeExtraction.progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-700/50 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full relative"
                        style={{ width: `${activeExtraction.progress}%` }}
                        animate={{
                          boxShadow: [
                            "0 0 10px rgba(34, 211, 238, 0.3)",
                            "0 0 20px rgba(34, 211, 238, 0.6)",
                            "0 0 10px rgba(34, 211, 238, 0.3)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/20 rounded-full"
                          animate={{
                            opacity: [0.2, 0.5, 0.2],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Extraction Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
              <div className="bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/30">
                <h3 className="text-white font-semibold mb-2 flex items-center space-x-2 text-sm">
                  <Settings className="w-4 h-4 text-zinc-400" />
                  <span>Extraction Parameters</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Shield className="w-3 h-3 text-zinc-400" />
                      <span className="text-zinc-400 text-xs">Difficulty</span>
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyBadgeColor(
                        resources.extractionDifficulty
                      )}`}
                    >
                      {getDifficultyLabel(resources.extractionDifficulty)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <TrendingUp className="w-3 h-3 text-zinc-400" />
                      <span className="text-zinc-400 text-xs">Renewal</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold text-xs">
                        {resources.renewalRate}%
                      </span>
                      <div className="w-8 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                          style={{ width: `${resources.renewalRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      <span className="text-zinc-400 text-xs">Max/Hour</span>
                    </div>
                    <span className="text-white font-bold text-xs">
                      {resources.maxExtractionsPerHour || "∞"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Cpu className="w-3 h-3 text-zinc-400" />
                      <span className="text-zinc-400 text-xs">Load</span>
                    </div>
                    <span className="text-cyan-400 font-bold text-xs">
                      Moderate
                    </span>
                  </div>
                </div>
              </div>

              {extractionHistory && (
                <div className="bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/30">
                  <h3 className="text-white font-semibold mb-2 flex items-center space-x-2 text-sm">
                    <Activity className="w-4 h-4 text-zinc-400" />
                    <span>Statistics</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <Target className="w-3 h-3 text-zinc-400" />
                        <span className="text-zinc-400 text-xs">Total</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-white font-bold text-xs">
                          {extractionHistory.totalExtractions}
                        </span>
                        <div className="px-1.5 py-0.5 bg-emerald-500/20 rounded-full text-xs text-emerald-300">
                          +
                          {Math.floor(extractionHistory.totalExtractions * 0.1)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <Timer className="w-3 h-3 text-zinc-400" />
                        <span className="text-zinc-400 text-xs">This Hour</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-white font-bold text-xs">
                          {extractionHistory.extractionsThisHour}
                        </span>
                        <div className="w-12 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                            style={{
                              width: `${
                                (extractionHistory.extractionsThisHour /
                                  (resources.maxExtractionsPerHour || 10)) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span className="text-zinc-400 text-xs">Last</span>
                      </div>
                      <span className="text-white font-medium text-xs">
                        {new Date(
                          extractionHistory.lastExtraction
                        ).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <TrendingUp className="w-3 h-3 text-zinc-400" />
                        <span className="text-zinc-400 text-xs">Success</span>
                      </div>
                      <span className="text-emerald-400 font-bold text-xs">
                        98.5%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Special Conditions */}
            {resources.specialConditions &&
              resources.specialConditions.length > 0 && (
                <div className="mb-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <h3 className="text-orange-200 font-semibold mb-2 flex items-center space-x-2 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Special Conditions</span>
                    <div className="px-1.5 py-0.5 bg-orange-500/20 rounded-full text-xs text-orange-300">
                      {resources.specialConditions.length}
                    </div>
                  </h3>
                  <ul className="space-y-1.5">
                    {resources.specialConditions.map((condition, index) => (
                      <li
                        key={index}
                        className="text-orange-100 flex items-start space-x-2 p-2 bg-orange-500/5 rounded-lg border border-orange-500/20 text-xs"
                      >
                        <div className="p-0.5 bg-orange-500/20 rounded-full mt-0.5">
                          <AlertCircle className="w-2.5 h-2.5 text-orange-400" />
                        </div>
                        <span className="leading-relaxed">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Resource Selection */}
            {!activeExtraction && (
              <div className="space-y-3">
                {/* Resource Type Toggle */}
                <div className="flex space-x-1.5 bg-zinc-800/50 p-1.5 rounded-lg">
                  <button
                    onClick={() => setSelectedResourceType("primary")}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5 text-sm ${
                      selectedResourceType === "primary"
                        ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-700/50"
                    }`}
                  >
                    <Cpu className="w-3 h-3" />
                    <span>Primary</span>
                    <div className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                      {Object.keys(resources.primaryResources).length}
                    </div>
                  </button>
                  {resources.rareResources &&
                    Object.keys(resources.rareResources).length > 0 && (
                      <button
                        onClick={() => setSelectedResourceType("rare")}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5 text-sm ${
                          selectedResourceType === "rare"
                            ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                            : "text-zinc-300 hover:text-white hover:bg-zinc-700/50"
                        }`}
                      >
                        <Gem className="w-3 h-3" />
                        <span>Rare</span>
                        <div className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                          {Object.keys(resources.rareResources).length}
                        </div>
                      </button>
                    )}
                </div>

                {/* Resource List */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(currentResources).map(
                    ([resourceName, amount]) => (
                      <motion.button
                        key={resourceName}
                        onClick={() => setSelectedResource(resourceName)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-2 rounded-lg border transition-all duration-200 text-left relative overflow-hidden ${
                          selectedResource === resourceName
                            ? "border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                            : "border-zinc-700/50 bg-zinc-800/20 hover:border-zinc-600/50 hover:bg-zinc-800/40"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center space-x-1.5">
                            <div className="p-1 bg-zinc-700/50 rounded-lg">
                              {getResourceIcon(
                                resourceName,
                                selectedResourceType === "rare"
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-white text-xs">
                                {resourceName}
                              </div>
                              <div className="text-zinc-400 text-xs">
                                {selectedResourceType === "rare"
                                  ? "Rare"
                                  : "Primary"}
                              </div>
                            </div>
                          </div>
                          {selectedResource === resourceName && (
                            <div className="p-0.5 bg-cyan-500/20 rounded-full">
                              <CheckCircle className="w-3 h-3 text-cyan-400" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 text-xs">Yield</span>
                            <span className="text-white font-bold text-xs">
                              {amount} units
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 text-xs">Time</span>
                            <span className="text-cyan-400 font-medium text-xs">
                              ~60s
                            </span>
                          </div>
                          <div className="w-full bg-zinc-700/30 rounded-full h-1">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              style={{
                                width: `${Math.min(
                                  (amount / 100) * 100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>

                        {selectedResource === resourceName && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 border-2 border-cyan-500/30 rounded-lg pointer-events-none"
                          />
                        )}
                      </motion.button>
                    )
                  )}
                </div>

                {/* Start Extraction Button */}
                <motion.button
                  onClick={handleStartExtraction}
                  disabled={!selectedResource}
                  whileHover={{ scale: selectedResource ? 1.02 : 1 }}
                  whileTap={{ scale: selectedResource ? 0.98 : 1 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:shadow-none relative overflow-hidden"
                >
                  <Zap className="w-4 h-4" />
                  <span>Start Extraction</span>
                  {selectedResource && (
                    <div className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {selectedResource}
                    </div>
                  )}

                  {selectedResource && (
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// memo
export default memo(StellarResourceExtractionDialog);
