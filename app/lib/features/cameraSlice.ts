import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CameraState {
    position: { x: number; y: number; z: number }
}

const initialState: CameraState = {
    position: { x: 0, y: 0, z: 0 }
}

export const cameraSlice = createSlice({
    name: 'camera',
    initialState,
    reducers: {
        setCameraPosition: (state, action: PayloadAction<{ x: number; y: number; z: number }>) => {
            state.position = action.payload
        }
    }
})

export const { setCameraPosition } = cameraSlice.actions

export default cameraSlice.reducer