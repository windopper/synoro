"use client";
import React, { useState, useMemo } from "react";
import { useAppSelector } from "../../lib/hooks";

interface TransmissionHistoryData {
  id: string;
  type: string;
  title: string;
  content: string;
  dataSize: number;
  priority: number;
  progress: number;
  endTime: number;
  result: "fulfilled" | "rejected" | "cancelled";
}

export default function CommunicationHistory() {
  const transmissionHistory = useAppSelector((state) => state.shipSystems.communicationStatus.transmissionHistory);
  const [filterType, setFilterType] = useState<"all" | "fulfilled" | "cancelled" | "rejected">("all");
  const [sortBy, setSortBy] = useState<"endTime" | "priority" | "dataSize">("endTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // 이력을 배열로 변환하고 필터링/정렬
  const filteredHistory = useMemo(() => {
    let history = Object.entries(transmissionHistory).map(([id, transmission]) => ({
      id,
      ...transmission,
    } as TransmissionHistoryData));

    // 필터링
    if (filterType !== "all") {
      history = history.filter(item => item.result === filterType);
    }

    // 정렬
    history.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return history;
  }, [transmissionHistory, filterType, sortBy, sortOrder]);

  const getTransmissionTypeIcon = (type: string) => {
    switch (type) {
      case "knowledge_report": return "📊";
      case "beacon_data": return "📡";
      case "message": return "💬";
      default: return "📤";
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case "fulfilled": return "✅";
      case "cancelled": return "❌";
      case "rejected": return "⚠️";
      default: return "❓";
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "fulfilled": return "text-emerald-300";
      case "cancelled": return "text-red-300";
      case "rejected": return "text-yellow-300";
      default: return "text-zinc-400";
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return "text-red-300 bg-red-900/50";
    if (priority >= 6) return "text-yellow-300 bg-yellow-900/50";
    if (priority >= 4) return "text-blue-300 bg-blue-900/50";
    return "text-zinc-300 bg-zinc-800/50";
  };

  const toggleExpanded = (transmissionId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(transmissionId)) {
      newExpanded.delete(transmissionId);
    } else {
      newExpanded.add(transmissionId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="space-y-4">
      {/* 헤더 및 필터 */}
      <div className="p-4 bg-zinc-900/50 border border-zinc-700/50 rounded-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-emerald-300 font-mono text-sm uppercase tracking-wider">
            Communication History
          </h3>
          <span className="text-zinc-400 font-mono text-xs">
            {filteredHistory.length} records
          </span>
        </div>

        {/* 필터 및 정렬 컨트롤 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 결과 필터 */}
          <div>
            <label className="block text-zinc-400 font-mono text-xs mb-1">Filter by Result</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full bg-zinc-950/50 border border-zinc-700/50 rounded px-2 py-1 text-sm text-zinc-200 font-mono focus:outline-none focus:border-emerald-500/50"
            >
              <option value="all">All Results</option>
              <option value="fulfilled">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Failed</option>
            </select>
          </div>

          {/* 정렬 기준 */}
          <div>
            <label className="block text-zinc-400 font-mono text-xs mb-1">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-zinc-950/50 border border-zinc-700/50 rounded px-2 py-1 text-sm text-zinc-200 font-mono focus:outline-none focus:border-emerald-500/50"
            >
              <option value="endTime">Time</option>
              <option value="priority">Priority</option>
              <option value="dataSize">Size</option>
            </select>
          </div>

          {/* 정렬 순서 */}
          <div>
            <label className="block text-zinc-400 font-mono text-xs mb-1">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full bg-zinc-950/50 border border-zinc-700/50 rounded px-2 py-1 text-sm text-zinc-200 font-mono focus:outline-none focus:border-emerald-500/50"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* 이력 목록 */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-lg text-center">
            <div className="text-zinc-500 font-mono text-sm mb-2">📭</div>
            <div className="text-zinc-500 font-mono text-sm">
              {filterType === "all" ? "No transmission history" : `No ${filterType} transmissions`}
            </div>
          </div>
        ) : (
          filteredHistory.map((transmission) => {
            const isExpanded = expandedItems.has(transmission.id);
            return (
              <div key={transmission.id} className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg hover:bg-zinc-800/40 transition-all duration-200">
                {/* 클릭 가능한 컴팩트 헤더 */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpanded(transmission.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getTransmissionTypeIcon(transmission.type)}</span>
                        <span className="font-mono text-sm text-zinc-200">{transmission.title}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-mono rounded ${getPriorityColor(transmission.priority)}`}>
                        PRI {transmission.priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`flex items-center space-x-1 ${getResultColor(transmission.result)}`}>
                        <span className="text-xs">{getResultIcon(transmission.result)}</span>
                        <span className="font-mono text-xs uppercase">{transmission.result}</span>
                      </span>
                      <span className="text-zinc-400 font-mono text-xs">
                        {formatTime(transmission.endTime)}
                      </span>
                      <span className="text-zinc-500 font-mono text-xs ml-2">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {/* 컴팩트 진행도 바 */}
                  <div className="mt-2">
                    <div className="w-full bg-zinc-900/50 rounded h-1">
                      <div
                        className={`h-1 rounded transition-all duration-300 ${
                          transmission.result === "fulfilled" 
                            ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
                            : transmission.result === "cancelled"
                            ? "bg-gradient-to-r from-red-600 to-red-400"
                            : "bg-gradient-to-r from-yellow-600 to-yellow-400"
                        }`}
                        style={{ width: `${transmission.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 확장된 상세 정보 */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-zinc-700/30">
                    {/* 상세 메타데이터 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pt-4">
                      <div>
                        <div className="text-zinc-400 font-mono text-xs mb-1">Progress</div>
                        <div className="text-zinc-200 font-mono text-sm">{transmission.progress.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-zinc-400 font-mono text-xs mb-1">Data Size</div>
                        <div className="text-zinc-200 font-mono text-sm">{transmission.dataSize}KB</div>
                      </div>
                      <div>
                        <div className="text-zinc-400 font-mono text-xs mb-1">Priority</div>
                        <div className="text-zinc-200 font-mono text-sm">Level {transmission.priority}</div>
                      </div>
                      <div>
                        <div className="text-zinc-400 font-mono text-xs mb-1">Completed</div>
                        <div className="text-zinc-200 font-mono text-sm">
                          {new Date(transmission.endTime).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* 전송 내용 */}
                    {transmission.content && (
                      <div className="p-3 bg-zinc-950/50 rounded border border-zinc-700/30">
                        <div className="text-zinc-400 font-mono text-xs mb-2">Message Content:</div>
                        <div className="text-zinc-200 font-mono text-sm break-words leading-relaxed">
                          {transmission.content}
                        </div>
                      </div>
                    )}

                    {/* 전송 타입별 추가 정보 */}
                    <div className="mt-4 p-3 bg-zinc-800/30 rounded border border-zinc-700/30">
                      <div className="text-zinc-400 font-mono text-xs mb-2">Transmission Details:</div>
                      <div className="text-zinc-300 font-mono text-sm">
                        <div>Type: {transmission.type.replace('_', ' ').toUpperCase()}</div>
                        <div>Status: {transmission.result.toUpperCase()}</div>
                        <div>
                          Transmission ID: 
                          <span className="text-zinc-500 ml-2 text-xs">
                            {transmission.id.substring(0, 16)}...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 요약 통계 */}
      {filteredHistory.length > 0 && (
        <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg">
          <h4 className="text-zinc-200 font-mono text-sm mb-3 uppercase tracking-wider">Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-emerald-300 font-mono text-lg">
                {filteredHistory.filter(t => t.result === "fulfilled").length}
              </div>
              <div className="text-zinc-400 font-mono text-xs">Completed</div>
            </div>
            <div>
              <div className="text-red-300 font-mono text-lg">
                {filteredHistory.filter(t => t.result === "cancelled").length}
              </div>
              <div className="text-zinc-400 font-mono text-xs">Cancelled</div>
            </div>
            <div>
              <div className="text-yellow-300 font-mono text-lg">
                {filteredHistory.filter(t => t.result === "rejected").length}
              </div>
              <div className="text-zinc-400 font-mono text-xs">Failed</div>
            </div>
            <div>
              <div className="text-cyan-300 font-mono text-lg">
                {filteredHistory.reduce((sum, t) => sum + t.dataSize, 0)}KB
              </div>
              <div className="text-zinc-400 font-mono text-xs">Total Data</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 