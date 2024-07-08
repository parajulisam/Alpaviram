import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: null,
  userInfo: null,
};

const authUserSlice = createSlice({
  name: "authUser",
  initialState: initialState,

  reducers: {
    setIsAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },

    setUserInfo(state, action) {
      state.userInfo = action.payload.user;
      state.userInfo.isAdmin = action.payload.isAdmin;
    },
  },
});

export const { setIsAuthenticated, setUserInfo } = authUserSlice.actions;

export default authUserSlice.reducer;
