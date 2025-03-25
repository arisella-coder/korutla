import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
import { authenticate, authorizeVendor } from "../middleware/auth.js";

const router = express.Router();

// CRUD operations for products
router.post("/", authenticate, authorizeVendor, createProduct);
router.get("/", authenticate, authorizeVendor, getProducts);
router.get("/:id", authenticate, authorizeVendor, getProductById);
router.put('/:id',authenticate, authorizeVendor, updateProduct);
// router.delete('/:id', deleteProduct);

export default router;