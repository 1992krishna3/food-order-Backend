import express from "express";
import {addItemToCart,removeItemsFromCart,getCart} from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.post("/add",authMiddleware,addItemToCart);
cartRouter.post("/remove",authMiddleware,removeItemsFromCart);
cartRouter.post("/get",authMiddleware,getCart);

export default cartRouter;
