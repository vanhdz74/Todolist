import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UiState = {
  searchQuery: string;
};

const initialState: UiState = {
  searchQuery: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    clearSearchQuery(state) {
      state.searchQuery = "";
    },
  },
});

export const { clearSearchQuery, setSearchQuery } = uiSlice.actions;

export default uiSlice.reducer;
