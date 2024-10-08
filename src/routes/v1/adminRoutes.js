import express from "express";
import adminMiddleware from "../../middleware/adminMiddleware.js";
import { getAllUsers, deleteUser, getAllOrders, updateOrderStatus, updateFoodItem, deleteFoodItem } from '../../controllers/adminController.js';

const adminRouter = express.Router();

// Admin-only routes
adminRouter.get('/users', getAllUsers);          // Fetch all users
adminRouter.delete('/user/:id',  deleteUser);     // Delete a user
adminRouter.get('/orders',adminMiddleware, getAllOrders);        // Fetch all orders
adminRouter.put('/order/:id',adminMiddleware,updateOrderStatus); // Update order status
adminRouter.put('/food/:id',adminMiddleware, updateFoodItem);    // Update food item
adminRouter.delete('/food/:id',adminMiddleware,deleteFoodItem); // Delete food item

export default adminRouter;
