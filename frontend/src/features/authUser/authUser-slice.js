import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false, // Initialize to false to avoid null checks
  userInfo: null,
  userId: null, // Add userId to the state
};

const authUserSlice = createSlice({
  name: "authUser",
  initialState: initialState,

  reducers: {
    setIsAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },

    setUserInfo(state, action) {
      const { user, isAdmin } = action.payload;
      console.log("Setting user info:", user); // Add this log for debugging

      state.userInfo = user;
      state.userId = user?.user_id || null; // Ensure user_id is set correctly
      state.userInfo.isAdmin = isAdmin;
    },
  },
});

export const { setIsAuthenticated, setUserInfo } = authUserSlice.actions;

export default authUserSlice.reducer;
