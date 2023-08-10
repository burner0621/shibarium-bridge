import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

export const TransactionTypes = {
  APPROVE: "Approve",
  DEPOSIT: "Deposit",
}
const initialState = {};
const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    add: (state, action) => {
      state[action.payload.hash] = action.payload;
      return state;
    },
  },
});

const { actions, reducer } = transactionsSlice;
// Extract and export each action creator by name
export const { add } = actions;
// Export the reducer, either as a default or named export
export default reducer;
