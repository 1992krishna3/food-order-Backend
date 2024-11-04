import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ 
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
      quantity: { type: Number, required: true }
  }],
  amount: { type: Number, required: true },
  address: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true }
  },
  paymentInfo: {
      paymentStatus: { type: String, required: true },
      paymentMethod: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});




const Order = mongoose.model("Order", orderSchema);

export default Order;