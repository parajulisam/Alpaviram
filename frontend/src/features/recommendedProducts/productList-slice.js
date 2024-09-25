import { createSlice } from "@reduxjs/toolkit";

const initialState = { products: [] };

const recommendedProductsSlice = createSlice({
  name: "recommendedProducts",
  initialState,
  reducers: {
    recommendedProductsSuccess(state, action) {
      state.products = action.payload;
    },
  },
});

// Export the action
export const { recommendedProductsSuccess } = recommendedProductsSlice.actions;

// Export the reducer
export default recommendedProductsSlice.reducer;
