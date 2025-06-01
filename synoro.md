# Synoro 함선 시스템 기능 분석

## 📋 개요

Synoro 프로젝트의 함선 시스템은 복잡한 우주선 관리 시뮬레이션을 제공하는 핵심 기능입니다. Redux를 기반으로 한 상태 관리와 실시간 시뮬레이션을 통해 몰입감 있는 우주 탐사 경험을 제공합니다.

## 🏗️ 시스템 아키텍처

### 핵심 구성 요소

1. **함선 모듈 시스템** (`app/data/shipModules.ts`)
2. **상태 관리** (`app/lib/features/shipSystemsSlice.ts`)
3. **성능 계산 엔진** (`app/lib/utils/shipPerformanceUtils.ts`)
4. **실시간 시뮬레이션** (`app/lib/utils/shipSystemsSimulation.ts`)
5. **상태 선택자** (`app/lib/utils/shipSystemsSelectors.ts`)

## 🔧 함선 모듈 시스템

### 모듈 카테고리

함선은 6가지 주요 카테고리의 모듈로 구성됩니다:

#### 1. **동력 시스템 (POWER)**
- **핵융합로**: 기본 에너지 생산
- **에너지 분배기**: 전력 분배 및 효율성 관리
- **축전기**: 에너지 저장 및 충방전

#### 2. **항행 시스템 (NAVIGATION)**
- **추진기**: 성계 내 이동 및 가속
- **워프 드라이브**: 성간 여행
- **항법 컴퓨터**: 항로 계산 및 위험 탐지

#### 3. **탐사 시스템 (EXPLORATION)**
- **스캐너**: 천체 및 자원 탐지
- **분석기**: 샘플 분석 및 데이터 처리
- **드론 베이**: 무인 탐사기 운용

#### 4. **통신 시스템 (COMMUNICATION)**
- **장거리 송수신기**: 성간 통신
- **단거리 무선기**: 근거리 신호 탐지

#### 5. **방어 시스템 (DEFENSE)**
- **함체 장갑**: 물리적 보호
- **방어막**: 에너지 차폐
- **수리 시스템**: 자동/수동 복구

#### 6. **자원 관리 (RESOURCE)**
- **채굴 장비**: 자원 채취
- **화물칸**: 자원 저장
- **정제소**: 원자재 가공

### 모듈 계층 시스템

각 모듈은 티어(T0, T1, T2) 기반의 업그레이드 경로를 가집니다:

```typescript
// 예시: 핵융합로 업그레이드 경로
FRC_01_T0 → FRC_01_T1 → FRC_01_T2
(기본형)   (개선형)    (고급형)
```

## 🔋 에너지 관리 시스템

### 에너지 흐름

1. **발전**: 핵융합로에서 기본 에너지 생산
2. **분배**: 분배기를 통한 각 모듈별 에너지 할당
3. **소모**: 활성화된 모듈들의 에너지 소비
4. **저장**: 잉여 에너지의 축전기 저장

### 우선순위 시스템

```typescript
prioritySettings: {
  'FRC_01_T0': 10,    // 핵융합로 (최고 우선순위)
  'PDU_01_T0': 9,     // 전력 분배
  'SE_01_T0': 7,      // 추진 시스템
  'LRS_01_T0': 6,     // 스캐너
  'LRCA_01_T0': 5     // 통신
}
```

### 비상 모드

에너지 부족 시 자동으로 활성화되어 필수 시스템만 유지합니다.

## 🚀 실시간 시뮬레이션

### 시뮬레이션 루프

`ShipSystemsSimulation` 클래스가 주기적으로 다음 시스템들을 업데이트합니다:

1. **에너지 시스템**: 발전/소모/저장 계산
2. **스캐닝**: 탐사 진행도 업데이트
3. **통신**: 데이터 전송 진행도
4. **수리**: 자동 수리 진행
5. **채취**: 자원 채굴 진행
6. **방어막**: 재충전 및 유지

### 자동화 기능

- **자동 수리**: 손상된 모듈 자동 복구
- **에너지 관리**: 모드별 자동 분배
- **스캐닝**: 자동 탐사 모드

## 📊 성능 계산 시스템

### 통합 성능 메트릭

`ShipPerformanceMetrics` 인터페이스를 통해 모든 시스템의 성능을 실시간 계산:

```typescript
interface ShipPerformanceMetrics {
  power: {
    totalGeneration: number;     // 총 발전량
    energyBalance: number;       // 에너지 수지
    efficiency: number;          // 전체 효율
  };
  navigation: {
    systemSpeed: number;         // 성계 내 속도
    maxWarpRange: number;        // 워프 범위
    warpAccuracy: number;        // 워프 정확도
  };
  exploration: {
    maxScanRange: number;        // 스캔 범위
    analysisSpeed: number;       // 분석 속도
    totalDroneCapacity: number;  // 드론 용량
  };
  // ... 기타 카테고리
}
```

### 손상도 영향

모듈의 현재 내구도가 성능에 직접적으로 영향을 미칩니다:

```typescript
const damageMultiplier = module.currentDurability / moduleInfo.durability;
const actualPerformance = basePerformance * damageMultiplier;
```

## 🎛️ 모듈 상태 관리

### 모듈 상태 타입

```typescript
enum ModuleStatus {
  NORMAL = 'NORMAL',                    // 정상 작동
  DAMAGED = 'DAMAGED',                  // 손상 상태
  DISABLED = 'DISABLED',                // 비활성화
  UPGRADING = 'UPGRADING',              // 업그레이드 중
  REPAIRING = 'REPAIRING',              // 수리 중
  ENERGY_SHORTAGE = 'ENERGY_SHORTAGE'   // 에너지 부족
}
```

### 설치된 모듈 정보

```typescript
interface InstalledModule {
  id: string;                    // 모듈 ID
  status: ModuleStatus;          // 현재 상태
  currentDurability: number;     // 현재 내구도
  energyAllocation: number;      // 에너지 할당량 (0-100%)
  isActive: boolean;             // 활성화 여부
  upgradingProgress?: number;    // 업그레이드 진행도
  repairProgress?: number;       // 수리 진행도
}
```

## 🔄 Redux 액션 시스템

### 주요 액션 카테고리

#### 1. **모듈 관리**
- `toggleModuleActive`: 모듈 활성화/비활성화
- `updateModuleEnergyAllocation`: 에너지 할당량 조정
- `damageModule` / `repairModule`: 손상/수리

#### 2. **에너지 관리**
- `setEnergyPriority`: 우선순위 설정
- `toggleEmergencyMode`: 비상 모드 전환
- `updateEnergyStorage`: 저장량 업데이트

#### 3. **자원 관리**
- `addResources` / `consumeResources`: 자원 추가/소모

#### 4. **탐사 및 통신**
- `startScan` / `updateScanProgress`: 스캔 시작/진행
- `addTransmissionToQueue`: 통신 큐 추가

#### 5. **비동기 작업**
- `installModule`: 모듈 설치
- `uninstallModule`: 모듈 제거
- `startModuleUpgrade`: 업그레이드 시작
- `runSystemDiagnostics`: 시스템 진단

## 🎯 고급 기능

### 성능 프로파일

미리 정의된 설정으로 모든 모듈의 에너지 할당을 일괄 조정:

- **탐사 모드**: 스캐너와 통신 시스템 최대화
- **전투 모드**: 방어와 기동성 최대화
- **효율 모드**: 모든 시스템 균형 유지
- **은신 모드**: 에너지 시그니처 최소화

### 자동화 매니저

`AutomationManager` 클래스가 다음 기능을 제공:

- 에너지 자동 분배
- 스캔 우선순위 자동 관리
- 업그레이드 추천 시스템

### 이벤트 시스템

`ShipSystemsEventManager`가 랜덤 이벤트를 관리:

- 운석 충돌
- 에너지 변동
- 시스템 오작동
- 예상치 못한 발견

## 🔍 셀렉터 시스템

효율적인 상태 조회를 위한 메모이제이션된 셀렉터들:

### 기본 셀렉터
- `selectShipSystems`: 전체 함선 상태
- `selectInstalledModules`: 설치된 모듈들
- `selectEnergyManagement`: 에너지 관리 상태

### 카테고리별 셀렉터
- `selectPowerModules`: 동력 시스템만
- `selectNavigationModules`: 항행 시스템만
- `selectExplorationModules`: 탐사 시스템만

### 분석 셀렉터
- `selectDamagedModules`: 손상된 모듈들
- `selectInactiveModules`: 비활성화된 모듈들
- `selectShipPerformance`: 전체 성능 메트릭

## 🚨 진단 및 분석

### 시스템 진단

`runSystemDiagnostics` 비동기 액션이 다음 정보를 제공:

```typescript
interface DiagnosticsResult {
  timestamp: number;
  overallHealth: number;           // 전체 건강도 (0-100)
  criticalIssues: string[];        // 심각한 문제들
  recommendations: string[];       // 권장사항
}
```

### 효율성 분석

각 모듈의 효율성과 업그레이드 필요성을 평가:

```typescript
interface ModuleEfficiency {
  currentEfficiency: number;       // 현재 효율성
  upgradeRecommendation: number;   // 업그레이드 권장도
  bottleneckScore: number;         // 병목 점수
}
```

## 💡 주요 특징

### 1. **실시간 시뮬레이션**
모든 시스템이 실시간으로 상호작용하며 동적인 게임플레이 제공

### 2. **복잡성과 깊이**
6개 카테고리, 다층 티어 시스템으로 깊이 있는 전략적 선택 제공

### 3. **자동화 지원**
플레이어가 원하는 수준의 관리 자동화 가능

### 4. **확장성**
모듈식 설계로 새로운 시스템과 기능 추가 용이

### 5. **성능 최적화**
Redux 셀렉터와 메모이제이션으로 효율적인 상태 관리