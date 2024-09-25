import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./cart/cart-slice";
import authUserReducer from "./authUser/authUser-slice";
import tokenReducer from "./token/token-slice";
import userRegisterReducer from "./userRegister/userRegister-slice";
import productListReducer from "./featuredProducts/productList-slice";
import categoryListReducer from "./category/categoryList-slice";
import recommendedProductsReducer from "./recommendedProducts/productList-slice"; // Import the recommended products reducer

const store = configureStore({
  reducer: {
    //user
    userRegister: userRegisterReducer,
    authUser: authUserReducer,
    token: tokenReducer,

    //cart
    cart: cartReducer,

    //category
    categoryList: categoryListReducer,

    //brand

    //product
    featuredProductList: productListReducer,
    recommendedProducts: recommendedProductsReducer,
  },
});

export default store;
