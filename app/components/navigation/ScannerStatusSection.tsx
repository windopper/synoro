"use client";

import { Zap } from "lucide-react";

export default function ScannerStatusSection() {
  return (
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
            style={{ width: "75%" }}
          />
        </div>

        <div className="text-gray-400 font-mono text-xs">
          Scanning for anomalies and jump signatures...
        </div>
      </div>
    </div>
  );
} 