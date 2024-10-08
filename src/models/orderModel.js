import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

   items: {
      type:Array,
      required:true
    },
  
  totalAmount: {
    type: Number,
    required: true
  },
  Address: {
    type:Object,
    required:true
  },
  status: {
    type: String,
    default: 'pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  payment: {
    type:Boolean,
    default:false,
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;