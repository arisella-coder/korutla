import mongoose from "mongoose";
import dbManager from "../../config/db.js";

// -----------------------------------------------------
// Product & Inventory Model (Product DB)
// -----------------------------------------------------
const productDB = await dbManager.getConnection("product");

// Product Schema
const ProductSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, index: true, required: true },
    description: String,
    price: { type: Number, required: true, required: true },
    category: { type: String, index: true, required: true },
    subcategory: { type: String, index: true, required: true },
    quantity: { type: Number, required: true, min: 0, required: true },
    stock: { type: Number, required: true, min: 0, required: true },
    sku: String,
    imageUrl: String,
    online: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

// Virtual field to determine out-of-stock items quickly
ProductSchema.virtual("isOutOfStock").get(function () {
  return this.stock === 0;
});

const Product = productDB.model("Product", ProductSchema);

export { Product };
