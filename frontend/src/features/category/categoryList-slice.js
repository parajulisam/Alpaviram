import { createSlice } from "@reduxjs/toolkit";

const initialState = { categories: [] };

const categoryListSlice = createSlice({
  name: "categoryList",
  initialState: initialState,
  reducers: {
    categoryListSuccess(state, action) {
      state.categories = action.payload;
    },
  },
});

export const { categoryListSuccess } = categoryListSlice.actions;

export default categoryListSlice.reducer;
