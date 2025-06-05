import React from "react";

interface ResourceSummaryProps {
  requiredResources: Map<
    string,
    { total: number; available: number; modules: string[] }
  >;
}

export function ResourceSummary({ requiredResources }: ResourceSummaryProps) {
  const totalTypes = requiredResources.size;
  const sufficient = Array.from(requiredResources.values()).filter(
    (r) => r.available >= r.total
  ).length;
  const insufficient = totalTypes - sufficient;
  const criticalResources = Array.from(requiredResources.entries())
    .filter(([_, data]) => data.available < data.total)
    .sort(([_, a], [__, b]) => b.total - b.available - (a.total - a.available))
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Summary */}
      <div className="bg-zinc-900/70 backdrop-blur-sm p-5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-lg">📊</span>
          </div>
          <div>
            <h3 className="font-mono text-zinc-200 font-semibold text-sm uppercase tracking-wider">
              자원 현황
            </h3>
            <p className="text-xs text-zinc-500 font-mono">Resource Status</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 font-mono text-sm">
              총 필요 자원
            </span>
            <span className="text-blue-400 font-mono font-bold text-lg">
              {totalTypes}
            </span>
          </div>
          <div className="h-px bg-zinc-800"></div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 font-mono text-sm">충분한 자원</span>
            <span className="text-emerald-400 font-mono font-bold">
              {sufficient}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 font-mono text-sm">부족한 자원</span>
            <span className="text-red-400 font-mono font-bold">
              {insufficient}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="bg-zinc-900/70 backdrop-blur-sm p-5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-lg">📈</span>
          </div>
          <div>
            <h3 className="font-mono text-zinc-200 font-semibold text-sm uppercase tracking-wider">
              진행률
            </h3>
            <p className="text-xs text-zinc-500 font-mono">Progress</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-zinc-400 font-mono text-sm">완료도</span>
            <span className="text-cyan-400 font-mono font-bold">
              {totalTypes ? Math.round((sufficient / totalTypes) * 100) : 0}%
            </span>
          </div>

          <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-700 shadow-lg shadow-cyan-500/20"
              style={{
                width: `${totalTypes ? (sufficient / totalTypes) * 100 : 0}%`,
              }}
            />
          </div>

          <div className="text-xs text-zinc-500 font-mono text-center">
            {sufficient}/{totalTypes} 자원 준비 완료
          </div>
        </div>
      </div>

      {/* Critical Resources */}
      <div className="bg-zinc-900/70 backdrop-blur-sm p-5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-lg">⚠️</span>
          </div>
          <div>
            <h3 className="font-mono text-zinc-200 font-semibold text-sm uppercase tracking-wider">
              우선 필요
            </h3>
            <p className="text-xs text-zinc-500 font-mono">Priority Needed</p>
          </div>
        </div>

        <div className="space-y-2">
          {criticalResources.length > 0 ? (
            criticalResources.map(([resource, data]) => (
              <div
                key={resource}
                className="flex justify-between items-center py-1"
              >
                <span className="text-zinc-300 font-mono text-sm truncate flex-1 mr-2">
                  {resource}
                </span>
                <span className="text-red-400 font-mono font-bold text-sm bg-red-500/10 px-2 py-1 rounded">
                  -{data.total - data.available}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <div className="text-emerald-400 font-mono text-sm">
                ✅ 모든 자원 충분
              </div>
              <div className="text-xs text-zinc-500 font-mono mt-1">
                All resources available
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
