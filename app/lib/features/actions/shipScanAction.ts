import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { ShipSystemsState } from "../shipSystemsSlice";
import { EXPLORATION_MODULE_SCANNER_PREFIX, getModuleById, ModuleCategory, ModuleInfo } from "@/app/data/shipModules";

export const handleShipStartScanAction = createAsyncThunk(
  "shipSystems/startScan",
  async (_, { getState }) => {
    const state = getState() as RootState;

    const scannerModule = Object.values(state.shipSystems.installedModules).find(
        (module) => {
            const moduleInfo = getModuleById(module.id);
            return moduleInfo?.category === ModuleCategory.EXPLORATION && moduleInfo.id.startsWith(EXPLORATION_MODULE_SCANNER_PREFIX);
        }
    );

    if (Object.keys(state.shipSystems.activeScans).length >= 1) {
        throw new Error("Already scanning");
    }

    if (!scannerModule) {
        throw new Error("Scanner module not found");
    }

    const moduleInfo = getModuleById(scannerModule.id);
    console.log(moduleInfo);
    if (moduleInfo && state.shipSystems.energy.currentStored < moduleInfo.energyConsumption.base) {
        throw new Error("Not enough energy");
    }

    return { moduleInfo };
  }
);

export const handleShipScanCompleteAction = createAsyncThunk(
  "shipSystems/scanComplete",
  async (scanId: string, { getState }) => {
    const state = getState() as RootState;

    if (!state.shipSystems.activeScans[scanId]) {
        throw new Error("Not scanning");
    }

    return { scanId };
  }
);

export const handleShipCancelScanAction = createAsyncThunk(
  "shipSystems/cancelScan",
  async (scanId: string, { getState }) => {
    const state = getState() as RootState;

    if (!state.shipSystems.activeScans[scanId]) {
        throw new Error("Not scanning");
    }

    return { scanId };
  }
);

export const handleShipStartScanActionFulfilled = (
    state: ShipSystemsState,
    action: { payload: { moduleInfo: ModuleInfo | undefined } }
) => {
    if (!action.payload.moduleInfo) {
        throw new Error("Module info not found");
    }

    state.activeScans[action.payload.moduleInfo.id] = {
        targetId: state.currentStarId || 'unknown',
        progress: 0,
        estimatedCompletion: Date.now() + 30 * 1000,
    };

    // 에너지 소모
    state.energy.currentStored -= action.payload.moduleInfo.energyConsumption.base;

    state.currentState = "scanning";
}

export const handleShipStartScanActionRejected = (
    state: ShipSystemsState,
    action: any
) => {
    console.error("Scan start failed:", action.error.message);
}

export const handleShipScanCompleteActionFulfilled = (
    state: ShipSystemsState,
    action: any
) => {
    delete state.activeScans[action.payload.scanId];

    // 활성 스캔이 없으면 상태를 idle로 변경
    if (Object.keys(state.activeScans).length === 0) {
        state.currentState = "idle";
    }
}

export const handleShipScanCompleteActionRejected = (
    state: ShipSystemsState,
    action: any
) => {
    console.error("Scan complete failed:", action.error.message);
}

export const handleShipCancelScanActionFulfilled = (
    state: ShipSystemsState,
    action: any
) => {
    delete state.activeScans[action.payload.scanId];

    if (Object.keys(state.activeScans).length === 0) {
        state.currentState = "idle";
    }
}

export const handleShipCancelScanActionRejected = (
    state: ShipSystemsState,
    action: any
) => {
    console.error("Scan cancel failed:", action.error.message);
}