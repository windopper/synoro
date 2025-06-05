# Resource Guide Components

모던하고 컴팩트한 디자인으로 재구성된 자원 가이드 컴포넌트들입니다.

## 디자인 특징

- **다크 테마**: Zinc 색상 팔레트 사용
- **네온 포인트**: Cyan 컬러 액센트
- **모던 UI/UX**: Backdrop blur, 그라디언트, 부드러운 애니메이션
- **컴팩트한 레이아웃**: 정보 밀도 최적화

## 구조

```
resource-guide/
├── ResourceGuide.tsx          # 메인 컴포넌트
├── TabNavigation.tsx          # 탭 네비게이션
├── ResourceSummary.tsx        # 자원 요약 카드
├── utils.tsx                  # 공통 유틸리티 함수
├── index.ts                   # Export 정리
└── tabs/
    ├── NeededResourcesTab.tsx      # 필요 자원 탭
    ├── StellarResourcesTab.tsx     # 항성 자원 탭
    └── ManufacturingResourcesTab.tsx # 제조 자원 탭
```

## 컴포넌트 설명

### ResourceGuide.tsx
- 메인 컨테이너 컴포넌트
- 전체 페이지 레이아웃과 상태 관리
- 다크 zinc 배경과 네온 헤더

### TabNavigation.tsx
- 3개 탭 간 전환을 위한 네비게이션
- 선택된 탭에 대한 그라디언트 효과
- 아이콘과 텍스트가 함께 표시

### ResourceSummary.tsx
- 자원 상태 요약을 위한 3개 카드
- 진행률 바와 애니메이션
- 실시간 통계 업데이트

### 탭 컴포넌트들
각 탭은 해당하는 자원 유형의 상세 정보를 제공합니다:

- **NeededResourcesTab**: 모듈 업그레이드에 필요한 자원들
- **StellarResourcesTab**: 항성에서 채굴 가능한 특수 자원들  
- **ManufacturingResourcesTab**: 제조 가능한 자원들 (카테고리 필터링 포함)

## 사용법

```tsx
import { ResourceGuide } from './components/resource-guide';

export default function MyPage() {
  return <ResourceGuide />;
}
```

## 스타일링

모든 컴포넌트는 Tailwind CSS를 사용하며 다음 특징을 가집니다:

- **배경**: `bg-zinc-950`, `bg-zinc-900/60`
- **테두리**: `border-zinc-800`, `border-zinc-700`
- **텍스트**: `text-zinc-100`, `text-zinc-400`
- **액센트**: `text-cyan-400`, `bg-cyan-500`
- **효과**: `backdrop-blur-sm`, `hover:scale-[1.02]`

## 반응형 디자인

- 모바일: 단일 열 레이아웃
- 태블릿: 2열 그리드
- 데스크톱: 3열 그리드 (일부 섹션)

## 애니메이션

- 호버 효과: 스케일링과 그림자
- 진행률 바: 부드러운 너비 전환
- 탭 전환: 페이드 인/아웃
- 버튼: 색상과 크기 변화 