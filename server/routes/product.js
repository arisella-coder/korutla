import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  createCategory,
  createSubCategory,
  getCategories,
  getSubCategories,
  createUnit,
  getUnits,
} from "../controllers/productController.js";
import { authenticate, authorizeVendor } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createCategoryRules, createSubCategoryRules, createUnitRules, getSubCategoriesRules } from "../validations/productValidations.js";

const router = express.Router();

// Category Endpoints
router.post("/createcategory", validate(createCategoryRules), createCategory);
router.get("/getcategory", authenticate, getCategories);

// Sub Category Endpoints
router.post("/createsubcategory/:category",validate(createSubCategoryRules), createSubCategory);
router.get("/getsubcategories/:category", authenticate,validate(getSubCategoriesRules), getSubCategories);

// Units Endpoints
router.post("/createunit",validate(createUnitRules), createUnit);
router.get("/getunits", authenticate, getUnits);

// CRUD operations for products
router.post("/", authenticate, authorizeVendor, createProduct);
router.get("/", authenticate, authorizeVendor, getProducts);
router.get("/:id", authenticate, authorizeVendor, getProductById);
router.put("/:id", authenticate, authorizeVendor, updateProduct);

// router.delete('/:id', deleteProduct);

export default router;
