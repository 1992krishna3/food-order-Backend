import express from "express";
import { createOrder, getOrders, getOrderById } from "../../controllers/orderController.js";
import authMiddleware from "../../middleware/authMiddleware.js";


const orderRouter = express.Router();


orderRouter.post('/create',authMiddleware,createOrder);
orderRouter.get('/', authMiddleware,getOrders);
orderRouter.get('/:id', getOrderById);

export default orderRouter;
