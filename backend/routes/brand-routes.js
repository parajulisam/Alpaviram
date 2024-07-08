import express from "express";
import {
  createBrand,
  deleteBrand,
  findAllBrands,
  updateBrand,
} from "../controllers/brand-controllers.js";
import auth from "../middlewares/auth.js";
import authAdmin from "../middlewares/authAdmin.js";

const router = express.Router();

router.route("/").get(findAllBrands);

// Admin
router.post("/", auth, authAdmin, createBrand);
router.put("/:id", auth, authAdmin, updateBrand);
router.delete("/:id", auth, authAdmin, deleteBrand);

export default router;
