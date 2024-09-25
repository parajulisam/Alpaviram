import express from "express";
import auth from "../middlewares/auth.js";
import authAdmin from "../middlewares/authAdmin.js";
import {
  createProduct,
  deleteProduct,
  findAllFeaturedProducts,
  findProductById,
  getRecommendedProducts,
  findAllProducts,
  updateProduct,
  createProductReview,
  getSearchedProducts,
  getFilteredProducts,
} from "../controllers/product-controllers.js";
const router = express.Router();

router.get("/search", getSearchedProducts);

router.route("/featured").get(findAllFeaturedProducts);
router.route("/:id").get(findProductById);

// // Products by category
// router.get("/category/:id", findProductsByCategory);

// reviews
router.post("/:id/reviews", auth, createProductReview);

// Admin
router.get("/", findAllProducts);
router.post("/", auth, authAdmin, createProduct);
router.delete("/:id", auth, authAdmin, deleteProduct);
router.put("/:id", auth, authAdmin, updateProduct);
router.post("/get/recommendations",  getRecommendedProducts);
router.get("/get/filter", getFilteredProducts);
export default router;
