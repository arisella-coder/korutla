//models/users/usersModel.js
import mongoose from 'mongoose';
import dbManager from '../../config/db.js';

// -----------------------------------------------------
// Unified User Schema with Discriminators (Auth DB)
// -----------------------------------------------------
const authDB = await dbManager.getConnection('auth');

// Base User Schema (common fields)
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['vendor', 'consumer'], required: true },
    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

const User = authDB.model('User', UserSchema);

// Vendor-specific Schema (discriminator)
const VendorSchema = new mongoose.Schema(
  {
    phone: { type: String },
    storeName: { type: String, required: true },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

const Vendor = User.discriminator('Vendor', VendorSchema);

// Consumer-specific Schema (discriminator)
const ConsumerSchema = new mongoose.Schema(
  {
    phone: { type: String },
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
      },
    ],
  },
  { timestamps: true }
);

const Consumer = User.discriminator('Consumer', ConsumerSchema);

export { User, Vendor, Consumer };
