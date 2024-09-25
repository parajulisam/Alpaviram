import { createSlice } from "@reduxjs/toolkit";

const storedAccessToken = localStorage.getItem("accessToken") 
const storedRefreshToken =  localStorage.getItem("refreshToken")

const hasToken = storedAccessToken && storedAccessToken

const initialState = {
  token: hasToken? {accessToken: storedAccessToken, refreshToken: storedRefreshToken} : null
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    clearToken(state) {
      state.token = null;
    },
  },
});

export const { setToken, clearToken } = tokenSlice.actions;

export default tokenSlice.reducer;
