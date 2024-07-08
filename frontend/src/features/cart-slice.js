// import { createSlice } from "@reduxjs/toolkit";

// const defaultProduct = {
//   name: "",
//   _id: 0,
//   quantity: 0,
// };

// const initialState = {
//   //   subTotal: 0,
//   //   totalProduct: 0,
//   products: [],
//   //   shippingCharge: 0,
//   //   grandTotal: 0,
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addProduct: (state, action) => {
//       const productToAdd = action.payload.product;
//       state.products = [...state.products, productToAdd];
//       localStorage.setItem("cart", JSON.stringify(state.products));
//     },
//     removeProduct: (state, action) => {
//       const productId = action.payload.productId;

//       state.products = state.products.filter(
//         (product) => product._id !== productId
//       );
//       localStorage.setItem("cart", JSON.stringify(state.products));
//     },
//     updateCart: (state, action) => {
//       state.products = action.payload.products;
//     },
//     resetCart: () => {
//       return initialState;
//     },
//   },
// });

// export const { addProduct, updateCart, removeProduct } = cartSlice.actions;

// export default cartSlice.reducer;
