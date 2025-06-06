"use client";
import React, { useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { addTransmissionToQueue } from "../../lib/features/shipSystemsSlice";
import { cancelTransmission } from "../../lib/features/actions/shipCommunicationAction";
import { estimateTransmissionTime } from "../../lib/utils/communicationSystem";
import { calculateShipPerformance } from "../../lib/utils/shipPerformanceUtils";

interface TransmissionData {
  id: string;
  type: "knowledge_report" | "message" | "beacon_data";
  title: string;
  dataSize: number;
  priority: number;
  progress: number;
}

export default function CommunicationInterface() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.shipSystems);
  const communicationStatus = useAppSelector((state) => state.shipSystems.communicationStatus);
  const [selectedTransmissionType, setSelectedTransmissionType] = useState<"knowledge_report" | "message" | "beacon_data">("message");
  const [newMessage, setNewMessage] = useState("");

  // 전송 큐를 배열로 변환하고 정렬
  const transmissionQueue = useMemo(() => {
    return Object.entries(communicationStatus.transmissionQueue).map(([id, transmission]) => ({
      id,
      type: id.startsWith("knowledge_") ? "knowledge_report" : 
            id.startsWith("beacon_") ? "beacon_data" : "message",
      title: id.startsWith("knowledge_") ? "Knowledge Report" :
             id.startsWith("beacon_") ? "Beacon Data" : "Message",
      dataSize: transmission.dataSize,
      priority: transmission.priority,
      progress: transmission.progress,
    } as TransmissionData)).sort((a, b) => b.priority - a.priority);
  }, [communicationStatus.transmissionQueue]);

  const handleStartTransmission = () => {
    if (!newMessage.trim() && selectedTransmissionType === "message") return;
    
    const transmissionId = `${selectedTransmissionType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    let dataSize = 100;
    let priority = 5;
    
    switch (selectedTransmissionType) {
      case "knowledge_report":
        dataSize = 500;
        priority = 8;
        break;
      case "beacon_data":
        dataSize = 200;
        priority = 6;
        break;
      case "message":
        dataSize = Math.max(50, newMessage.length * 2);
        priority = 4;
        break;
    }

    dispatch(addTransmissionToQueue({
      transmissionId,
      type: selectedTransmissionType,
      title: selectedTransmissionType.replace('_', ' '),
      content: newMessage,
      dataSize,
      priority,
    }));

    if (selectedTransmissionType === "message") {
      setNewMessage("");
    }
  };

  const handleCancelTransmission = (transmissionId: string) => {
    dispatch(cancelTransmission(transmissionId));
  };

  const getEstimatedCompletionTime = (transmission: TransmissionData) => {
    const performance = calculateShipPerformance(state);
    const transmissionSpeed = performance.communication.transmissionSpeed;
    
    return estimateTransmissionTime(
      transmission.dataSize, 
      transmissionSpeed, 
      transmission.priority, 
      communicationStatus.signalStrength, 
      communicationStatus.homeBaseConnection
    );
  };

  const getTransmissionTypeIcon = (type: string) => {
    switch (type) {
      case "knowledge_report": return "📊";
      case "beacon_data": return "📡";
      case "message": return "💬";
      default: return "📤";
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Connection Status Header */}
      <div className="p-4 bg-zinc-900/50 border border-zinc-700/50 rounded-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-emerald-300 font-mono text-sm uppercase tracking-wider">
            Communication Interface
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${communicationStatus.homeBaseConnection ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <span className={`font-mono text-xs ${communicationStatus.homeBaseConnection ? 'text-emerald-300' : 'text-red-300'}`}>
              {communicationStatus.homeBaseConnection ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-zinc-400 font-mono">Signal Strength:</span>
            <span className={`ml-2 font-mono ${communicationStatus.signalStrength > 70 ? 'text-emerald-300' : 
                                                communicationStatus.signalStrength > 30 ? 'text-yellow-300' : 'text-red-300'}`}>
              {communicationStatus.signalStrength.toFixed(1)}%
            </span>
          </div>
          <div>
            <span className="text-zinc-400 font-mono">Queue:</span>
            <span className="ml-2 font-mono text-cyan-300">{transmissionQueue.length}</span>
          </div>
        </div>
      </div>

      {/* New Transmission */}
      <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg">
        <h4 className="text-zinc-200 font-mono text-sm mb-3 uppercase tracking-wider">New Transmission</h4>
        
        <div className="space-y-3">
          <div className="flex space-x-2">
            {(["message", "knowledge_report", "beacon_data"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedTransmissionType(type)}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all duration-200 border rounded ${
                  selectedTransmissionType === type
                    ? 'bg-emerald-900/50 border-emerald-500/50 text-emerald-300'
                    : 'bg-zinc-800/30 border-zinc-700/50 text-zinc-400 hover:border-zinc-600/50 hover:text-zinc-300'
                }`}
              >
                {getTransmissionTypeIcon(type)} {type.replace('_', ' ')}
              </button>
            ))}
          </div>

          {selectedTransmissionType === "message" && (
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter message to home base..."
              className="w-full h-20 bg-zinc-950/50 border border-zinc-700/50 rounded px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 font-mono focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
            />
          )}

          <button
            onClick={handleStartTransmission}
            disabled={!communicationStatus.homeBaseConnection || (selectedTransmissionType === "message" && !newMessage.trim())}
            className="w-full py-2 px-4 bg-emerald-900/30 border border-emerald-500/50 text-emerald-300 font-mono text-sm uppercase tracking-wider rounded transition-all duration-200 hover:bg-emerald-800/40 hover:border-emerald-400/60 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-emerald-900/30"
          >
            Start Transmission
          </button>
        </div>
      </div>

      {/* Transmission Queue */}
      <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg">
        <h4 className="text-zinc-200 font-mono text-sm mb-3 uppercase tracking-wider">Transmission Queue</h4>
        
        {transmissionQueue.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 font-mono text-sm">
            No active transmissions
          </div>
        ) : (
          <div className="space-y-3">
            {transmissionQueue.map((transmission) => (
              <div key={transmission.id} className="p-3 bg-zinc-800/30 border border-zinc-700/30 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTransmissionTypeIcon(transmission.type)}</span>
                    <span className="font-mono text-sm text-zinc-200">{transmission.title}</span>
                    <span className={`px-2 py-0.5 text-xs font-mono rounded ${
                      transmission.priority >= 8 ? 'bg-red-900/50 text-red-300' :
                      transmission.priority >= 6 ? 'bg-yellow-900/50 text-yellow-300' :
                      'bg-blue-900/50 text-blue-300'
                    }`}>
                      PRI {transmission.priority}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCancelTransmission(transmission.id)}
                    className="px-2 py-1 text-xs font-mono text-red-400 border border-red-500/30 rounded hover:bg-red-900/20 hover:border-red-400/50 transition-all duration-200"
                  >
                    CANCEL
                  </button>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-400 font-mono">
                    <span>Progress: {transmission.progress.toFixed(1)}%</span>
                    <span>ETA: {getEstimatedCompletionTime(transmission)}s</span>
                    <span>Size: {transmission.dataSize}KB</span>
                  </div>
                  <div className="w-full bg-zinc-900/50 rounded h-1">
                    <div
                      className="h-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded transition-all duration-300"
                      style={{ width: `${transmission.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 