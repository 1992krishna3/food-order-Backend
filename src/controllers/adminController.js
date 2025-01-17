import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Food from "../models/foodModel.js";
import Admin from '../models/adminModel.js';
import bcrypt from 'bcrypt';


// Admin Signup
export const adminSignup = async (req, res) => {
  try {
    console.log("Request received:", req.body);
    const { firstName,lastName, email, password } = req.body;

   // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("Admin exists");
      return res.status(400).json({ message: 'Admin already exists.' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
   // Save the admin to the database
    await newAdmin.save();
    console.log("New admin created:", newAdmin);
      // Return success response
      res.status(201).json({
        success: true,
        message: "Admin registered successfully.",
        data: {
          id: newAdmin._id,
          email: newAdmin.email,
        },
      });
  } catch (error) {
    console.error("Error during admin signup:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred. Please try again later.",
      error: error.message,
    });
  }  
  
};



// Fetch all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    console.log("Users fetched:", users);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error); // Log the error
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
};

// Fetch all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

// Update order status by ID
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error });
  }
};

// Update food item details
export const updateFoodItem = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    food.name = req.body.name || food.name;
    food.price = req.body.price || food.price;
    food.description = req.body.description || food.description;

    await food.save();
    res.status(200).json({ message: "Food item updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update food item", error });
  }
};

// Delete a food item by ID
export const deleteFoodItem = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete food item", error });
  }
};

const adminController = {
  adminSignup,
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  updateFoodItem,
  deleteFoodItem,
};

export default adminController;
