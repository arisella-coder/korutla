// models/users/usersModel.js
import mongoose from "mongoose";
import dbManager from "../../config/db.js";

// -----------------------------------------------------
// Connect to Authentication Database
// -----------------------------------------------------
const authDB = await dbManager.getConnection("auth");

// -----------------------------------------------------
// Base Schema (Common Fields for All Users)
// -----------------------------------------------------
const BaseUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["vendor", "consumer","deliveryagent"], required: true },
    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date,
    personaladdress: {
      hno: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// -----------------------------------------------------
// Vendor Schema (Separate Collection)
// -----------------------------------------------------
const VendorSchema = new mongoose.Schema(
  {
    phone: { type: String },
    storeName: { type: String, required: true },
    storeaddress: {
      hno: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

// Merge with base user schema
VendorSchema.add(BaseUserSchema);

// Create Vendor Model in a separate collection
const Vendor = authDB.model("Vendor", VendorSchema, "vendors");

// -----------------------------------------------------
// Consumer Schema (Separate Collection)
// -----------------------------------------------------
const ConsumerSchema = new mongoose.Schema(
  {
    phone: { type: String },
    addresses: [
      {
        hno: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        phone: String,
        name: String,
      },
    ],
  },
  { timestamps: true }
);

// Merge with base user schema
ConsumerSchema.add(BaseUserSchema);

// Create Consumer Model in a separate collection
const Consumer = authDB.model("Consumer", ConsumerSchema, "consumers");

// -----------------------------------------------------
// Delivery Agent Schema (Separate Collection)
// -----------------------------------------------------
const DeliveryAgentSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    vehicleType: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    online: { type: Boolean, default: false },
    busy: { type: Boolean, default: false },
    // add other delivery agent specific fields here
  },
  { timestamps: true }
);

// Merge base schema fields into delivery agent schema
DeliveryAgentSchema.add(BaseUserSchema);

// Create Delivery Agent Model in a separate collection called "deliveryAgents"
const DeliveryAgent = authDB.model("DeliveryAgent", DeliveryAgentSchema, "deliveryAgents");

export { Vendor, Consumer,DeliveryAgent };
