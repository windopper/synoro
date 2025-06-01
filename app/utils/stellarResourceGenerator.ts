// 항성 자원 생성 시스템
// 항성의 물리적 특성에 따라 현실적이고 체계적인 자원 할당

import { 
  RESOURCE_DATABASE, 
  ResourceInfo, 
  ResourceRarity, 
  ResourceCategory,
  RARITY_WEIGHTS,
  SPECTRAL_CLASS_BONUSES 
} from '../data/resourceTypes';
import { StarData } from '../data/starData';

// 자원 할당 결과 인터페이스
export interface StellarResourceAllocation {
  primaryResources: { [resourceType: string]: number };
  rareResources?: { [resourceType: string]: number };
  extractionDifficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  renewalRate: number;
  specialConditions?: string[];
  maxExtractionsPerHour?: number;
}

// 분광형에서 기본 클래스 추출 (예: "A1V" -> "A")
function extractSpectralClass(spectralClass: string): string {
  return spectralClass.charAt(0);
}

// 광도 클래스에서 항성 크기 정보 추출
function getLuminosityClass(spectralClass: string): string {
  const match = spectralClass.match(/[IV]+$/);
  return match ? match[0] : 'V'; // 기본값은 주계열성
}

// 항성 특성에 따른 추출 난이도 계산
function calculateExtractionDifficulty(star: StarData): 'easy' | 'medium' | 'hard' | 'extreme' {
  const spectralClass = extractSpectralClass(star.spectralClass);
  const luminosityClass = getLuminosityClass(star.spectralClass);
  
  // 기본 난이도 점수 계산
  let difficultyScore = 0;
  
  // 온도에 따른 난이도
  if (star.temperature > 20000) difficultyScore += 3;
  else if (star.temperature > 10000) difficultyScore += 2;
  else if (star.temperature > 6000) difficultyScore += 1;
  else if (star.temperature < 3000) difficultyScore += 2;
  
  // 질량에 따른 난이도
  if (star.mass > 20) difficultyScore += 3;
  else if (star.mass > 8) difficultyScore += 2;
  else if (star.mass > 3) difficultyScore += 1;
  
  // 광도에 따른 난이도
  if (star.luminosity > 100000) difficultyScore += 3;
  else if (star.luminosity > 1000) difficultyScore += 2;
  else if (star.luminosity > 100) difficultyScore += 1;
  
  // 거대성/초거대성에 따른 난이도 추가
  if (luminosityClass.includes('I')) difficultyScore += 2;
  else if (luminosityClass.includes('II')) difficultyScore += 1;
  
  // 변광성은 난이도 증가
  if (star.variableType) difficultyScore += 2;
  
  // 난이도 등급 결정
  if (difficultyScore >= 8) return 'extreme';
  else if (difficultyScore >= 5) return 'hard';
  else if (difficultyScore >= 3) return 'medium';
  else return 'easy';
}

// 자원 재생성 비율 계산
function calculateRenewalRate(star: StarData): number {
  const spectralClass = extractSpectralClass(star.spectralClass);
  const luminosityClass = getLuminosityClass(star.spectralClass);
  
  let baseRate = 80; // 기본 80%
  
  // 주계열성은 안정적
  if (luminosityClass === 'V') baseRate += 10;
  
  // 거대성은 불안정
  if (luminosityClass.includes('I')) baseRate -= 20;
  else if (luminosityClass.includes('II')) baseRate -= 10;
  
  // 변광성은 불안정
  if (star.variableType) baseRate -= 15;
  
  // 극한 환경은 재생률 감소
  if (star.temperature > 30000 || star.temperature < 2500) baseRate -= 10;
  if (star.mass > 50) baseRate -= 15;
  
  return Math.max(40, Math.min(100, baseRate));
}

// 시간당 최대 채취 횟수 계산
function calculateMaxExtractions(difficulty: string): number {
  switch (difficulty) {
    case 'easy': return 6;
    case 'medium': return 4;
    case 'hard': return 3;
    case 'extreme': return 2;
    default: return 4;
  }
}

// 특수 조건 생성
function generateSpecialConditions(star: StarData, difficulty: string): string[] {
  const conditions: string[] = [];
  const spectralClass = extractSpectralClass(star.spectralClass);
  const luminosityClass = getLuminosityClass(star.spectralClass);
  
  // 온도 관련 조건
  if (star.temperature > 15000) {
    conditions.push('고온 저항 필요');
    conditions.push('방사선 차폐 필요');
  } else if (star.temperature > 8000) {
    conditions.push('고온 저항 필요');
  }
  
  // 거대성 관련 조건
  if (luminosityClass.includes('I')) {
    conditions.push('거대항성 전용 장비 필요');
    conditions.push('고압 환경 대응');
  } else if (luminosityClass.includes('II') || luminosityClass.includes('III')) {
    conditions.push('거대항성 접근 프로토콜');
  }
  
  // 변광성 조건
  if (star.variableType) {
    conditions.push('변광성 활동 모니터링 필요');
  }
  
  // 극한 환경 조건
  if (difficulty === 'extreme') {
    conditions.push('초고온 대응 장비');
    conditions.push('중력장 안정화');
  }
  
  // 특수 분광형 조건
  if (spectralClass === 'O' || spectralClass === 'B') {
    conditions.push('초거대질량성 안전 프로토콜');
  }
  
  // 성간 원반이 있는 별 (예: Vega)
  if (star.name === 'Vega') {
    conditions.push('성간 원반 지역 주의');
    conditions.push('먼지 필터링 필요');
  }
  
  // 연성계 조건 (예: Capella)
  if (star.name === 'Capella') {
    conditions.push('다중성계 동기화 필요');
    conditions.push('궤도 안정성 모니터링');
  }
  
  return conditions;
}

// 항성 특성에 맞는 자원 필터링
function getCompatibleResources(star: StarData): ResourceInfo[] {
  const spectralClass = extractSpectralClass(star.spectralClass);
  const compatible: ResourceInfo[] = [];
  
  for (const resource of Object.values(RESOURCE_DATABASE)) {
    const conditions = resource.stellarConditions;
    
    // 분광형 확인
    if (!conditions.spectralClasses.includes(spectralClass)) continue;
    
    // 온도 범위 확인
    if (star.temperature < conditions.temperatureRange[0] || 
        star.temperature > conditions.temperatureRange[1]) continue;
    
    // 질량 범위 확인
    if (star.mass < conditions.massRange[0] || 
        star.mass > conditions.massRange[1]) continue;
    
    // 광도 범위 확인
    if (star.luminosity < conditions.luminosityRange[0] || 
        star.luminosity > conditions.luminosityRange[1]) continue;
    
    // 변광성 조건 확인
    if (conditions.variableStarsOnly && !star.variableType) continue;
    
    compatible.push(resource);
  }
  
  return compatible;
}

// 자원 확률 계산
function calculateResourceProbability(resource: ResourceInfo, star: StarData): number {
  const spectralClass = extractSpectralClass(star.spectralClass);
  
  // 기본 확률
  let probability = resource.baseProbability;
  
  // 희소성에 따른 가중치 적용
  probability *= RARITY_WEIGHTS[resource.rarity];
  
  // 분광형 보너스 적용
  const categoryBonus = SPECTRAL_CLASS_BONUSES[spectralClass]?.[resource.category] || 1.0;
  probability *= categoryBonus;
  
  // 항성 특성에 따른 추가 보정
  const conditions = resource.stellarConditions;
  const tempOptimal = (conditions.temperatureRange[0] + conditions.temperatureRange[1]) / 2;
  const massOptimal = (conditions.massRange[0] + conditions.massRange[1]) / 2;
  const lumOptimal = (conditions.luminosityRange[0] + conditions.luminosityRange[1]) / 2;
  
  // 최적 조건에 가까울수록 확률 증가
  const tempFactor = 1 - Math.abs(star.temperature - tempOptimal) / tempOptimal * 0.3;
  const massFactor = 1 - Math.abs(star.mass - massOptimal) / massOptimal * 0.2;
  const lumFactor = 1 - Math.abs(star.luminosity - lumOptimal) / lumOptimal * 0.1;
  
  probability *= Math.max(0.1, tempFactor * massFactor * lumFactor);
  
  return Math.max(0, Math.min(100, probability));
}

// 자원 채취량 계산
function calculateResourceYield(resource: ResourceInfo, star: StarData, isPrimary: boolean): number {
  const spectralClass = extractSpectralClass(star.spectralClass);
  const categoryBonus = SPECTRAL_CLASS_BONUSES[spectralClass]?.[resource.category] || 1.0;
  
  let baseYield = resource.maxYieldPerHour;
  
  // 주요 자원은 더 많이, 희귀 자원은 적게
  if (isPrimary) {
    baseYield *= 1.5;
  } else {
    baseYield *= 0.6;
  }
  
  // 분광형 보너스 적용
  baseYield *= categoryBonus;
  
  // 항성 크기에 따른 추가 보정
  if (star.mass > 10) baseYield *= 1.3;
  else if (star.mass > 5) baseYield *= 1.1;
  else if (star.mass < 0.5) baseYield *= 0.7;
  
  return Math.max(0.1, Math.round(baseYield * 10) / 10);
}

// 메인 자원 할당 함수
export function generateStellarResources(star: StarData): StellarResourceAllocation {
  // 호환 가능한 자원들 찾기
  const compatibleResources = getCompatibleResources(star);
  
  if (compatibleResources.length === 0) {
    // 기본 자원 할당 (수소는 모든 별에 존재)
    return {
      primaryResources: { '수소': 5 },
      extractionDifficulty: 'medium',
      renewalRate: 70,
      maxExtractionsPerHour: 4
    };
  }
  
  // 확률 계산 및 정렬
  const resourceProbabilities = compatibleResources.map(resource => ({
    resource,
    probability: calculateResourceProbability(resource, star)
  })).sort((a, b) => b.probability - a.probability);
  
  const primaryResources: { [key: string]: number } = {};
  const rareResources: { [key: string]: number } = {};
  
  // 주요 자원 선택 (확률 높은 것부터 2-4개)
  const primaryCount = Math.min(4, Math.max(2, Math.floor(Math.random() * 3) + 2));
  let selectedPrimary = 0;
  
  for (const { resource, probability } of resourceProbabilities) {
    if (selectedPrimary >= primaryCount) break;
    
    if (Math.random() * 100 < probability) {
      const yieldAmount = calculateResourceYield(resource, star, true);
      primaryResources[resource.nameKo] = yieldAmount;
      selectedPrimary++;
    }
  }
  
  // 희귀 자원 선택 (낮은 확률로)
  for (const { resource, probability } of resourceProbabilities) {
    if (resource.rarity === ResourceRarity.COMMON || 
        resource.rarity === ResourceRarity.UNCOMMON) continue;
    
    if (primaryResources[resource.nameKo]) continue; // 이미 주요 자원으로 선택됨
    
    // 희귀 자원은 낮은 확률로 선택
    const adjustedProbability = probability * 0.3;
    if (Math.random() * 100 < adjustedProbability) {
      const yieldAmount = calculateResourceYield(resource, star, false);
      rareResources[resource.nameKo] = yieldAmount;
    }
  }
  
  // 기타 속성 계산
  const extractionDifficulty = calculateExtractionDifficulty(star);
  const renewalRate = calculateRenewalRate(star);
  const maxExtractionsPerHour = calculateMaxExtractions(extractionDifficulty);
  const specialConditions = generateSpecialConditions(star, extractionDifficulty);
  
  return {
    primaryResources,
    rareResources: Object.keys(rareResources).length > 0 ? rareResources : undefined,
    extractionDifficulty,
    renewalRate,
    specialConditions: specialConditions.length > 0 ? specialConditions : undefined,
    maxExtractionsPerHour
  };
}

// 랜덤 별에 대한 간소화된 자원 할당
export function generateRandomStarResources(spectralClass: string, temperature: number, mass: number, luminosity: number): StellarResourceAllocation {
  const tempStar: StarData = {
    id: 'temp',
    name: 'Random Star',
    designation: 'Random',
    constellation: 'Various',
    apparentMagnitude: 0,
    absoluteMagnitude: 0,
    distance: 0,
    spectralClass,
    temperature,
    mass,
    radius: 1,
    luminosity,
    rightAscension: '',
    declination: '',
    description: '',
    position: { x: 0, y: 0, z: 0 },
    color: '#ffffff',
    size: 1
  };
  
  return generateStellarResources(tempStar);
} 