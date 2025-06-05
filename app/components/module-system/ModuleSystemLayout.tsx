"use client";
import React, { useState } from "react";
import { useAppSelector } from "../../lib/hooks";
import ModuleSystemSidebar from "./ModuleSystemSidebar";
import ModuleDetailsView from "./ModuleDetailsView";

export default function ModuleSystemLayout() {
  const shipSystems = useAppSelector((state) => state.shipSystems);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  return (
    <div className="flex h-full relative overflow-hidden bg-zinc-950">
      {/* 네온 그리드 패턴 */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* 모던 컨테이너 */}
      <div className="flex w-full bg-zinc-900/50 rounded-xl shadow-2xl shadow-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 overflow-hidden relative z-10">
        {/* 사이드바 - 네온 액센트 */}
        <div className="w-1/3 bg-zinc-900/80 border-r border-zinc-700/50 relative">
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-emerald-500/40 to-transparent" />
          <ModuleSystemSidebar
            energy={shipSystems.energy}
            resources={shipSystems.resources}
            modules={shipSystems.installedModules}
            selectedModuleId={selectedModuleId}
            onSelectModule={setSelectedModuleId}
          />
        </div>

        {/* 메인 콘텐츠 - 콤팩트한 디자인 */}
        <div className="flex-1 bg-zinc-950/60 backdrop-blur-sm">
          {selectedModuleId ? (
            <ModuleDetailsView moduleId={selectedModuleId} />
          ) : (
            <div className="flex items-center justify-center h-full p-6">
              <div className="text-center space-y-6">
                {/* 네온 상태 인디케이터 */}
                <div className="w-20 h-20 mx-auto mb-8 relative">
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-pulse" />
                  <div className="absolute inset-3 bg-emerald-500/20 rounded-full animate-pulse delay-75" />
                  <div className="absolute inset-6 bg-emerald-400 rounded-full animate-pulse delay-150 shadow-emerald-400/50 shadow-lg" />
                  <div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-pulse" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl text-zinc-100 font-medium tracking-wide">
                    모듈을 선택하세요
                  </h3>
                  <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
                    좌측 모듈 목록에서 모듈을 선택하여<br />
                    세부 정보를 확인하고 관리할 수 있습니다.
                  </p>
                </div>
                {/* 네온 로딩 인디케이터 */}
                <div className="flex justify-center space-x-2 mt-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce shadow-emerald-400/50 shadow-sm"
                      style={{
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: "1.2s",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 