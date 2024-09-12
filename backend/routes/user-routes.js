import express from "express";
const router = express.Router();

import {
  registerUser,
  loginUser,
  forgotPassword,
  getAllUsersInfo,
  getUserProfile,
  logout,
  updatePassword,
  resetPassword,
  getAccessToken,
  updateUserDetails,
  deleteUser,
} from "../controllers/user-controllers.js";
import auth from "../middlewares/auth.js";
import authAdmin from "../middlewares/authAdmin.js";

// public user routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refreshToken", getAccessToken);

router.post("/forgotPassword", forgotPassword);

// private user routes
router.get("/profile", auth, getUserProfile);
router.put("/info", auth, updateUserDetails);

router.get("/logout", logout);
router.put("/updatePassword", auth, updatePassword);
router.post("/resetPassword", auth, resetPassword);

//admin routes
router.get("/getAllUsersInfo", auth, authAdmin, getAllUsersInfo);
router.delete("/:id", authAdmin, deleteUser);
export default router;
