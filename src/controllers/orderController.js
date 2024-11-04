import Order from "../models/orderModel.js";
import dotenv from 'dotenv';
import Razorpay from "razorpay";
import User from "../models/userModel.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    console.log(req.body)
      const { paymentInfo,items, amount,address } = req.body;
      const userId = req.user.id; // Get user ID from the authenticated user

      // Check if items are provided
      if (!items || items.length === 0) {
          return res.status(400).json({ success: false, message: "No items provided" });
      }

      // Create the order
      const newOrder = new Order({
          userId,
          items,
          amount,
          address,
          paymentInfo
           
      });
    
      await newOrder.save();
      res.status(201).json({ success: true, message: "Order created successfully", order: newOrder });
  } catch (error) {
      console.error('Error creating order:',error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};

//Get all orders
export const getOrders= async (req, res) => {
    try {
       // Ensure the user ID is available from the decoded token
    const userId = req.user.id;
    console.log('Fetching orders for User ID:', userId);

        const orders =await Order.find({ userId }).populate('items.food');
        console.log('Fetched orders:', orders);
        res.status(200).json(orders);  
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ msg: 'Server error' });
    }

};

//Get an order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ msg: 'Order not found' });
    }
       res.json(order);
    } catch (err) {
       console.error(err.message);
       res.status(500).send('Server error');
    }
};

const orderController = {
    createOrder,
    getOrders,
    getOrderById
};

export default orderController; 