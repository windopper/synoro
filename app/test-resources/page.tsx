"use client";
import React from 'react';
import ResourceOverview from '../components/resources/ResourceOverview';
import { allStars } from '../data/starData';
import { generateStellarResources } from '../utils/stellarResourceGenerator';

export default function TestResourcesPage() {
  const [selectedStar, setSelectedStar] = React.useState(allStars[0]);
  const [resourceInfo, setResourceInfo] = React.useState(generateStellarResources(allStars[0]));
  
  const handleStarChange = (starId: string) => {
    const star = allStars.find(s => s.id === starId);
    if (star) {
      setSelectedStar(star);
      setResourceInfo(generateStellarResources(star));
    }
  };

  const regenerateResources = () => {
    setResourceInfo(generateStellarResources(selectedStar));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 페이지 제목 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">자원 시스템 테스트</h1>
          <p className="text-gray-400">항성별 자원 할당 시스템을 테스트해보세요</p>
        </div>

        {/* 항성 선택 및 자원 정보 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* 항성 선택 */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">항성 선택</h2>
              <select
                value={selectedStar.id}
                onChange={(e) => handleStarChange(e.target.value)}
                className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                {allStars.slice(0, 12).map(star => (
                  <option key={star.id} value={star.id}>
                    {star.name} ({star.spectralClass})
                  </option>
                ))}
              </select>
              
              <button
                onClick={regenerateResources}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                자원 재생성
              </button>
            </div>

            {/* 선택된 항성 정보 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">항성 정보</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">이름:</span>
                  <span className="text-white font-medium">{selectedStar.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">분광형:</span>
                  <span className="text-white font-medium">{selectedStar.spectralClass}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">온도:</span>
                  <span className="text-white font-medium">{selectedStar.temperature.toLocaleString()}K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">질량:</span>
                  <span className="text-white font-medium">{selectedStar.mass}☉</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">광도:</span>
                  <span className="text-white font-medium">{selectedStar.luminosity}☉</span>
                </div>
                {selectedStar.variableType && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">변광성:</span>
                    <span className="text-yellow-400 font-medium">{selectedStar.variableType}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 생성된 자원 정보 */}
          <div className="space-y-6">
            {/* 주요 자원 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">주요 자원</h3>
              {Object.keys(resourceInfo.primaryResources).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(resourceInfo.primaryResources).map(([resource, amount]) => (
                    <div key={resource} className="flex justify-between items-center">
                      <span className="text-gray-300">{resource}</span>
                      <span className="text-green-400 font-medium">{amount}/시간</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">주요 자원이 없습니다</p>
              )}
            </div>

            {/* 희귀 자원 */}
            {resourceInfo.rareResources && Object.keys(resourceInfo.rareResources).length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">희귀 자원</h3>
                <div className="space-y-3">
                  {Object.entries(resourceInfo.rareResources).map(([resource, amount]) => (
                    <div key={resource} className="flex justify-between items-center">
                      <span className="text-gray-300">{resource}</span>
                      <span className="text-purple-400 font-medium">{amount}/시간</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 채취 정보 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">채취 정보</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">채취 난이도:</span>
                  <span className={`font-medium ${
                    resourceInfo.extractionDifficulty === 'extreme' ? 'text-red-400' :
                    resourceInfo.extractionDifficulty === 'hard' ? 'text-orange-400' :
                    resourceInfo.extractionDifficulty === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {resourceInfo.extractionDifficulty === 'extreme' ? '극한' :
                     resourceInfo.extractionDifficulty === 'hard' ? '어려움' :
                     resourceInfo.extractionDifficulty === 'medium' ? '보통' : '쉬움'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">재생성 비율:</span>
                  <span className="text-blue-400 font-medium">{resourceInfo.renewalRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">시간당 최대 채취:</span>
                  <span className="text-cyan-400 font-medium">{resourceInfo.maxExtractionsPerHour}회</span>
                </div>
              </div>

              {/* 특수 조건 */}
              {resourceInfo.specialConditions && resourceInfo.specialConditions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h4 className="text-white font-medium mb-2">특수 조건:</h4>
                  <div className="space-y-1">
                    {resourceInfo.specialConditions.map((condition, index) => (
                      <div key={index} className="text-sm text-yellow-400">
                        • {condition}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 자원 도감 */}
        <div className="border-t border-gray-700 pt-8">
          <ResourceOverview />
        </div>
      </div>
    </div>
  );
} 