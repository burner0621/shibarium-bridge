import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import set from "lodash/set";
import { across } from "@uma/sdk";

/*
  State object from SDK:
  pools,
  users,
  transactions
*/

const initialState = {
  pools: {},
  users: {},
  transactions: {},
  error: undefined,
};

const poolsSlice = createSlice({
  name: "pools",
  initialState,
  reducers: {
    update: (state, action) => {
      const nextState = set(state, action.payload.path, action.payload.data);
      return nextState;
    },
    error: (state, action) => {
      state.error = action.payload.error;
      return state;
    },
  },
});

const { actions, reducer } = poolsSlice;
// Extract and export each action creator by name
export const { update, error } = actions;
// Export the reducer, either as a default or named export
export default reducer;
