'use client'

import React, { memo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Clock, AlertCircle, CheckCircle, Settings } from 'lucide-react'
import { StarData } from '../data/starData'
import { useAppDispatch, useAppSelector } from '../lib/hooks'
import { 
  startStellarExtraction, 
  completeStellarExtraction, 
  updateExtractionProgress,
  cancelStellarExtraction 
} from '../lib/features/shipSystemsSlice'

interface StellarResourceExtractionDialogProps {
  isOpen: boolean
  onClose: () => void
  star: StarData | null
}

const StellarResourceExtractionDialog: React.FC<StellarResourceExtractionDialogProps> = ({
  isOpen,
  onClose,
  star
}) => {
  const dispatch = useAppDispatch()
  const stellarExtraction = useAppSelector(state => state.shipSystems.stellarExtraction)
  const [selectedResourceType, setSelectedResourceType] = useState<'primary' | 'rare'>('primary')
  const [selectedResource, setSelectedResource] = useState<string>('')
  const [extractionMessage, setExtractionMessage] = useState<string>('')
  const [extractionError, setExtractionError] = useState<string>('')

  const activeExtraction = star ? stellarExtraction.activeExtractions[star.id] : null
  const extractionHistory = star ? stellarExtraction.extractionHistory[star.id] : null

  const handleStartExtraction = async () => {
    if (!star || !selectedResource) return

    try {
      setExtractionError('')
      await dispatch(startStellarExtraction({
        star,
        extractionType: selectedResourceType,
        resourceType: selectedResource
      })).unwrap()
      
      setExtractionMessage('자원 채취를 시작했습니다!')
      setTimeout(() => setExtractionMessage(''), 3000)
    } catch (error: any) {
      setExtractionError(error.message)
      setTimeout(() => setExtractionError(''), 5000)
    }
  }

  const handleCancelExtraction = () => {
    if (!star) return
    dispatch(cancelStellarExtraction(star.id))
    setExtractionMessage('자원 채취가 취소되었습니다.')
    setTimeout(() => setExtractionMessage(''), 3000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-orange-400'
      case 'extreme': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '쉬움'
      case 'medium': return '보통'
      case 'hard': return '어려움'
      case 'extreme': return '극한'
      default: return '알 수 없음'
    }
  }

  // 자원 데이터 계산 (조건부 return 이전에 해야 함)
  const resources = star?.stellarResources
  const currentResources = resources && selectedResourceType === 'primary' 
    ? resources.primaryResources 
    : resources?.rareResources || {}

  // 첫 번째 자원을 기본 선택으로 설정 (조건부 return 이전에 해야 함)
  useEffect(() => {
    if (!star || !star.stellarResources) return
    
    const resourceKeys = Object.keys(currentResources)
    if (resourceKeys.length > 0 && !selectedResource) {
      setSelectedResource(resourceKeys[0])
    }
  }, [currentResources, selectedResource, star])

  // 조건부 return
  if (!star || !star.stellarResources || !resources) {
    return null
  }

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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-mono text-white tracking-wide">
                  항성 자원 채취 - {star.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            {extractionMessage && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-700/50 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-green-200 text-sm">{extractionMessage}</span>
              </div>
            )}

            {extractionError && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700/50 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-red-200 text-sm">{extractionError}</span>
              </div>
            )}

            {/* Active Extraction Status */}
            {activeExtraction && (
              <div className="mb-6 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-200 font-medium">채취 진행 중</span>
                  </div>
                  <button
                    onClick={handleCancelExtraction}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    취소
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">자원: {activeExtraction.resourceType}</span>
                    <span className="text-gray-300">예상 수량: {activeExtraction.expectedYield}</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${activeExtraction.progress}%` }}
                    />
                  </div>
                  
                  <div className="text-center text-sm text-gray-400">
                    {activeExtraction.progress.toFixed(1)}% 완료
                  </div>
                </div>
              </div>
            )}

            {/* Extraction Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/40 p-4 rounded-lg border border-gray-700/30">
                <h3 className="text-gray-200 font-medium mb-2 flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>채취 정보</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">난이도:</span>
                    <span className={getDifficultyColor(resources.extractionDifficulty)}>
                      {getDifficultyLabel(resources.extractionDifficulty)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">재생성 비율:</span>
                    <span className="text-gray-200">{resources.renewalRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">시간당 최대:</span>
                    <span className="text-gray-200">{resources.maxExtractionsPerHour || '∞'}회</span>
                  </div>
                </div>
              </div>

              {extractionHistory && (
                <div className="bg-gray-800/40 p-4 rounded-lg border border-gray-700/30">
                  <h3 className="text-gray-200 font-medium mb-2">채취 기록</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">총 채취 횟수:</span>
                      <span className="text-gray-200">{extractionHistory.totalExtractions}회</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">이번 시간:</span>
                      <span className="text-gray-200">{extractionHistory.extractionsThisHour}회</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">마지막 채취:</span>
                      <span className="text-gray-200">
                        {new Date(extractionHistory.lastExtraction).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Special Conditions */}
            {resources.specialConditions && resources.specialConditions.length > 0 && (
              <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                <h3 className="text-yellow-200 font-medium mb-2 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>특수 조건</span>
                </h3>
                <ul className="space-y-1 text-sm">
                  {resources.specialConditions.map((condition, index) => (
                    <li key={index} className="text-yellow-100 flex items-start space-x-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Resource Selection */}
            {!activeExtraction && (
              <div className="space-y-4">
                {/* Resource Type Toggle */}
                <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
                  <button
                    onClick={() => setSelectedResourceType('primary')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      selectedResourceType === 'primary'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    주요 자원
                  </button>
                  {resources.rareResources && Object.keys(resources.rareResources).length > 0 && (
                    <button
                      onClick={() => setSelectedResourceType('rare')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        selectedResourceType === 'rare'
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      희귀 자원
                    </button>
                  )}
                </div>

                {/* Resource List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(currentResources).map(([resourceName, amount]) => (
                    <button
                      key={resourceName}
                      onClick={() => setSelectedResource(resourceName)}
                      className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                        selectedResource === resourceName
                          ? 'border-amber-500/50 bg-amber-900/20'
                          : 'border-gray-700/50 bg-gray-800/20 hover:border-gray-600/50'
                      }`}
                    >
                      <div className="font-medium text-white">{resourceName}</div>
                      <div className="text-sm text-gray-400">기본 수량: {amount}개</div>
                    </button>
                  ))}
                </div>

                {/* Start Extraction Button */}
                <button
                  onClick={handleStartExtraction}
                  disabled={!selectedResource}
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>자원 채취 시작</span>
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 

// memo
export default memo(StellarResourceExtractionDialog);