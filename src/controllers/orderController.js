import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const frontend_url=process.env.FRONTEND_URL

//placing user order for frontend
export const placeOrder = async (req, res) => {
  

  console.log("Received Order Data:", req.body);
  const { userId, address, items, amount } = req.body;

  // Basic validation
  if (!userId || !address || !items || items.length === 0 || !amount) {
    console.error("Missing required fields:", {
      userId,
      address,
      items,
      amount,
    });
    return res
      .status(400)
      .json({ success: false, message: "Invalid order data" });
  }

  // Validate each item in the 'items' array
  for (let item of items) {
    if (!item.name || !item.price || !item.quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid item data" });
    }

    if (typeof item.price !== "number" || item.price <= 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Invalid price for item: ${item.name}. Price must be a positive number.`,
        });
    }

    if (typeof item.quantity !== "number" || item.quantity <= 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Invalid quantity for item: ${item.name}. Quantity must be a positive number.`,
        });
    }
  }

  // Ensure amount is a valid number
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  try {
    // Create the new order in the database
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Prepare line items for Stripe payment
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Add delivery charges
    const deliveryCharge = 2; 
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: Math.round(deliveryCharge * 100),
      },
      quantity: 1,
    });

    // Calculate the total amount
    const totalAmountInINR = amount + deliveryCharge;
    if (totalAmountInINR < 43) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "The total amount must be at least ₹43 to meet the minimum payment requirement.",
        });
    }

    // Create a Stripe session
    const session = await stripe.checkout.sessions.create({

      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error placing order:", error.message, error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};
//To verify order
export const verifyOrder = async (req, res) => {
  const { orderId, success } = req.query;
  console.log("Verifying Order:", { orderId, success });

  try {
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required." });
    }

    if (success === "true" || success === true) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      return res.status(200).json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.status(200).json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

//user orders for frontend
export const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderModel.find({ userId });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin panel
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//api for updating order status
export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const orderController = {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
};

export default orderController;
