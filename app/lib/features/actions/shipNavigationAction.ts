import { createAsyncThunk } from "@reduxjs/toolkit";
import { StarData } from "../../../data/starData";
import { ShipSystemsState } from "../shipSystemsSlice";
import {
  getModuleById,
  ModuleCategory,
  NAVIGATION_MODULE_ENGINE_PREFIX,
  NAVIGATION_MODULE_WARP_PREFIX,
} from "@/app/data/shipModules";

// 일반 항법으로 항성 이동
export const navigateToStar = createAsyncThunk(
  "shipSystems/navigateToStar",
  async (params: { star: StarData; mode: "warp" | "normal" }, { getState }) => {
    const state = getState() as { shipSystems: ShipSystemsState };
    const { star, mode } = params;

    // 항해 모듈 확인
    const navigationModule = Object.values(
      state.shipSystems.installedModules
    ).find((module) => {
      const moduleInfo = getModuleById(module.id);
      return (
        moduleInfo?.category === ModuleCategory.NAVIGATION &&
        moduleInfo.id.startsWith(NAVIGATION_MODULE_ENGINE_PREFIX)
      );
    });

    if (state.shipSystems.navigation) {
      throw new Error("이미 항법 중입니다");
    }

    if (!navigationModule) {
      throw new Error("항해 모듈이 설치되어 있지 않습니다");
    }

    // 에너지 확인
    if (state.shipSystems.energy.currentStored < 50) {
      throw new Error("항해에 필요한 에너지가 부족합니다");
    }

    return { star, mode };
  }
);

// 워프 항법으로 항성 이동
export const navigateToStarWarp = createAsyncThunk(
  "shipSystems/navigateToStarWarp",
  async (star: StarData, { getState }) => {
    const state = getState() as { shipSystems: ShipSystemsState };

    // 워프 항해 모듈 확인
    const warpModule = Object.values(state.shipSystems.installedModules).find(
      (module) => {
        const moduleInfo = getModuleById(module.id);
        return (
          moduleInfo?.category === ModuleCategory.NAVIGATION &&
          moduleInfo.id.startsWith(NAVIGATION_MODULE_WARP_PREFIX)
        );
      }
    );

    if (state.shipSystems.navigation) {
      throw new Error("이미 항법 중입니다");
    }

    if (!warpModule) {
      throw new Error("워프 항해 모듈이 설치되어 있지 않습니다");
    }

    // 워프에 필요한 높은 에너지 확인
    if (state.shipSystems.energy.currentStored < 100) {
      throw new Error("워프 항해에 필요한 에너지가 부족합니다");
    }

    return { star, warpModule };
  }
);

// 항법 완료
export const completeNavigation = createAsyncThunk(
  "shipSystems/completeNavigation",
  async (_, { getState }) => {
    const state = getState() as { shipSystems: ShipSystemsState };

    if (!state.shipSystems.navigation) {
      throw new Error("진행 중인 항법이 없습니다");
    }

    const navigation = state.shipSystems.navigation;

    return {
      targetStarId: navigation.targetStarId,
      targetPosition: navigation.targetPosition,
    };
  }
);

// 항법 취소
export const cancelNavigation = createAsyncThunk(
  "shipSystems/cancelNavigation",
  async (_, { getState }) => {
    const state = getState() as { shipSystems: ShipSystemsState };

    if (!state.shipSystems.navigation) {
      throw new Error("진행 중인 항법이 없습니다");
    }

    return {};
  }
);

// 항법 액션 핸들러들
export const handleNavigateToStarFulfilled = (
  state: ShipSystemsState,
  action: any
) => {
  const { star, mode } = action.payload;
  state.navigation = {
    navigationMode: mode,
    targetStarId: star.id,
    targetPosition: star.position,
    travelProgress: 0,
    travelTime: 0,
    travelSpeed: 0,
    estimatedCompletion: 0,
  };
  state.currentState = "moving";

  // 항해 모듈 활성화
  Object.entries(state.installedModules).forEach(([moduleId, module]) => {
    if (module.id.startsWith(NAVIGATION_MODULE_ENGINE_PREFIX)) {
      module.isActive = true;
      module.energyAllocation = 100;
    }
  });
};

export const handleNavigateToStarRejected = (
  state: ShipSystemsState,
  action: any
) => {
  console.error("항법 시작 실패:", action.error.message);
};

export const handleNavigateToStarWarpFulfilled = (
  state: ShipSystemsState,
  action: any
) => {
  const { star } = action.payload;
  state.navigation = {
    navigationMode: "warp",
    targetStarId: star.id,
    targetPosition: star.position,
    travelProgress: 0,
    travelTime: 0,
    travelSpeed: 0,
    estimatedCompletion: 0,
  };
  state.currentState = "moving";

  // 항해 모듈 활성화
  Object.entries(state.installedModules).forEach(([moduleId, module]) => {
    if (module.id.startsWith(NAVIGATION_MODULE_WARP_PREFIX)) {
      module.isActive = true;
      module.energyAllocation = 100;
    }
  });
};

export const handleNavigateToStarWarpRejected = (
  state: ShipSystemsState,
  action: any
) => {
  console.error("워프 항법 시작 실패:", action.error.message);
};

export const handleCompleteNavigationFulfilled = (
  state: ShipSystemsState,
  action: any
) => {
  const { targetStarId, targetPosition } = action.payload;

  state.currentStarId = targetStarId;
  state.position = targetPosition;
  state.currentState = "idle";
  state.navigation = undefined;

  // 항해 모듈 비활성화
  Object.entries(state.installedModules).forEach(([moduleId, module]) => {
    if (module.id.startsWith(NAVIGATION_MODULE_WARP_PREFIX)) {
      module.isActive = false;
      module.energyAllocation = 0;
    }
  });
};

export const handleCompleteNavigationRejected = (
  state: ShipSystemsState,
  action: any
) => {
  console.error("항법 완료 실패:", action.error.message);
};

export const handleCancelNavigationFulfilled = (
  state: ShipSystemsState,
  action: any
) => {
  state.navigation = undefined;
  state.currentState = "idle";

  // 항해 모듈 비활성화
  Object.entries(state.installedModules).forEach(([moduleId, module]) => {
    if (
      module.id.startsWith(NAVIGATION_MODULE_ENGINE_PREFIX) ||
      module.id.startsWith(NAVIGATION_MODULE_WARP_PREFIX)
    ) {
      module.isActive = false;
      module.energyAllocation = 0;
    }
  });
};

export const handleCancelNavigationRejected = (
  state: ShipSystemsState,
  action: any
) => {
  console.error("항법 취소 실패:", action.error.message);
};
