import mongoose from "mongoose";
import dbManager from '../../db.js';

// -----------------------------------------------------
// 4. Cart Model (Cart DB)
// -----------------------------------------------------
const cartDB = await dbManager.getConnection("cart");

const CartSchema = new mongoose.Schema(
  {
    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Cart = cartDB.model("Cart", CartSchema);


export {Cart}