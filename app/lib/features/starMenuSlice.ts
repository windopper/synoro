import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StarData } from '../../data/starData';

interface StarMenuState {
  showStarMenu: boolean;
  menuStar: StarData | null;
  menuPosition: { x: number; y: number };
}

const initialState: StarMenuState = {
  showStarMenu: false,
  menuStar: null,
  menuPosition: { x: 0, y: 0 },
};

const starMenuSlice = createSlice({
  name: 'starMenu',
  initialState,
  reducers: {
    openStarMenu: (
      state,
      action: PayloadAction<{
        star: StarData;
        position: { x: number; y: number };
      }>
    ) => {
      state.showStarMenu = true;
      state.menuStar = action.payload.star;
      state.menuPosition = action.payload.position;
    },
    closeStarMenu: (state) => {
      state.showStarMenu = false;
      state.menuStar = null;
      state.menuPosition = { x: 0, y: 0 };
    },
    toggleStarMenu: (
      state,
      action: PayloadAction<{
        star: StarData;
        position: { x: number; y: number };
      }>
    ) => {
      if (state.showStarMenu) {
        state.showStarMenu = false;
        state.menuStar = null;
        state.menuPosition = { x: 0, y: 0 };
      } else {
        state.showStarMenu = true;
        state.menuStar = action.payload.star;
        state.menuPosition = action.payload.position;
      }
    },
    setMenuPosition: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      state.menuPosition = action.payload;
    },
  },
});

export const { 
  openStarMenu, 
  closeStarMenu, 
  toggleStarMenu, 
  setMenuPosition 
} = starMenuSlice.actions;

export default starMenuSlice.reducer;

// Selectors
export const selectStarMenuState = (state: { starMenu: StarMenuState }) => state.starMenu;
export const selectShowStarMenu = (state: { starMenu: StarMenuState }) => state.starMenu.showStarMenu;
export const selectMenuStar = (state: { starMenu: StarMenuState }) => state.starMenu.menuStar;
export const selectMenuPosition = (state: { starMenu: StarMenuState }) => state.starMenu.menuPosition; 