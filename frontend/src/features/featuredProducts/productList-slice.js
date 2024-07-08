import { createSlice } from "@reduxjs/toolkit";

const initialState = { products: [] };

const productListSlice = createSlice({
  name: "productList",
  initialState: initialState,
  reducers: {
    productListSuccess(state, action) {
      state.products = action.payload;
    },
  },
});

export const { productListSuccess } = productListSlice.actions;

export default productListSlice.reducer;
