"use client";
import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { startResearch } from "../../lib/features/shipSystemsSlice";
import { 
  ResearchCategory, 
  ResearchStatus,
  ALL_RESEARCH_TECHS,
  getResearchById,
  canResearch,
  buildResearchTree,
  ResearchTech
} from "../../data/researchTechs";

export default function ResearchCenter() {
  const dispatch = useAppDispatch();
  const resources = useAppSelector(s => s.shipSystems.resources.inventory);
  const researchPoints = useAppSelector(s => s.shipSystems.researchPoints || 0);
  const completedResearch = useAppSelector(s => s.shipSystems.completedResearch || []);
  const currentResearch = useAppSelector(s => s.shipSystems.currentResearch || null);
  
  const [selectedCategory, setSelectedCategory] = useState<ResearchCategory | null>(null);
  const [selectedTech, setSelectedTech] = useState<ResearchTech | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');

  // 연구 상태 계산
  const getResearchStatus = (tech: ResearchTech): ResearchStatus => {
    if (completedResearch.includes(tech.id)) {
      return ResearchStatus.COMPLETED;
    }
    if (currentResearch?.techId === tech.id) {
      return ResearchStatus.IN_PROGRESS;
    }
    if (canResearch(tech.id, completedResearch)) {
      return ResearchStatus.AVAILABLE;
    }
    return ResearchStatus.LOCKED;
  };

  const getCategoryIcon = (category: ResearchCategory) => {
    switch (category) {
      case ResearchCategory.ENGINEERING: return "🔧";
      case ResearchCategory.PHYSICS: return "⚛️";
      case ResearchCategory.MATERIALS: return "🧪";
      case ResearchCategory.COMPUTER: return "💻";
      case ResearchCategory.BIOLOGY: return "🧬";
      case ResearchCategory.ENERGY: return "⚡";
      default: return "🔬";
    }
  };

  const getCategoryName = (category: ResearchCategory) => {
    switch (category) {
      case ResearchCategory.ENGINEERING: return "공학 기술";
      case ResearchCategory.PHYSICS: return "물리학";
      case ResearchCategory.MATERIALS: return "재료 과학";
      case ResearchCategory.COMPUTER: return "컴퓨터 과학";
      case ResearchCategory.BIOLOGY: return "생명 과학";
      case ResearchCategory.ENERGY: return "에너지 기술";
      default: return "기타";
    }
  };

  const getTierName = (tier: number) => {
    switch (tier) {
      case 0: return "기초";
      case 1: return "발전";
      case 2: return "고급";
      case 3: return "최첨단";
      case 4: return "실험적";
      case 5: return "이론적";
      default: return `티어 ${tier}`;
    }
  };

  const getStatusColor = (status: ResearchStatus) => {
    switch (status) {
      case ResearchStatus.COMPLETED: return "text-green-400 border-green-500";
      case ResearchStatus.IN_PROGRESS: return "text-blue-400 border-blue-500";
      case ResearchStatus.AVAILABLE: return "text-yellow-400 border-yellow-500";
      case ResearchStatus.LOCKED: return "text-gray-500 border-gray-600";
    }
  };

  const getStatusIcon = (status: ResearchStatus) => {
    switch (status) {
      case ResearchStatus.COMPLETED: return "✅";
      case ResearchStatus.IN_PROGRESS: return "🔄";
      case ResearchStatus.AVAILABLE: return "🔬";
      case ResearchStatus.LOCKED: return "🔒";
    }
  };

  const canStartResearch = (tech: ResearchTech) => {
    const status = getResearchStatus(tech);
    if (status !== ResearchStatus.AVAILABLE) return false;
    if (currentResearch) return false; // 이미 다른 연구 진행 중
    if (researchPoints < tech.cost.researchPoints) return false;
    
    // 필요 자원 확인
    if (tech.cost.requiredResources) {
      return Object.entries(tech.cost.requiredResources).every(
        ([resource, required]) => (resources[resource] || 0) >= required
      );
    }
    
    return true;
  };

  const handleStartResearch = async (tech: ResearchTech) => {
    if (!canStartResearch(tech)) {
      alert("연구를 시작할 수 없습니다. 조건을 확인해주세요.");
      return;
    }

    try {
      dispatch(startResearch({ techId: tech.id, totalPoints: tech.cost.researchPoints }));
      alert(`${tech.nameKo} 연구를 시작했습니다!`);
      setSelectedTech(null);
      setShowDetails(false);
    } catch (error) {
      alert(`연구 시작에 실패했습니다: ${error}`);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  const filteredTechs = selectedCategory 
    ? ALL_RESEARCH_TECHS.filter(tech => tech.category === selectedCategory)
    : ALL_RESEARCH_TECHS;

  const researchTree = buildResearchTree();

  return (
    <div className="p-6 text-white h-full">
      <div className="max-w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-purple-400">
            🔬 연구 센터
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-400">연구 포인트:</span>
              <span className="ml-2 text-purple-400 font-bold">{researchPoints} RP</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-xs rounded ${
                  viewMode === 'list' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                목록
              </button>
              <button
                onClick={() => setViewMode('tree')}
                className={`px-3 py-1 text-xs rounded ${
                  viewMode === 'tree' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                트리
              </button>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-300 text-sm">
            새로운 기술을 연구하여 고급 모듈과 기능을 해금하세요.
          </p>
        </div>

        {/* 현재 진행 중인 연구 */}
        {currentResearch && (
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-blue-400">진행 중인 연구</h3>
              <span className="text-blue-300 text-sm">
                {Math.round((currentResearch.currentPoints / currentResearch.totalPoints) * 100)}%
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <div className="text-sm text-gray-300">
                  {getResearchById(currentResearch.techId)?.nameKo}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(currentResearch.currentPoints / currentResearch.totalPoints) * 100}%` 
                    }}
                  />
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {currentResearch.currentPoints}/{currentResearch.totalPoints} RP
              </div>
            </div>
          </div>
        )}

        {/* 카테고리 선택 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">연구 분야</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-3 rounded-lg border transition-all ${
                selectedCategory === null
                  ? "bg-purple-600 border-purple-500 text-white"
                  : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <div className="text-xl mb-1">🌟</div>
              <div className="text-xs font-medium">전체</div>
            </button>
            {Object.values(ResearchCategory).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedCategory === category
                    ? "bg-purple-600 border-purple-500 text-white"
                    : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <div className="text-xl mb-1">{getCategoryIcon(category)}</div>
                <div className="text-xs font-medium">{getCategoryName(category)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 연구 목록/트리 */}
        {viewMode === 'list' ? (
          // 목록 보기
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTechs.map(tech => {
              const status = getResearchStatus(tech);
              const canStart = canStartResearch(tech);

              return (
                <div 
                  key={tech.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    getStatusColor(status)} bg-gray-800/50 hover:bg-gray-700/50`
                  }
                  onClick={() => {
                    setSelectedTech(tech);
                    setShowDetails(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{getCategoryIcon(tech.category)}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        tech.tier === 0 ? "bg-gray-600" :
                        tech.tier === 1 ? "bg-blue-600" :
                        tech.tier === 2 ? "bg-purple-600" : "bg-red-600"
                      }`}>
                        {getTierName(tech.tier)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getStatusIcon(status)}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{tech.nameKo}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {tech.description}
                  </p>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-400">연구 비용:</span>
                      <span className="ml-2 text-purple-400">{tech.cost.researchPoints} RP</span>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-400">소요 시간:</span>
                      <span className="ml-2 text-blue-400">{formatTime(tech.cost.timeRequired)}</span>
                    </div>

                    {tech.cost.requiredResources && (
                      <div className="text-sm">
                        <span className="text-gray-400">필요 자원:</span>
                        <div className="mt-1 space-y-1">
                          {Object.entries(tech.cost.requiredResources).map(([resource, required]) => {
                            const available = resources[resource] || 0;
                            const sufficient = available >= required;
                            
                            return (
                              <div key={resource} className={`flex justify-between text-xs ${
                                sufficient ? "text-green-400" : "text-red-400"
                              }`}>
                                <span>{resource}</span>
                                <span>{available}/{required}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {tech.prerequisites.length > 0 && (
                      <div className="text-sm">
                        <span className="text-gray-400">선행 연구:</span>
                        <div className="text-xs text-gray-500 mt-1">
                          {tech.prerequisites.map(prereq => {
                            const prereqTech = getResearchById(prereq);
                            const isCompleted = completedResearch.includes(prereq);
                            return (
                              <div key={prereq} className={`${
                                isCompleted ? "text-green-400" : "text-red-400"
                              }`}>
                                {isCompleted ? "✓" : "✗"} {prereqTech?.nameKo || prereq}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartResearch(tech);
                    }}
                    disabled={!canStart}
                    className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-all ${
                      canStart
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {status === ResearchStatus.COMPLETED ? "완료됨" :
                     status === ResearchStatus.IN_PROGRESS ? "진행 중" :
                     status === ResearchStatus.LOCKED ? "잠김" :
                     canStart ? "연구 시작" : "조건 미충족"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          // 트리 보기
          <div className="space-y-6">
            {Array.from(researchTree.entries()).map(([tier, techs]) => (
              <div key={tier} className="border border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-purple-400">
                  {getTierName(tier)} 연구
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {techs
                    .filter(tech => !selectedCategory || tech.category === selectedCategory)
                    .map(tech => {
                      const status = getResearchStatus(tech);
                      return (
                        <div 
                          key={tech.id}
                          className={`p-3 rounded border text-center cursor-pointer transition-all ${
                            getStatusColor(status)
                          } bg-gray-800/30 hover:bg-gray-700/50`}
                          onClick={() => {
                            setSelectedTech(tech);
                            setShowDetails(true);
                          }}
                        >
                          <div className="text-lg mb-1">{getCategoryIcon(tech.category)}</div>
                          <div className="text-sm font-medium">{tech.nameKo}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {tech.cost.researchPoints} RP
                          </div>
                          <div className="text-lg mt-1">{getStatusIcon(status)}</div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTechs.length === 0 && (
          <div className="col-span-full text-center py-8">
            <div className="text-4xl mb-3">🔬</div>
            <h3 className="text-lg font-semibold mb-2">연구할 수 있는 기술이 없습니다</h3>
            <p className="text-gray-400">
              {selectedCategory 
                ? `${getCategoryName(selectedCategory)} 분야에 연구 가능한 기술이 없습니다.`
                : "모든 기술이 완료되었거나 조건을 충족하지 않습니다."
              }
            </p>
          </div>
        )}

        {/* 연구 상세 정보 모달 */}
        {showDetails && selectedTech && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg border border-gray-600 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedTech.nameKo}</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">기본 정보</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">영문명:</span>
                        <span className="ml-2">{selectedTech.nameEn}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">티어:</span>
                        <span className="ml-2">{getTierName(selectedTech.tier)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">분야:</span>
                        <span className="ml-2">{getCategoryName(selectedTech.category)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">상태:</span>
                        <span className="ml-2">{getStatusIcon(getResearchStatus(selectedTech))}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">설명</h3>
                    <p className="text-gray-300 mb-2">{selectedTech.description}</p>
                    <p className="text-gray-400 text-sm">{selectedTech.detailedDescription}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">연구 비용</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">연구 포인트:</span>
                        <span className="text-purple-400">{selectedTech.cost.researchPoints} RP</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">소요 시간:</span>
                        <span className="text-blue-400">{formatTime(selectedTech.cost.timeRequired)}</span>
                      </div>
                    </div>
                  </div>

                  {selectedTech.cost.requiredResources && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">필요 자원</h3>
                      <div className="space-y-2">
                        {Object.entries(selectedTech.cost.requiredResources).map(([resource, required]) => {
                          const available = resources[resource] || 0;
                          const sufficient = available >= required;
                          
                          return (
                            <div key={resource} className={`flex justify-between p-2 rounded ${
                              sufficient ? "bg-green-900" : "bg-red-900"
                            }`}>
                              <span>{resource}</span>
                              <span className={sufficient ? "text-green-400" : "text-red-400"}>
                                {available}/{required}
                                {!sufficient && ` (부족: ${required - available})`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedTech.prerequisites.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">선행 연구</h3>
                      <div className="space-y-1">
                        {selectedTech.prerequisites.map(prereq => {
                          const prereqTech = getResearchById(prereq);
                          const isCompleted = completedResearch.includes(prereq);
                          return (
                            <div key={prereq} className={`p-2 rounded ${
                              isCompleted ? "bg-green-900" : "bg-red-900"
                            }`}>
                              <span className={isCompleted ? "text-green-400" : "text-red-400"}>
                                {isCompleted ? "✓" : "✗"} {prereqTech?.nameKo || prereq}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold mb-2">연구 효과</h3>
                    <div className="space-y-1">
                      {selectedTech.effects.map((effect, index) => (
                        <div key={index} className="text-green-400 text-sm">
                          • {effect}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">해금 요소</h3>
                    <div className="space-y-1">
                      {selectedTech.unlocks.map((unlock, index) => (
                        <div key={index} className="text-yellow-400 text-sm">
                          🔓 {unlock}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={() => handleStartResearch(selectedTech)}
                      disabled={!canStartResearch(selectedTech)}
                      className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                        canStartResearch(selectedTech)
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-gray-700 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {getResearchStatus(selectedTech) === ResearchStatus.COMPLETED ? "완료됨" :
                       getResearchStatus(selectedTech) === ResearchStatus.IN_PROGRESS ? "진행 중" :
                       getResearchStatus(selectedTech) === ResearchStatus.LOCKED ? "잠김" :
                       canStartResearch(selectedTech) ? "연구 시작" : "조건 미충족"}
                    </button>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="flex-1 py-3 px-6 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 