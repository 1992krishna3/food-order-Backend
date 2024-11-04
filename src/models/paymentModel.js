import mongoose from "mongoose";

// Define the payment schema
const paymentSchema = new mongoose.Schema({
  orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order', // Reference to your Order model
      required: true,
  },
  amount: {
      type: Number,
      required: true,
  },
  currency: {
      type: String,
      required: true,
      default: 'INR', // Default currency
  },
  paymentId: {
      type: String,
      required: true,
      unique: true, // Unique payment ID from Razorpay
  },
  paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'], // Define possible statuses
      default: 'pending', // Default status
  },
  createdAt: {
      type: Date,
      default: Date.now, // Timestamp when payment is created
  },
});

export default mongoose.model("Payment", paymentSchema);