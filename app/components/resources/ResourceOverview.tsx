"use client";
import React from 'react';
import { 
  RESOURCE_DATABASE, 
  ResourceCategory, 
  ResourceRarity,
  getResourcesByCategory,
  getResourcesByRarity 
} from '../../data/resourceTypes';

interface ResourceOverviewProps {
  className?: string;
}

const RARITY_COLORS = {
  [ResourceRarity.COMMON]: 'text-gray-400',
  [ResourceRarity.UNCOMMON]: 'text-green-400',
  [ResourceRarity.RARE]: 'text-blue-400',
  [ResourceRarity.VERY_RARE]: 'text-purple-400',
  [ResourceRarity.LEGENDARY]: 'text-yellow-400',
  [ResourceRarity.UNIQUE]: 'text-red-400'
};

const CATEGORY_COLORS = {
  [ResourceCategory.STELLAR_ENERGY]: 'border-yellow-500 bg-yellow-500/10',
  [ResourceCategory.STELLAR_MATTER]: 'border-orange-500 bg-orange-500/10',
  [ResourceCategory.GASES]: 'border-blue-500 bg-blue-500/10',
  [ResourceCategory.METALS]: 'border-gray-500 bg-gray-500/10',
  [ResourceCategory.CRYSTALS]: 'border-purple-500 bg-purple-500/10',
  [ResourceCategory.EXOTIC_MATTER]: 'border-pink-500 bg-pink-500/10',
  [ResourceCategory.QUANTUM]: 'border-cyan-500 bg-cyan-500/10',
  [ResourceCategory.DARK_MATTER]: 'border-red-500 bg-red-500/10'
};

const CATEGORY_NAMES = {
  [ResourceCategory.STELLAR_ENERGY]: '항성 에너지',
  [ResourceCategory.STELLAR_MATTER]: '항성 물질',
  [ResourceCategory.GASES]: '기체',
  [ResourceCategory.METALS]: '금속',
  [ResourceCategory.CRYSTALS]: '결정체',
  [ResourceCategory.EXOTIC_MATTER]: '이상 물질',
  [ResourceCategory.QUANTUM]: '양자 물질',
  [ResourceCategory.DARK_MATTER]: '암흑 물질'
};

const RARITY_NAMES = {
  [ResourceRarity.COMMON]: '일반',
  [ResourceRarity.UNCOMMON]: '비일반',
  [ResourceRarity.RARE]: '희귀',
  [ResourceRarity.VERY_RARE]: '매우 희귀',
  [ResourceRarity.LEGENDARY]: '전설급',
  [ResourceRarity.UNIQUE]: '고유'
};

export default function ResourceOverview({ className = '' }: ResourceOverviewProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<ResourceCategory | null>(null);
  const [selectedRarity, setSelectedRarity] = React.useState<ResourceRarity | null>(null);

  const getFilteredResources = () => {
    let resources = Object.values(RESOURCE_DATABASE);
    
    if (selectedCategory) {
      resources = resources.filter(r => r.category === selectedCategory);
    }
    
    if (selectedRarity) {
      resources = resources.filter(r => r.rarity === selectedRarity);
    }
    
    return resources;
  };

  const filteredResources = getFilteredResources();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 제목 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">자원 도감</h2>
        <p className="text-gray-400">우주에서 발견할 수 있는 모든 자원들</p>
      </div>

      {/* 필터 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 카테고리 필터 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">카테고리별 필터</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === null 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              전체
            </button>
            {Object.values(ResourceCategory).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category 
                    ? `${CATEGORY_COLORS[category]} border` 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {CATEGORY_NAMES[category]}
              </button>
            ))}
          </div>
        </div>

        {/* 희소성 필터 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">희소성별 필터</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedRarity(null)}
              className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRarity === null 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              전체
            </button>
            {Object.values(ResourceRarity).map(rarity => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(rarity)}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedRarity === rarity 
                    ? 'bg-blue-600 text-white' 
                    : `bg-gray-700 hover:bg-gray-600 ${RARITY_COLORS[rarity]}`
                }`}
              >
                {RARITY_NAMES[rarity]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 통계 정보 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{filteredResources.length}</div>
          <div className="text-sm text-gray-400">총 자원 수</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {filteredResources.filter(r => r.rarity === ResourceRarity.COMMON || r.rarity === ResourceRarity.UNCOMMON).length}
          </div>
          <div className="text-sm text-gray-400">일반 자원</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {filteredResources.filter(r => r.rarity === ResourceRarity.RARE).length}
          </div>
          <div className="text-sm text-gray-400">희귀 자원</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {filteredResources.filter(r => r.rarity === ResourceRarity.VERY_RARE || r.rarity === ResourceRarity.LEGENDARY || r.rarity === ResourceRarity.UNIQUE).length}
          </div>
          <div className="text-sm text-gray-400">전설급+ 자원</div>
        </div>
      </div>

      {/* 자원 목록 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          자원 목록 ({filteredResources.length}개)
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredResources.map(resource => (
            <div
              key={resource.id}
              className={`bg-gray-800 rounded-lg p-4 border ${CATEGORY_COLORS[resource.category]} hover:bg-gray-700 transition-colors`}
            >
              {/* 자원 헤더 */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-white text-lg">{resource.nameKo}</h4>
                  <p className="text-sm text-gray-400">{resource.nameEn}</p>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${RARITY_COLORS[resource.rarity]}`}>
                    {RARITY_NAMES[resource.rarity]}
                  </div>
                  <div className="text-xs text-gray-500">
                    {CATEGORY_NAMES[resource.category]}
                  </div>
                </div>
              </div>

              {/* 자원 설명 */}
              <p className="text-sm text-gray-300 mb-3">{resource.description}</p>

              {/* 자원 정보 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">기본 가치:</span>
                  <span className="text-yellow-400 font-medium">{resource.baseValue}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">기본 확률:</span>
                  <span className="text-green-400">{resource.baseProbability}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">최대 채취량:</span>
                  <span className="text-blue-400">{resource.maxYieldPerHour}/시간</span>
                </div>
              </div>

              {/* 생성 조건 */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="text-xs text-gray-500 mb-2">생성 조건:</div>
                <div className="flex flex-wrap gap-1">
                  {resource.stellarConditions.spectralClasses.map(sc => (
                    <span key={sc} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      {sc}형성
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  온도: {resource.stellarConditions.temperatureRange[0].toLocaleString()} - {resource.stellarConditions.temperatureRange[1].toLocaleString()}K
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 