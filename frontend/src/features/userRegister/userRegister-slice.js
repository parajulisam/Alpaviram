import { createSlice } from "@reduxjs/toolkit";

const userRegisterSlice = createSlice({
  name: "userRegister",
  initialState: {
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    userRegisterRequest(state) {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },

    userRegisterSuccess(state, action) {
      state.isLoading = false;
      state.successMessage = action.payload;
      state.error = null;
    },

    userRegisterFail(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.successMessage = null;
    },
  },
});

export const { userRegisterFail, userRegisterRequest, userRegisterSuccess } =
  userRegisterSlice.actions;

export default userRegisterSlice.reducer;
