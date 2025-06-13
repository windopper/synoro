# 은하와 별 생성 시스템 문서

## 1. 개요

본 문서는 Synoro 게임에서 사용되는 은하 구조와 별 생성 시스템에 대한 상세한 설명을 제공합니다. 은하의 물리적 구조, 별의 분포 원리, 자원 할당 시스템, 그리고 관련 수식들을 포함하여 향후 AI가 이 문서를 기반으로 생성 함수를 개발할 수 있도록 구성되었습니다.

## 2. 은하 구조 및 설정

### 2.1 기본 은하 구성 요소

은하는 다음과 같은 주요 영역으로 구성됩니다:

- **중심 코어 (Core)**: 은하의 핵심 영역, 고밀도 별 분포
- **외곽 코어 (Outer Core)**: 중심 코어를 둘러싼 중간 밀도 영역
- **나선팔 (Spiral Arms)**: 별 형성이 활발한 나선 구조
- **디스크 (Disk)**: 나선팔 사이의 평면 영역
- **헤일로 (Halo)**: 은하 외곽의 구형 분포 영역

### 2.2 은하 구성 상수 (galaxyConfig.ts)

```typescript
// 은하 기본 설정
export const NUM_STARS = 7000;           // 총 별의 개수
export const NUM_ARMS = 4;               // 나선팔 개수
export const ARMS = 4;                   // 나선팔 개수 (별칭)
export const GALAXY_THICKNESS = 200;     // 은하 두께 (Y축)

// 중심 코어 영역
export const CORE_X_DIST = 4000;         // 코어 X축 분산
export const CORE_Y_DIST = 4000;         // 코어 Z축 분산

// 외곽 코어 영역
export const OUTER_CORE_X_DIST = 12500;  // 외곽 코어 X축 분산
export const OUTER_CORE_Y_DIST = 12500;  // 외곽 코어 Z축 분산

// 나선팔 설정
export const ARM_X_DIST = 15000;         // 나선팔 X축 분산
export const ARM_Y_DIST = 7500;          // 나선팔 Z축 분산
export const ARM_X_MEAN = 30000;         // 나선팔 X축 평균 거리
export const ARM_Y_MEAN = 15000;         // 나선팔 Z축 평균 거리
export const SPIRAL = 3.0;               // 나선 각도 계수

// 기타 설정
export const HAZE_RATIO = 0.5;           // 성운 비율
export const BASE_STAR_RADIUS = 0.01;    // 기본 별 반지름
export const BASE_PLANET_RADIUS = 0.005; // 기본 행성 반지름
```

## 3. 수학적 분포 함수

### 3.1 가우시안 분포 함수

별의 위치 분포에 사용되는 가우시안 랜덤 함수:

```typescript
export function gaussianRandom(mean = 0, stdev = 1): number {
  let u = 1 - Math.random();
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}
```

**수식 설명:**
- Box-Muller 변환을 사용한 정규분포 생성
- `u`, `v`: [0,1] 범위의 균등 분포 난수
- `z`: 표준 정규분포 N(0,1)를 따르는 값
- 최종 반환값: `mean + stdev × z`

### 3.2 나선팔 생성 함수

나선 구조를 생성하는 함수:

```typescript
export function spiral(x: number, y: number, z: number, offset: number): Vector3 {
  let r = Math.sqrt(x ** 2 + z ** 2);  // x,z 평면에서의 반지름
  let theta = offset;                   // 기본 각도 오프셋
  
  // 각도 계산 (x,z 평면)
  theta += x > 0 ? Math.atan(z / x) : Math.atan(z / x) + Math.PI;
  
  // 나선 각도 적용
  theta += (r / ARM_X_DIST) * SPIRAL;
  
  return new Vector3(
    r * Math.cos(theta),  // 새로운 X 좌표
    y,                    // Y 좌표 유지 (은하 두께)
    r * Math.sin(theta)   // 새로운 Z 좌표
  );
}
```

**나선 각도 공식:**
```
θ_final = θ_offset + arctan(z/x) + (r/ARM_X_DIST) × SPIRAL
```

여기서:
- `θ_offset`: 각 나선팔의 기본 오프셋 = `(arm_index × 2π) / ARMS`
- `r`: 은하 중심으로부터의 거리
- `SPIRAL`: 나선의 감김 정도 (3.0)

## 4. 은하 밀도 분포 함수

### 4.1 전체 밀도 계산

```typescript
function getGalacticDensity(x: number, y: number, z: number): number {
  const r = Math.sqrt(x * x + z * z);
  const yFactor = Math.exp(-(y * y) / (2 * GALAXY_THICKNESS * GALAXY_THICKNESS));
  
  // 각 영역별 밀도 계산
  const coreDensity = calculateCoreDensity(x, z);
  const outerCoreDensity = calculateOuterCoreDensity(x, z);
  const spiralDensity = calculateSpiralDensity(x, z);
  
  return (coreDensity + outerCoreDensity + spiralDensity) * yFactor;
}
```

### 4.2 중심 코어 밀도

```typescript
const coreDistance = Math.sqrt((x * x) / (CORE_X_DIST * CORE_X_DIST) + (z * z) / (CORE_Y_DIST * CORE_Y_DIST));
const coreDensity = coreDistance < 1 ? Math.exp(-coreDistance * 2) * 3.0 : 0;
```

**수식:**
```
d_core = sqrt((x²/CORE_X_DIST²) + (z²/CORE_Y_DIST²))
ρ_core = {
  3.0 × exp(-2 × d_core)  if d_core < 1
  0                       if d_core ≥ 1
}
```

### 4.3 외곽 코어 밀도

```typescript
const outerCoreDistance = Math.sqrt((x * x) / (OUTER_CORE_X_DIST * OUTER_CORE_X_DIST) + (z * z) / (OUTER_CORE_Y_DIST * OUTER_CORE_Y_DIST));
const outerCoreDensity = outerCoreDistance < 1 ? Math.exp(-outerCoreDistance) * 1.5 : 0;
```

**수식:**
```
d_outer = sqrt((x²/OUTER_CORE_X_DIST²) + (z²/OUTER_CORE_Y_DIST²))
ρ_outer = {
  1.5 × exp(-d_outer)  if d_outer < 1
  0                    if d_outer ≥ 1
}
```

### 4.4 나선팔 밀도

```typescript
let spiralDensity = 0;
for (let arm = 0; arm < ARMS; arm++) {
  const armAngle = (arm * 2 * Math.PI) / ARMS;
  let theta = Math.atan2(z, x);
  if (theta < 0) theta += 2 * Math.PI;
  
  const expectedTheta = armAngle + (r / ARM_X_DIST) * SPIRAL;
  let deltaTheta = Math.abs(theta - expectedTheta);
  
  if (deltaTheta > Math.PI) deltaTheta = 2 * Math.PI - deltaTheta;
  
  const armWidth = Math.PI / 8;
  if (deltaTheta < armWidth) {
    const armStrength = Math.exp(-(deltaTheta * deltaTheta) / (2 * (armWidth / 3) * (armWidth / 3)));
    const radialFalloff = Math.exp(-Math.abs(r - ARM_X_MEAN) / ARM_X_DIST);
    spiralDensity += armStrength * radialFalloff * 2.0;
  }
}
```

**나선팔 밀도 수식:**
```
For each arm i (i = 0 to ARMS-1):
  θ_arm = (i × 2π) / ARMS
  θ_expected = θ_arm + (r / ARM_X_DIST) × SPIRAL
  Δθ = min(|θ_actual - θ_expected|, 2π - |θ_actual - θ_expected|)
  
  If Δθ < π/8:
    strength = exp(-Δθ² / (2 × (π/24)²))
    falloff = exp(-|r - ARM_X_MEAN| / ARM_X_DIST)
    ρ_spiral += 2.0 × strength × falloff
```

### 4.5 Y축 두께 팩터

```typescript
const yFactor = Math.exp(-(y * y) / (2 * GALAXY_THICKNESS * GALAXY_THICKNESS));
```

**수식:**
```
f_y = exp(-y² / (2 × GALAXY_THICKNESS²))
```

## 5. 별 분류 시스템

### 5.1 분광형 (Spectral Class)

별은 표면 온도에 따라 분류됩니다:

| 분광형 | 온도 범위 (K) | 색상 | 특징 |
|--------|---------------|------|------|
| O      | > 30,000      | 청백색 | 극고온, 대질량, 짧은 수명 |
| B      | 10,000-30,000 | 청백색 | 고온, 대질량 |
| A      | 7,500-10,000  | 백색 | 고온, 수소 흡수선 강함 |
| F      | 6,000-7,500   | 황백색 | 중온, 금속선 나타남 |
| G      | 5,200-6,000   | 황색 | 태양형, 안정적 |
| K      | 3,700-5,200   | 주황색 | 저온, 장수명 |
| M      | < 3,700       | 적색 | 극저온, 극장수명 |

### 5.2 광도 계급 (Luminosity Class)

| 계급 | 명칭 | 특징 |
|------|------|------|
| I    | 초거성 | 극대 반지름, 극고광도 |
| II   | 밝은 거성 | 대반지름, 고광도 |
| III  | 거성 | 큰 반지름, 중광도 |
| IV   | 준거성 | 중간 반지름 |
| V    | 주계열성 | 표준 질량-광도 관계 |

### 5.3 위치별 별 종류 분포

#### 중심부 (coreDistance < 0.5)
```typescript
// 분광형 확률 분포
O: 10%, B: 15%, A: 15%, F: 20%, G: 20%, K: 10%, M: 10%

// 물리적 특성 범위
temperature: 20,000 - 45,000 K
mass: 5 - 35 태양질량
```

#### 중간 영역 (0.5 ≤ coreDistance < 1.0)
```typescript
// 분광형 확률 분포
O: 5%, B: 10%, A: 15%, F: 20%, G: 20%, K: 15%, M: 15%

// 물리적 특성 범위
temperature: 10,000 - 25,000 K
mass: 2 - 17 태양질량
```

#### 외곽 영역 (coreDistance ≥ 1.0)
```typescript
// 분광형 확률 분포
O: 1%, B: 4%, A: 10%, F: 15%, G: 20%, K: 25%, M: 25%

// 물리적 특성 범위
temperature: 3,000 - 13,000 K
mass: 0.3 - 5.3 태양질량
```

## 6. 별 데이터 구조 (StarData Interface)

```typescript
export interface StarData {
  // 기본 식별 정보
  id: string;                    // 고유 식별자
  name: string;                  // 별 이름
  designation: string;           // 공식 명칭 (예: α Centauri)
  constellation: string;         // 별자리

  // 천문학적 특성
  apparentMagnitude: number;     // 겉보기 등급
  absoluteMagnitude: number;     // 절대 등급
  distance: number;              // 거리 (광년)
  spectralClass: string;         // 분광형 (예: G2V)
  
  // 물리적 특성
  temperature: number;           // 표면 온도 (K)
  mass: number;                  // 질량 (태양질량)
  radius: number;                // 반지름 (태양반지름)
  luminosity: number;            // 광도 (태양광도)
  
  // 좌표 정보
  rightAscension: string;        // 적경
  declination: string;           // 적위
  position: {                    // 3D 위치
    x: number;
    y: number;
    z: number;
  };
  
  // 시각적 특성
  color: string;                 // 색상 (hex)
  size: number;                  // 시각적 크기

  // 메타 정보
  description: string;           // 설명
  discoveryInfo?: string;        // 발견 정보
  variableType?: string;         // 변광성 타입
  
  // 게임 요소
  stellarResources?: StellarResourceAllocation;
  isVisible?: boolean;           // 가시성
  isScanned?: boolean;           // 스캔 여부
}
```

## 7. 별 자원 시스템

### 7.1 자원 할당 구조

```typescript
export interface StellarResourceAllocation {
  primaryResources: { [resourceType: string]: number };    // 주요 자원 (시간당 채취량)
  rareResources?: { [resourceType: string]: number };      // 희귀 자원 (시간당 채취량)
  extractionDifficulty: 'easy' | 'medium' | 'hard' | 'extreme';  // 채취 난이도
  renewalRate: number;                                     // 자원 재생성 비율 (0-100%)
  specialConditions?: string[];                            // 특수 채취 조건
  maxExtractionsPerHour?: number;                          // 시간당 최대 채취 횟수
}
```

### 7.2 자원 카테고리

| 카테고리 | 설명 | 예시 자원 |
|----------|------|-----------|
| STELLAR_ENERGY | 항성 에너지 | 플라즈마 에너지, 항성풍 입자 |
| STELLAR_MATTER | 항성 물질 | 항성 물질, 거대항성 물질 |
| GASES | 기체 | 수소, 헬륨, 중수소 |
| METALS | 금속 | 철, 금속 증기, 중원소 |
| CRYSTALS | 결정체 | 실리콘, 탄소, 성간먼지 입자 |
| EXOTIC_MATTER | 이색 물질 | 초중원소, 중원소 화합물 |
| QUANTUM | 양자 물질 | 연성 물질, 중력파 공명물질 |
| DARK_MATTER | 암흑 물질 | 방사성 동위원소, 중성자 물질 |

### 7.3 분광형별 자원 보너스

```typescript
export const SPECTRAL_CLASS_BONUSES: Record<string, Record<ResourceCategory, number>> = {
  'O': {
    STELLAR_ENERGY: 1.5,    // O형성은 에너지 자원이 풍부
    STELLAR_MATTER: 1.3,
    GASES: 0.8,
    METALS: 1.2,
    CRYSTALS: 0.9,
    EXOTIC_MATTER: 1.4,
    QUANTUM: 1.1,
    DARK_MATTER: 0.8
  },
  // ... 다른 분광형들
  'M': {
    STELLAR_ENERGY: 0.7,    // M형성은 에너지가 적고 암흑물질이 많음
    STELLAR_MATTER: 0.8,
    GASES: 1.2,
    METALS: 1.3,
    CRYSTALS: 0.8,
    EXOTIC_MATTER: 1.2,
    QUANTUM: 0.9,
    DARK_MATTER: 1.5
  }
};
```

### 7.4 자원 생성 확률 계산

```typescript
function calculateResourceProbability(resource: ResourceInfo, star: StarData): number {
  let probability = resource.baseProbability;
  
  // 희소성 가중치 적용
  probability *= RARITY_WEIGHTS[resource.rarity];
  
  // 분광형 보너스 적용
  const spectralClass = extractSpectralClass(star.spectralClass);
  const categoryBonus = SPECTRAL_CLASS_BONUSES[spectralClass]?.[resource.category] || 1.0;
  probability *= categoryBonus;
  
  // 최적 조건 근접도 계산
  const conditions = resource.stellarConditions;
  const tempOptimal = (conditions.temperatureRange[0] + conditions.temperatureRange[1]) / 2;
  const massOptimal = (conditions.massRange[0] + conditions.massRange[1]) / 2;
  const lumOptimal = (conditions.luminosityRange[0] + conditions.luminosityRange[1]) / 2;
  
  const tempFactor = 1 - Math.abs(star.temperature - tempOptimal) / tempOptimal * 0.3;
  const massFactor = 1 - Math.abs(star.mass - massOptimal) / massOptimal * 0.2;
  const lumFactor = 1 - Math.abs(star.luminosity - lumOptimal) / lumOptimal * 0.1;
  
  probability *= Math.max(0.1, tempFactor * massFactor * lumFactor);
  
  return Math.max(0, Math.min(100, probability));
}
```

## 8. 별 물리적 특성 계산

### 8.1 반지름 계산

```typescript
const radius = Math.pow(mass, 0.8) * (0.5 + Math.random() * 1.5) * BASE_STAR_RADIUS;
```

**수식:**
```
R = M^0.8 × (0.5 + random(0, 1.5)) × BASE_STAR_RADIUS
```

여기서:
- `M`: 별의 질량 (태양질량 단위)
- `BASE_STAR_RADIUS`: 0.01 (기본 별 반지름 상수)

### 8.2 광도 계산

```typescript
const luminosity = Math.pow(mass, 3.5) * (0.1 + Math.random() * 2);
```

**수식:**
```
L = M^3.5 × (0.1 + random(0, 2.0))
```

### 8.3 시각적 크기 계산

```typescript
const distanceFactor = Math.max(0.1, 1.0 - distance / 500);
const size = Math.max(0.1, distanceFactor * (0.2 + Math.random() * 0.3)) * BASE_STAR_RADIUS * 10;
```

**수식:**
```
d_factor = max(0.1, 1.0 - distance/500)
size = max(0.1, d_factor × (0.2 + random(0, 0.3))) × BASE_STAR_RADIUS × 10
```

### 8.4 자원 재생성 비율

```typescript
function calculateRenewalRate(star: StarData): number {
  let baseRate = 80;
  
  // 광도 계급별 조정
  const luminosityClass = getLuminosityClass(star.spectralClass);
  if (luminosityClass === 'V') baseRate += 10;      // 주계열성은 안정적
  if (luminosityClass.includes('I')) baseRate -= 20; // 거대성은 불안정
  else if (luminosityClass.includes('II')) baseRate -= 10;
  
  // 변광성 조정
  if (star.variableType) baseRate -= 15;
  
  // 극한 환경 조정
  if (star.temperature > 30000 || star.temperature < 2500) baseRate -= 10;
  if (star.mass > 50) baseRate -= 15;
  
  return Math.max(40, Math.min(100, baseRate));
}
```

## 9. 영역별 별 생성 함수

### 9.1 중심 코어 영역

```typescript
function generateCoreStars(count: number): StarData[] {
  const stars: StarData[] = [];
  
  for (let i = 0; i < count; i++) {
    const position = new THREE.Vector3(
      gaussianRandom(0, CORE_X_DIST),
      gaussianRandom(0, GALAXY_THICKNESS),
      gaussianRandom(0, CORE_Y_DIST)
    );
    
    const density = getGalacticDensity(position.x, position.y, position.z);
    if (Math.random() < Math.min(density * 0.3 + 0.1, 0.8)) {
      const starData = createStarFromLocation(position);
      stars.push(starData);
    }
  }
  
  return stars;
}
```

### 9.2 나선팔 영역

```typescript
function generateSpiralArmStars(count: number): StarData[] {
  const stars: StarData[] = [];
  
  for (let arm = 0; arm < ARMS; arm++) {
    for (let i = 0; i < count / ARMS; i++) {
      const position = spiral(
        gaussianRandom(ARM_X_MEAN, ARM_X_DIST),
        gaussianRandom(0, GALAXY_THICKNESS),
        gaussianRandom(ARM_Y_MEAN, ARM_Y_DIST),
        (arm * 2 * Math.PI) / ARMS
      );
      
      const density = getGalacticDensity(position.x, position.y, position.z);
      if (Math.random() < Math.min(density * 0.3 + 0.1, 0.8)) {
        const starData = createStarFromLocation(position);
        stars.push(starData);
      }
    }
  }
  
  return stars;
}
```

### 9.3 헤일로 영역

```typescript
function generateHaloStars(count: number): StarData[] {
  const stars: StarData[] = [];
  
  for (let i = 0; i < count; i++) {
    // 구형 분포
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 800 + Math.random() * 800; // 800-1600 units
    
    const position = new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
    
    const starData = createStarFromLocation(position);
    stars.push(starData);
  }
  
  return stars;
}
```

## 10. AI 생성 함수 개발 가이드

### 10.1 함수 구조 권장사항

1. **모듈화**: 각 영역별로 별도의 생성 함수 작성
2. **설정 기반**: galaxyConfig.ts의 상수들을 활용
3. **확률적 분포**: 실제 은하의 물리적 특성을 반영
4. **성능 최적화**: 밀도 계산을 통한 효율적인 별 배치

### 10.2 핵심 생성 알고리즘

```typescript
export function generateGalaxyStars(config: GalaxyConfig): StarData[] {
  const allStars: StarData[] = [];
  
  // 1. 중심 코어 영역 별 생성
  const coreStars = generateRegionStars('core', config.coreStarCount);
  allStars.push(...coreStars);
  
  // 2. 외곽 코어 영역 별 생성
  const outerCoreStars = generateRegionStars('outercore', config.outerCoreStarCount);
  allStars.push(...outerCoreStars);
  
  // 3. 나선팔 영역 별 생성
  const spiralStars = generateRegionStars('spiral', config.spiralStarCount);
  allStars.push(...spiralStars);
  
  // 4. 헤일로 영역 별 생성
  const haloStars = generateRegionStars('halo', config.haloStarCount);
  allStars.push(...haloStars);
  
  return allStars;
}
```

### 10.3 수정 시 고려사항

- 물리적 현실성: 실제 은하의 특성을 반영
- 게임 밸런스: 자원 분포의 균형성
- 성능 영향: 별 개수와 계산 복잡도
- 시각적 효과: 은하의 아름다운 모습

## 11. 결론

본 문서에서 제시된 수식과 구조를 기반으로 AI는 다음과 같은 작업을 수행할 수 있습니다:

1. **은하 구조 수정**: 새로운 영역 추가 또는 기존 영역 특성 변경
2. **별 분포 조정**: 밀도 함수나 확률 분포 수정
3. **자원 시스템 개선**: 새로운 자원 타입 추가 또는 할당 로직 변경
4. **물리적 특성 조정**: 질량-광도 관계나 크기 계산 수식 수정

모든 수정사항은 이 문서를 기준으로 하며, 변경 시 관련 상수와 수식들의 일관성을 유지해야 합니다.
