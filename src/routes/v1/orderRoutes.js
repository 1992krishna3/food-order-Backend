import express from "express";
import { createOrder, getOrders, getOrderById } from "../../controllers/orderController.js";


const userRouter = express.Router();


userRouter.post('/', createOrder);
userRouter.get('/', getOrders);
userRouter.get('/:id', getOrderById);

export default userRouter;
