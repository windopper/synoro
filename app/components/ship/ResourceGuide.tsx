"use client";
import React, { useState } from "react";
import { useAppSelector } from "../../lib/hooks";
import { getModuleById, getNextTierModule } from "../../data/shipModules";
import { 
  RESOURCE_DATABASE, 
  ResourceCategory, 
  ResourceRarity,
  getResourceByName 
} from "../../data/resourceTypes";
import {
  ALL_MANUFACTURING_RESOURCES,
  ManufacturingCategory,
  ManufacturingDifficulty,
  getManufacturingResourceByName,
  getManufacturingResourcesByCategory,
  MANUFACTURING_BY_CATEGORY
} from "../../data/manufacturingResources";

export default function ResourceGuide() {
  const installedModules = useAppSelector(s => s.shipSystems.installedModules);
  const resources = useAppSelector(s => s.shipSystems.resources.inventory);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'needed' | 'stellar' | 'manufacturing'>('needed');

  // 모든 업그레이드에 필요한 자원들 수집
  const requiredResources = new Map<string, { total: number; available: number; modules: string[] }>();
  
  Object.entries(installedModules).forEach(([moduleId, module]) => {
    const nextInfo = getNextTierModule(moduleId);
    if (!nextInfo) return;
    
    Object.entries(nextInfo.requiredResources).forEach(([resource, amount]) => {
      const current = requiredResources.get(resource) || { total: 0, available: resources[resource] || 0, modules: [] };
      current.total += amount;
      current.modules.push(moduleId);
      requiredResources.set(resource, current);
    });
  });

  const getDifficultyColor = (difficulty: ManufacturingDifficulty | string) => {
    switch (difficulty) {
      case ManufacturingDifficulty.EASY:
      case 'easy': 
        return 'text-green-400';
      case ManufacturingDifficulty.MEDIUM:
      case 'medium': 
        return 'text-yellow-400';
      case ManufacturingDifficulty.HARD:
      case 'hard': 
        return 'text-red-400';
      case ManufacturingDifficulty.EXTREME:
        return 'text-purple-400';
      default: 
        return 'text-gray-400';
    }
  };

  const getDifficultyLabel = (difficulty: ManufacturingDifficulty | string) => {
    switch (difficulty) {
      case ManufacturingDifficulty.EASY:
      case 'easy': 
        return '쉬움';
      case ManufacturingDifficulty.MEDIUM:
      case 'medium': 
        return '보통';
      case ManufacturingDifficulty.HARD:
      case 'hard': 
        return '어려움';
      case ManufacturingDifficulty.EXTREME:
        return '극도로 어려움';
      default: 
        return '알 수 없음';
    }
  };

  // 자원 정보 가져오기 함수
  const getResourceInfo = (resourceName: string) => {
    // 먼저 제조 자원에서 찾기
    const manufacturingInfo = getManufacturingResourceByName(resourceName);
    if (manufacturingInfo) {
      return {
        ...manufacturingInfo,
        type: 'manufacturing' as const,
        rarity: manufacturingInfo.category === ManufacturingCategory.BASIC ? '기본' : 
                manufacturingInfo.category === ManufacturingCategory.PROCESSED ? '가공' :
                manufacturingInfo.category === ManufacturingCategory.ADVANCED ? '고급' : 
                manufacturingInfo.category === ManufacturingCategory.COMPONENTS ? '부품' : '특수'
      };
    }
    
    // 항성 자원에서 찾기
    const stellarInfo = getResourceByName(resourceName);
    if (stellarInfo) {
      return {
        ...stellarInfo,
        type: 'stellar' as const,
        sources: ['항성 채굴'],
        difficulty: stellarInfo.rarity === ResourceRarity.COMMON ? 'easy' :
                   stellarInfo.rarity === ResourceRarity.UNCOMMON ? 'easy' :
                   stellarInfo.rarity === ResourceRarity.RARE ? 'medium' :
                   stellarInfo.rarity === ResourceRarity.VERY_RARE ? 'hard' : 'hard',
        rarity: stellarInfo.rarity === ResourceRarity.COMMON ? '일반' :
                stellarInfo.rarity === ResourceRarity.UNCOMMON ? '비일반' :
                stellarInfo.rarity === ResourceRarity.RARE ? '희귀' :
                stellarInfo.rarity === ResourceRarity.VERY_RARE ? '매우 희귀' :
                stellarInfo.rarity === ResourceRarity.LEGENDARY ? '전설급' : '고유'
      };
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-700/50 pb-4">
        <h2 className="text-xl font-mono text-gray-100 tracking-wide flex items-center space-x-3">
          <div className="w-2 h-2 bg-cyan-400 animate-pulse rounded-full" />
          <span>자원 시스템 가이드</span>
        </h2>
        <p className="text-sm font-mono text-gray-400 mt-2">
          모든 자원의 획득 방법과 활용 정보를 확인하세요
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-gray-800/40 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('needed')}
          className={`flex-1 px-4 py-2 rounded-md font-mono text-sm transition-colors ${
            activeTab === 'needed' 
              ? 'bg-cyan-600 text-white' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          필요 자원
        </button>
        <button
          onClick={() => setActiveTab('stellar')}
          className={`flex-1 px-4 py-2 rounded-md font-mono text-sm transition-colors ${
            activeTab === 'stellar' 
              ? 'bg-cyan-600 text-white' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          항성 자원
        </button>
        <button
          onClick={() => setActiveTab('manufacturing')}
          className={`flex-1 px-4 py-2 rounded-md font-mono text-sm transition-colors ${
            activeTab === 'manufacturing' 
              ? 'bg-cyan-600 text-white' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          제조 자원
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'needed' && (
        <>
          {/* Resource Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/40 p-4 rounded border border-gray-700/30">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-blue-400">📊</span>
                <span className="text-sm font-mono text-gray-200 uppercase tracking-wider">Resource Status</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-gray-400">총 필요 자원 종류</span>
                  <span className="text-blue-300">{requiredResources.size}</span>
                </div>
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-gray-400">충분한 자원</span>
                  <span className="text-green-300">
                    {Array.from(requiredResources.values()).filter(r => r.available >= r.total).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-gray-400">부족한 자원</span>
                  <span className="text-red-300">
                    {Array.from(requiredResources.values()).filter(r => r.available < r.total).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/40 p-4 rounded border border-gray-700/30">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-orange-400">🎯</span>
                <span className="text-sm font-mono text-gray-200 uppercase tracking-wider">Priority Resources</span>
              </div>
              <div className="space-y-1">
                {Array.from(requiredResources.entries())
                  .filter(([_, data]) => data.available < data.total)
                  .slice(0, 3)
                  .map(([resource, data]) => (
                    <div key={resource} className="flex justify-between text-sm font-mono">
                      <span className="text-gray-300">{resource}</span>
                      <span className="text-red-400">-{data.total - data.available}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Resource List */}
          <div className="space-y-4">
            <h3 className="text-lg font-mono text-gray-200 tracking-wide">
              필요 자원 목록
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Array.from(requiredResources.entries()).map(([resource, data]) => {
                const resourceInfo = getResourceInfo(resource);
                const isDeficient = data.available < data.total;
                
                return (
                  <div 
                    key={resource}
                    className={`bg-gray-800/40 p-4 rounded border cursor-pointer transition-all duration-300 ${
                      selectedResource === resource 
                        ? 'border-cyan-500/50 bg-cyan-900/20' 
                        : isDeficient 
                          ? 'border-red-500/30 hover:border-red-500/50'
                          : 'border-green-500/30 hover:border-green-500/50'
                    }`}
                    onClick={() => setSelectedResource(selectedResource === resource ? null : resource)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-mono text-gray-100">{resource}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className={`text-sm font-mono ${isDeficient ? 'text-red-400' : 'text-green-400'}`}>
                            {data.available}/{data.total}
                          </span>
                          {resourceInfo && (
                            <span className={`text-xs px-2 py-1 rounded font-mono ${getDifficultyColor(resourceInfo.difficulty)}`}>
                              {getDifficultyLabel(resourceInfo.difficulty)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className={`text-xs px-3 py-1 rounded font-mono uppercase tracking-wider ${
                        isDeficient 
                          ? 'bg-red-600/30 text-red-300 border border-red-500/30'
                          : 'bg-green-600/30 text-green-300 border border-green-500/30'
                      }`}>
                        {isDeficient ? 'Needed' : 'Ready'}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-700/60 rounded overflow-hidden mb-3">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          isDeficient ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((data.available / data.total) * 100, 100)}%` }}
                      />
                    </div>

                    {/* Resource Info */}
                    {resourceInfo && selectedResource === resource && (
                      <div className="mt-4 p-3 bg-gray-700/30 rounded border border-gray-600/30">
                        <p className="text-sm font-mono text-gray-300 mb-3">{resourceInfo.description}</p>
                        
                        {/* Type indicator */}
                        <div className="mb-3">
                          <span className={`text-xs px-2 py-1 rounded font-mono uppercase tracking-wider ${
                            resourceInfo.type === 'stellar' ? 'bg-yellow-600/30 text-yellow-300' : 'bg-blue-600/30 text-blue-300'
                          }`}>
                            {resourceInfo.type === 'stellar' ? '항성 자원' : '제조 자원'}
                          </span>
                        </div>
                        
                        {/* Sources */}
                        <div className="mb-3">
                          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">획득 방법</div>
                          <div className="space-y-1">
                            {resourceInfo.sources.map((source: string, index: number) => (
                              <div key={index} className="text-sm font-mono text-cyan-300">• {source}</div>
                            ))}
                          </div>
                        </div>

                        {/* Requirements for manufacturing resources */}
                        {resourceInfo.type === 'manufacturing' && (resourceInfo.requiredFacilities || resourceInfo.requiredTech) && (
                          <div className="mb-3">
                            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">필요 조건</div>
                            {resourceInfo.requiredFacilities && (
                              <div className="mb-1">
                                <span className="text-xs font-mono text-yellow-400">시설: </span>
                                <span className="text-sm font-mono text-gray-300">
                                  {resourceInfo.requiredFacilities.join(', ')}
                                </span>
                              </div>
                            )}
                            {resourceInfo.requiredTech && (
                              <div>
                                <span className="text-xs font-mono text-yellow-400">기술: </span>
                                <span className="text-sm font-mono text-gray-300">{resourceInfo.requiredTech.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Stellar resource info */}
                        {resourceInfo.type === 'stellar' && (
                          <div className="mb-3">
                            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">항성 조건</div>
                            <div className="text-sm font-mono text-gray-300">
                              분광형: {resourceInfo.stellarConditions?.spectralClasses.join(', ')}
                            </div>
                            <div className="text-sm font-mono text-gray-300">
                              기본 확률: {resourceInfo.baseProbability}%
                            </div>
                          </div>
                        )}

                        {/* Used by modules */}
                        <div className="mt-3">
                          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">필요한 모듈</div>
                          <div className="flex flex-wrap gap-1">
                            {data.modules.slice(0, 3).map(moduleId => {
                              const moduleInfo = getModuleById(moduleId);
                              return (
                                <span key={moduleId} className="text-xs px-2 py-1 bg-purple-600/30 rounded font-mono text-purple-200">
                                  {moduleInfo?.nameKo || moduleId}
                                </span>
                              );
                            })}
                            {data.modules.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-600/30 rounded font-mono text-gray-400">
                                +{data.modules.length - 3}개 더
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {requiredResources.size === 0 && (
              <div className="bg-gray-800/40 p-6 rounded border border-gray-700/30 text-center">
                <div className="text-gray-400 font-mono">업그레이드에 필요한 자원이 없습니다</div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Stellar Resources Tab */}
      {activeTab === 'stellar' && (
        <div className="space-y-4">
          <h3 className="text-lg font-mono text-gray-200 tracking-wide">
            항성 자원 도감
          </h3>
          <p className="text-sm font-mono text-gray-400">
            항성에서 채굴할 수 있는 특수 자원들입니다. 각 자원은 특정 항성 타입에서만 생성됩니다.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {Object.values(RESOURCE_DATABASE).map(resource => (
              <div 
                key={resource.id}
                className="bg-gray-800/40 p-4 rounded border border-gray-700/30 hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-mono text-gray-100">{resource.nameKo}</h4>
                    <p className="text-xs font-mono text-gray-400">{resource.nameEn}</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded font-mono ${
                    resource.rarity === ResourceRarity.COMMON ? 'bg-gray-600/30 text-gray-300' :
                    resource.rarity === ResourceRarity.UNCOMMON ? 'bg-green-600/30 text-green-300' :
                    resource.rarity === ResourceRarity.RARE ? 'bg-blue-600/30 text-blue-300' :
                    resource.rarity === ResourceRarity.VERY_RARE ? 'bg-purple-600/30 text-purple-300' :
                    resource.rarity === ResourceRarity.LEGENDARY ? 'bg-yellow-600/30 text-yellow-300' :
                    'bg-red-600/30 text-red-300'
                  }`}>
                    {resource.rarity === ResourceRarity.COMMON ? '일반' :
                     resource.rarity === ResourceRarity.UNCOMMON ? '비일반' :
                     resource.rarity === ResourceRarity.RARE ? '희귀' :
                     resource.rarity === ResourceRarity.VERY_RARE ? '매우 희귀' :
                     resource.rarity === ResourceRarity.LEGENDARY ? '전설급' : '고유'}
                  </div>
                </div>

                <p className="text-sm font-mono text-gray-300 mb-3">{resource.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-gray-400">기본 가치:</span>
                    <span className="text-yellow-400">{resource.baseValue}</span>
                  </div>
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-gray-400">기본 확률:</span>
                    <span className="text-green-400">{resource.baseProbability}%</span>
                  </div>
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-gray-400">최대 채취량:</span>
                    <span className="text-blue-400">{resource.maxYieldPerHour}/시간</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <div className="text-xs font-mono text-gray-400 mb-2">생성 조건:</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {resource.stellarConditions.spectralClasses.map(sc => (
                      <span key={sc} className="text-xs px-2 py-1 bg-gray-700/50 rounded font-mono text-gray-300">
                        {sc}형성
                      </span>
                    ))}
                  </div>
                  <div className="text-xs font-mono text-gray-500">
                    온도: {resource.stellarConditions.temperatureRange[0].toLocaleString()}-{resource.stellarConditions.temperatureRange[1].toLocaleString()}K
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manufacturing Resources Tab */}
      {activeTab === 'manufacturing' && (
        <div className="space-y-4">
          <h3 className="text-lg font-mono text-gray-200 tracking-wide">
            제조 자원 도감
          </h3>
          <p className="text-sm font-mono text-gray-400">
            행성, 소행성 또는 우주 기지에서 제조할 수 있는 자원들입니다.
          </p>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {Object.values(ManufacturingCategory).map(category => (
              <button
                key={category}
                className="px-3 py-1 text-xs font-mono rounded border border-gray-600/30 bg-gray-700/30 text-gray-300 hover:bg-gray-600/30 transition-colors"
                onClick={() => {
                  // Filter logic can be added here
                }}
              >
                {category === ManufacturingCategory.BASIC ? '기본 재료' :
                 category === ManufacturingCategory.PROCESSED ? '가공 재료' :
                 category === ManufacturingCategory.ADVANCED ? '고급 재료' : 
                 category === ManufacturingCategory.COMPONENTS ? '부품류' : '특수 재료'}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {ALL_MANUFACTURING_RESOURCES.map(resource => (
              <div 
                key={resource.id}
                className="bg-gray-800/40 p-4 rounded border border-gray-700/30 hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-mono text-gray-100">{resource.nameKo}</h4>
                    <p className="text-xs font-mono text-gray-400">{resource.nameEn}</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded font-mono ${
                    resource.category === ManufacturingCategory.BASIC ? 'bg-gray-600/30 text-gray-300' :
                    resource.category === ManufacturingCategory.PROCESSED ? 'bg-green-600/30 text-green-300' :
                    resource.category === ManufacturingCategory.ADVANCED ? 'bg-purple-600/30 text-purple-300' :
                    resource.category === ManufacturingCategory.COMPONENTS ? 'bg-blue-600/30 text-blue-300' :
                    'bg-red-600/30 text-red-300'
                  }`}>
                    {resource.category === ManufacturingCategory.BASIC ? '기본' :
                     resource.category === ManufacturingCategory.PROCESSED ? '가공' :
                     resource.category === ManufacturingCategory.ADVANCED ? '고급' : 
                     resource.category === ManufacturingCategory.COMPONENTS ? '부품' : '특수'}
                  </div>
                </div>

                <p className="text-sm font-mono text-gray-300 mb-3">{resource.description}</p>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-gray-400">기본 가치:</span>
                    <span className="text-yellow-400">{resource.baseValue}</span>
                  </div>
                  {resource.manufacturingTime && (
                    <div className="flex justify-between text-sm font-mono">
                      <span className="text-gray-400">제조 시간:</span>
                      <span className="text-blue-400">{Math.floor(resource.manufacturingTime / 60)}분</span>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <div className="text-xs font-mono text-gray-400 mb-2">획득 방법:</div>
                  <div className="space-y-1">
                    {resource.sources.map((source: string, index: number) => (
                      <div key={index} className="text-sm font-mono text-cyan-300">• {source}</div>
                    ))}
                  </div>
                </div>

                {resource.prerequisites && Object.keys(resource.prerequisites).length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-mono text-gray-400 mb-2">필요 재료:</div>
                    <div className="space-y-1">
                      {Object.entries(resource.prerequisites).map(([material, amount]) => (
                        <div key={material} className="text-sm font-mono text-orange-300">
                          • {material} x{amount}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(resource.requiredFacilities || resource.requiredTech) && (
                  <div className="mt-3 pt-3 border-t border-gray-700/50">
                    <div className="text-xs font-mono text-gray-400 mb-2">필요 조건:</div>
                    {resource.requiredFacilities && (
                      <div className="mb-1">
                        <span className="text-xs font-mono text-yellow-400">시설: </span>
                        <span className="text-sm font-mono text-gray-300">
                          {resource.requiredFacilities.join(', ')}
                        </span>
                      </div>
                    )}
                    {resource.requiredTech && (
                      <div>
                        <span className="text-xs font-mono text-yellow-400">기술: </span>
                        <span className="text-sm font-mono text-gray-300">{resource.requiredTech.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-3">
                  <span className={`text-xs px-2 py-1 rounded font-mono ${getDifficultyColor(resource.difficulty)}`}>
                    {getDifficultyLabel(resource.difficulty)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 