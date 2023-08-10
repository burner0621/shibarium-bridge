import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { update } from "./connection";
import { toggle as toggleConfirmationScreen } from "./deposits";
import { IChainSelection, CHAINS_SELECTION } from "utils";

import {
  ChainId,
  DEFAULT_FROM_CHAIN_ID,
  DEFAULT_TO_CHAIN_ID,
  getAddress,
} from "utils";

const initialState = {
  token: ethers.constants.AddressZero,
  amount: ethers.constants.Zero,
  toChain: DEFAULT_TO_CHAIN_ID,
  fromChain: DEFAULT_FROM_CHAIN_ID,
  // Default to ethereum, which should be end of this array.
  currentlySelectedToChain: CHAINS_SELECTION[CHAINS_SELECTION.length - 1],
  currentlySelectedFromChain: CHAINS_SELECTION[0],
};

const sendSlice = createSlice({
  name: "send",
  initialState,
  reducers: {
    token: (state, action) => {
      state.token = action.payload.token;
      return state;
    },
    amount: (state, action) => {
      state.amount = action.payload.amount;
      return state;
    },
    toChain: (state, action) => {
      state.toChain = action.payload.toChain;
      return state;
    },
    fromChain: (state, action) => {
      state.fromChain = action.payload.fromChain;
      return state;
    },
    updateSelectedToChain: (state, action) => {
      state.currentlySelectedToChain = action.payload;
      return state;
    },
    updateSelectedFromChain: (
      state,
      action
    ) => {
      state.currentlySelectedFromChain = action.payload;
      return state;
    },
    toAddress: (
      state,
      action
    ) => {
      state.toAddress = action.payload.toAddress;
      return state;
    },
    error: (state, action) => {
      state.error = action.payload.error;
      return state;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(update, (state, action) => {
        // since this is hooked in from a connection update, we need to treat the address the same way. Onboard is all lowercase.
        state.toAddress = action.payload.account
          ? getAddress(action.payload.account)
          : state.toAddress;
        return state;
      })
      .addCase(toggleConfirmationScreen, (state, action) => {
        // If the confirmation screen is closed, reset some values in the state.
        if (action.payload.showConfirmationScreen === false) {
          state = {
            ...state,
            amount: ethers.constants.Zero,
            error: undefined,
          };
        }
        return state;
      }),
});

export const { actions, reducer } = sendSlice;
// Extract and export each action creator by name
export const { token, amount, fromChain, toChain, toAddress, error } = actions;
// Export the reducer, either as a default or named export
export default reducer;
