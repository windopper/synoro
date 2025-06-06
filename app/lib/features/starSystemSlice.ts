import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  allStars,
  generateRenderableStars,
  StarData,
} from "../../data/starData";

export interface StarConnection {
  fromStarId: string;
  toStarId: string;
  distance: number;
}

export interface StarSystemState {
  stars: StarData[];
  starConnections: StarConnection[];
  initialized: boolean;
}

const initialState: StarSystemState = {
  stars: generateRenderableStars(allStars),
  starConnections: [],
  initialized: false,
};

export const starSystemSlice = createSlice({
  name: "starSystem",
  initialState,
  reducers: {
    initializeStarSystem: (
      state,
      action: PayloadAction<{ stars: StarData[] }>
    ) => {
      if (!state.initialized) {
        state.stars = action.payload.stars;

        // 별들 간의 연결 관계 계산 (최대 거리 20 units)
        const connections: StarConnection[] = [];
        const maxDistance = 20;

        for (let i = 0; i < action.payload.stars.length; i++) {
          for (let j = i + 1; j < action.payload.stars.length; j++) {
            const star1 = action.payload.stars[i];
            const star2 = action.payload.stars[j];

            const distance = Math.sqrt(
              Math.pow(star1.position.x - star2.position.x, 2) +
                Math.pow(star1.position.y - star2.position.y, 2) +
                Math.pow(star1.position.z - star2.position.z, 2)
            );

            if (distance <= maxDistance) {
              connections.push({
                fromStarId: star1.id,
                toStarId: star2.id,
                distance,
              });
            }
          }
        }
        state.starConnections = connections;
        state.initialized = true;
      }
    },
    setStarVisibility: (state, action: PayloadAction<{ starId: string; isVisible: boolean }>) => {
      const { starId, isVisible } = action.payload;
      const star = state.stars.find((star) => star.id === starId);
      if (star) {
        star.isVisible = isVisible;
      }
    },
    setStarVisibilityBatch: (state, action: PayloadAction<{ starIds: string[]; isVisible: boolean }>) => {
      const { starIds, isVisible } = action.payload;
      starIds.forEach((starId) => {
        const star = state.stars.find((star) => star.id === starId);
        if (star) {
          star.isVisible = isVisible;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(calculateStarConnections.fulfilled, (state, action) => {
      state.starConnections = action.payload;
    });
  },
});

// 비동기로 연결 계산을 수행하는 thunk 생성
export const calculateStarConnections = createAsyncThunk(
  "spaceship/calculateConnections",
  async ({
    stars,
    spaceship,
  }: {
    stars: StarData[];
    spaceship: {
      currentStarId: string | null;
      position: { x: number; y: number; z: number };
    };
  }) => {
    const connections: StarConnection[] = [];
    const maxDistance = 20;

    // 청크 단위로 처리하여 브라우저 렉 방지
    const chunkSize = 100;

    const star1 = stars.find((star) => star.id === spaceship.currentStarId);
    if (!star1) {
      throw new Error("Current star not found in the star list.");
    }

    for (let i = 0; i < stars.length; i++) {
      const star2 = stars[i];
      if (!star2) continue;
      if (star1.id === star2.id) continue; // 자기 자신과의 연결은 제외

      const distance = Math.sqrt(
        Math.pow(star1.position.x - star2.position.x, 2) +
          Math.pow(star1.position.y - star2.position.y, 2) +
          Math.pow(star1.position.z - star2.position.z, 2)
      );

      if (distance <= maxDistance) {
        connections.push({
          fromStarId: star1.id,
          toStarId: star2.id,
          distance,
        });
      }

      // 일정 개수마다 브라우저에 제어권 양보
      if (i % chunkSize === 0 && i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    return connections;
  }
);

export const {
  initializeStarSystem,
  setStarVisibility,
  setStarVisibilityBatch,
} = starSystemSlice.actions;

export default starSystemSlice.reducer;
