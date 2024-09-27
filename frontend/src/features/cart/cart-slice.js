import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalQuantity: 0,
    total: 0,
    shippingAddress: null,
    paymentMethod: "",
  },

  reducers: {
    updateItemQuantity(state, action) {
      const { productId, qty } = action.payload;
      const item = state.cartItems.find((item) => item.product_id === productId);
    
      if (item) {
        item.qty = qty;
      }
    
      // Recalculate the total quantity and total price
      cartSlice.caseReducers.calculateQtyAndTotal(state);
    },

    calculateQtyAndTotal(state) {
      state.totalQuantity = state.cartItems.reduce(
        (acc, item) => acc + item.qty,
        0
      );

      state.total = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
    },

    addItemToCart(state, action) {
      const addedItem = action.payload;
      const existsItem = state.cartItems.find(
        (item) => item.product_id === addedItem.product_id
      );

      if (existsItem) {
        state.cartItems = state.cartItems.map((item) =>
          item.product_id === existsItem.product_id ? addedItem : item
        );
      } else {
        state.cartItems = [...state.cartItems, addedItem];
      }

      cartSlice.caseReducers.calculateQtyAndTotal(state);
    },

    removeItemFromCart(state, action) {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.product_id !== productId
      );
      cartSlice.caseReducers.calculateQtyAndTotal(state);
    },

    replaceCart(state, action) {
      const cartItems = action.payload;
      state.cartItems = cartItems;
      state.totalQuantity = cartItems.reduce((acc, item) => acc + item.qty, 0);
      state.total = cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
    },

    clearCartItems(state) {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.total = 0;
    },

    clearShippingAddress(state) {
      state.shippingAddress = null;
    },

    saveShippingAddress(state, action) {
      state.shippingAddress = action.payload;
    },

    savePaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
  },
});

export const {
  calculateQtyAndTotal,
  updateItemQuantity,
  addItemToCart,
  removeItemFromCart,
  replaceCart,
  savePaymentMethod,
  clearCartItems,
  clearShippingAddress,
  saveShippingAddress,
} = cartSlice.actions;

export default cartSlice.reducer;