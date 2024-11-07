import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Order from "../models/orderModel.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);


// Create an order
export const createOrder = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { amount, currency } = req.body;
     // Ensure user authentication and necessary data
     if (!req.user || !req.user.id) {
        return res.status(400).json({ success: false, message: "User not authenticated" });
      }

      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid amount" });
      }
    // Create an order in Razorpay
    const options = {
      amount: amount * 100,
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    // Make the request to create an order
    
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create order", error });
  }
};

// Verify payment signature
export const verifyPayment = async (req, res) => {
  try {
    console.log({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    
     // Prepare the payload for Razorpay verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
   

    // Calculate the signature using HMAC
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex'); 

    console.log({ generatedSignature, razorpay_signature }); // Debugging

    // Check if the generated signature matches the Razorpay signature
    if (generatedSignature === razorpay_signature) {
      res
        .status(200)
        .json({ success: true, message: "Payment verified successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }
    // Update order status in database
    const order = await order.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.orderStatus = "Completed";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to verify payment", error });
  }
};

// Generate Razorpay session token
export const generateSessionToken = (req, res) => {
  try {
    console.log("Authenticated user:", req.user); // Log to see if req.user is populated correctly
    
   // Ensure the user is authenticated
   if (!req.user || !req.user.id) {
    console.error("User ID not found in request.");
    return res.status(400).json({ success: false, message: "User not authenticated." });
  }

    // Session token generation logic
    const payload = { userId: req.user.id, timestamp: Date.now() };
    
    console.log("RAZORPAY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

    // Ensure RAZORPAY_SECRET is available
    if (!process.env.RAZORPAY_KEY_SECRET) {
        console.error("Razorpay secret is missing in environment variables.");
        return res.status(500).json({ success: false, message: "Razorpay secret is not configured." });
      }

    const sessionToken = jwt.sign(payload, process.env.RAZORPAY_KEY_SECRET, {
      expiresIn: "15m",
    });

    console.log("Generated Session Token:", sessionToken);
    res.json({ session_token: sessionToken });
  } catch (error) {
    console.error("Error generating session token:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate session token" });
  }
};
