import { configureStore } from "@reduxjs/toolkit";
import starSystemReducer from "./features/starSystemSlice";
import shipSystemsReducer from "./features/shipSystemsSlice";
import cameraReducer from "./features/cameraSlice";
import starMenuReducer from "./features/starMenuSlice";

export const store = configureStore({
  reducer: {
    starSystem: starSystemReducer,
    shipSystems: shipSystemsReducer,
    camera: cameraReducer,
    starMenu: starMenuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
