
// Inventory Transaction Schema
const InventoryTransactionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  change: { type: Number, required: true },
  reason: String,
  newStock: { type: Number, required: true, min: 0 }
}, { timestamps: true });

const InventoryTransaction = productDB.model('InventoryTransaction', InventoryTransactionSchema);

// -----------------------------------------------------
// 3. Order Model (Order DB)
// -----------------------------------------------------
const orderDB = await dbManager.getConnection('order');

const OrderSchema = new mongoose.Schema({
  consumer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

const Order = orderDB.model('Order', OrderSchema);



// -----------------------------------------------------
// 5. Export All Models
// -----------------------------------------------------
export {
  InventoryTransaction,
  Order,
};
