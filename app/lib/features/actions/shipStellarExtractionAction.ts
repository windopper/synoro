import { createAsyncThunk } from "@reduxjs/toolkit";
import { StarData } from "../../../data/starData";
import { getModuleById } from "../../../data/shipModules";
import { ModuleCategory } from "../../../data/shipModules";
import { ShipSystemsState } from "../shipSystemsSlice";

// === Async Thunk 액션들 ===

// 항성 자원 채취 시작
export const startStellarExtraction = createAsyncThunk(
  "shipSystems/startStellarExtraction",
  async (
    params: {
      star: StarData;
      extractionType: "primary" | "rare";
      resourceType: string;
    },
    { getState }
  ) => {
    const state = getState() as { shipSystems: ShipSystemsState };

    if (!params.star.stellarResources) {
      throw new Error("이 항성에서는 자원을 채취할 수 없습니다");
    }

    const resources = params.star.stellarResources;
    const history =
      state.shipSystems.stellarExtraction.extractionHistory[params.star.id];

    // 시간당 최대 채취 횟수 확인
    if (history && resources.maxExtractionsPerHour) {
      const currentHour = Math.floor(Date.now() / (1000 * 60 * 60));
      const historyHour = Math.floor(history.lastExtraction / (1000 * 60 * 60));

      const extractionsThisHour =
        currentHour === historyHour ? history.extractionsThisHour : 0;

      if (extractionsThisHour >= resources.maxExtractionsPerHour) {
        throw new Error(
          `이 항성에서는 시간당 최대 ${resources.maxExtractionsPerHour}회만 채취할 수 있습니다`
        );
      }
    }

    // 채취 장비 확인
    const extractionModule = Object.values(
      state.shipSystems.installedModules
    ).find((module) => {
      const moduleInfo = getModuleById(module.id);
      return (
        moduleInfo?.category === ModuleCategory.RESOURCE &&
        moduleInfo.id.startsWith("RE_")
      );
    });

    if (!extractionModule) {
      throw new Error("자원 채취를 위해서는 활성화된 채광 장비가 필요합니다");
    }

    // 난이도에 따른 채취 시간 계산
    const baseDuration = {
      easy: 30, // 30초
      medium: 60, // 1분
      hard: 120, // 2분
      extreme: 300, // 5분
    }[resources.extractionDifficulty];

    // 예상 수확량 계산
    const targetResources =
      params.extractionType === "primary"
        ? resources.primaryResources
        : resources.rareResources || {};

    const baseYield = targetResources[params.resourceType] || 0;
    const expectedYield = Math.floor(baseYield * (0.8 + Math.random() * 0.4)); // 80-120% 변동

    if (expectedYield === 0) {
      throw new Error("선택한 자원을 이 항성에서 채취할 수 없습니다");
    }

    return {
      starId: params.star.id,
      extractionType: params.extractionType,
      resourceType: params.resourceType,
      duration: baseDuration,
      expectedYield,
    };
  }
);

// 항성 자원 채취 완료 처리
export const completeStellarExtraction = createAsyncThunk(
  "shipSystems/completeStellarExtraction",
  async (params: { starId: string }, { getState }) => {
    const state = getState() as { shipSystems: ShipSystemsState };
    const extraction =
      state.shipSystems.stellarExtraction.activeExtractions[params.starId];

    if (!extraction) {
      throw new Error("진행 중인 채취 작업이 없습니다");
    }

    // 성공률 계산 (진행도에 따라)
    const successRate = Math.min(0.95, 0.5 + (extraction.progress / 100) * 0.5);
    const isSuccess = Math.random() < successRate;

    if (!isSuccess) {
      return {
        success: false,
        starId: params.starId,
        message: "채취 작업이 실패했습니다. 일부 자원만 회수되었습니다.",
        recoveredResources: {
          [extraction.resourceType]: Math.floor(extraction.expectedYield * 0.3),
        },
      };
    }

    return {
      success: true,
      starId: params.starId,
      message: "자원 채취가 성공적으로 완료되었습니다!",
      obtainedResources: {
        [extraction.resourceType]: extraction.expectedYield,
      },
    };
  }
);

// === ExtraReducers 핸들러 함수들 ===

export const handleStartStellarExtractionFulfilled = (
  state: ShipSystemsState,
  action: any
) => {
  const { starId, extractionType, resourceType, duration, expectedYield } =
    action.payload;

  state.stellarExtraction.activeExtractions[starId] = {
    startTime: Date.now(),
    extractionType,
    estimatedCompletion: Date.now() + duration * 1000,
    progress: 0,
    resourceType,
    expectedYield,
  };

  // 함선 상태 변경
  state.currentState = "extraction";

  // 채취 장비 활성화
  const extractionModuleEntry = Object.entries(state.installedModules).find(
    ([_, module]) => {
      const moduleInfo = getModuleById(module.id);
      return (
        moduleInfo?.category === ModuleCategory.RESOURCE &&
        moduleInfo.id.startsWith("RE_")
      );
    }
  );

  if (extractionModuleEntry) {
    const [moduleId, module] = extractionModuleEntry;
    module.isActive = true;
    module.energyAllocation = 100; // 최대 에너지 할당
  } else {
    console.warn("⚠️ 자원 채취 장비가 설치되지 않았습니다.");
  }
};

export const handleStartStellarExtractionRejected = (
  state: ShipSystemsState,
  action: any
) => {
  console.error("항성 자원 채취 시작 실패:", action.error.message);
};

export const handleCompleteStellarExtractionFulfilled = (
  state: ShipSystemsState,
  action: any
) => {
  const { success, starId, obtainedResources, recoveredResources } =
    action.payload;

  // 함선 상태 변경
  state.currentState = "idle";

  // 채취 작업 제거
  delete state.stellarExtraction.activeExtractions[starId];

  // 채취 장비 비활성화 및 내구도 감소
  const extractionModuleEntry = Object.entries(state.installedModules).find(
    ([_, module]) => {
      const moduleInfo = getModuleById(module.id);
      return (
        moduleInfo?.category === ModuleCategory.RESOURCE &&
        moduleInfo.id.startsWith("RE_")
      );
    }
  );

  if (extractionModuleEntry) {
    const [moduleId, module] = extractionModuleEntry;
    module.isActive = false;
    module.currentDurability = Math.max(0, module.currentDurability - 10);

    console.log(
      `🔧 채취 장비 비활성화: ${moduleId}, 내구도: ${module.currentDurability}`
    );
  }

  // 자원 추가
  const resourcesToAdd = success ? obtainedResources : recoveredResources;
  if (resourcesToAdd) {
    Object.entries(resourcesToAdd).forEach(([resource, amount]) => {
      state.resources.inventory[resource] =
        (state.resources.inventory[resource] || 0) + (amount as number);
    });

    // 현재 용량 재계산
    state.resources.currentCapacity = Object.values(
      state.resources.inventory
    ).reduce((sum, amount) => sum + amount, 0);
  }

  // 채취 이력 업데이트
  const currentTime = Date.now();
  const currentHour = Math.floor(currentTime / (1000 * 60 * 60));

  if (!state.stellarExtraction.extractionHistory[starId]) {
    state.stellarExtraction.extractionHistory[starId] = {
      lastExtraction: currentTime,
      totalExtractions: 1,
      extractionsThisHour: 1,
    };
  } else {
    const history = state.stellarExtraction.extractionHistory[starId];
    const lastHour = Math.floor(history.lastExtraction / (1000 * 60 * 60));

    history.lastExtraction = currentTime;
    history.totalExtractions += 1;

    if (currentHour === lastHour) {
      history.extractionsThisHour += 1;
    } else {
      history.extractionsThisHour = 1;
    }
  }
};

export const handleCompleteStellarExtractionRejected = (
  state: ShipSystemsState,
  action: any
) => {
  console.error("항성 자원 채취 완료 처리 실패:", action.error.message);
};
