import { createAsyncThunk } from "@reduxjs/toolkit";
import { ShipSystemsState } from "../shipSystemsSlice";

export const cancelTransmission = createAsyncThunk(
  "shipSystems/cancelTransmission",
  async (transmissionId: string, { getState }) => {
    const state = getState() as { shipSystems: ShipSystemsState };

    if (!state.shipSystems.communicationStatus.transmissionQueue[transmissionId]) {
      throw new Error("전송 취소 처리 중인 전송이 없습니다");
    }

    return { transmissionId };
  }
);

export const completeTransmission = createAsyncThunk(
  "shipSystems/completeTransmission",
  async (transmissionId: string, { getState }) => {
    const state = getState() as { shipSystems: ShipSystemsState };

    if (!state.shipSystems.communicationStatus.transmissionQueue[transmissionId]) {
      throw new Error("전송 완료 처리 중인 전송이 없습니다");
    }

    return { transmissionId };
  }
);

export const handleCompleteTransmissionFulfilled = (
    state: ShipSystemsState,
    action: { payload: { transmissionId: string } }
) => {
    const { transmissionId } = action.payload;
    
    // 완료된 전송을 이력에 추가 (큐에서 삭제하기 전에)
    const transmission = state.communicationStatus.transmissionQueue[transmissionId];
    if (transmission) {
        state.communicationStatus.transmissionHistory[transmissionId] = {
            type: transmission.type,
            title: transmission.title,
            content: transmission.content,
            dataSize: transmission.dataSize,
            priority: transmission.priority,
            progress: 100,
            endTime: Date.now(),
            result: "fulfilled",
        };
    }

    // 큐에서 제거
    delete state.communicationStatus.transmissionQueue[transmissionId];
};

export const handleCompleteTransmissionRejected = (
    state: ShipSystemsState,
    action: any
) => {

};  

export const handleCancelTransmissionFulfilled = (
    state: ShipSystemsState,
    action: { payload: { transmissionId: string } }
) => {
    const { transmissionId } = action.payload;
    
    // 취소된 전송을 이력에 추가 (큐에서 삭제하기 전에)
    const transmission = state.communicationStatus.transmissionQueue[transmissionId];
    if (transmission) {
        state.communicationStatus.transmissionHistory[transmissionId] = {
            type: transmission.type,
            title: transmission.title,
            content: transmission.content,
            dataSize: transmission.dataSize,
            priority: transmission.priority,
            progress: transmission.progress,
            endTime: Date.now(),
            result: "cancelled",
        };
    }
    
    // 큐에서 제거
    delete state.communicationStatus.transmissionQueue[transmissionId];
};

export const handleCancelTransmissionRejected = (
    state: ShipSystemsState,
    action: any
) => {
    console.error("전송 취소 실패:", action.error.message);
};