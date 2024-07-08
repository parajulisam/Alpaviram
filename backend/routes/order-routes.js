import express from "express";
const router = express.Router();
import {
  cancelOrder,
  createOrder,
  getMyOrders,
  getOrderByID,
  getOrders,
  updateOrder,
  updatePayment,
} from "../controllers/order-controllers.js";
import auth from "../middlewares/auth.js";
import authAdmin from "../middlewares/authAdmin.js";

// Routes
router.get("/myorders", auth, getMyOrders);
router.get("/getAllOrders", auth, authAdmin, getOrders);

router.get("/:id", auth, getOrderByID);

router.post("/", auth, createOrder);

router.put("/:id/pay", auth, updatePayment);

router.put("/:id/cancel", auth, cancelOrder);

// Admin
router.put("/:id", auth, authAdmin, updateOrder);

export default router;
