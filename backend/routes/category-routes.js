import express from "express";
import {
  createCategory,
  deleteCategory,
  findAllCategories,
  updateCategory,
} from "../controllers/category-controllers.js";
import auth from "../middlewares/auth.js";
import authAdmin from "../middlewares/authAdmin.js";
const router = express.Router();

router.route("/").get(findAllCategories);

// Admin
router.post("/", auth, authAdmin, createCategory);
router.put("/:id", auth, authAdmin, updateCategory);
router.delete("/:id", auth, authAdmin, deleteCategory);

export default router;
