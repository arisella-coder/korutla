import mongoose from "mongoose";
import dbManager from "../../config/db.js";

// -----------------------------------------------------
// Product & Inventory Model (Product DB)
// -----------------------------------------------------
const productDB = await dbManager.getConnection("product");

// Category Schema
const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Category = productDB.model("Category", CategorySchema, "categories");

// SubCategory Schema
const SubCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    // Reference to the parent category
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String },
  },
  { timestamps: true }
);
SubCategorySchema.index({ name: 1, category: 1 }, { unique: true });
const SubCategory = productDB.model("SubCategory", SubCategorySchema, "subcategories");

const UnitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String },
  },
  { timestamps: true }
);
const Unit = productDB.model("Unit", UnitSchema, "units");

// Product Schema
const ProductSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    name: { type: String, required: true, index: true, required: true },
    description: String,
    price: { type: Number, required: true, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
    quantity: { type: Number, required: true, min: 1, required: true },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
    stock: { type: Number, required: true, min: 0, required: true },
    sku: { type: String },
    imageUrl: { type: String },
    online: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

// Virtual field to determine out-of-stock items quickly
ProductSchema.virtual("isOutOfStock").get(function () {
  return this.stock === 0;
});

const Product = productDB.model("Product", ProductSchema, "products");

export { Product,Category,SubCategory,Unit };
