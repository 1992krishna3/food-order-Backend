import express from "express";
import {addItemToCart,removeItemsFromCart,getCart,updateCart} from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.post("/add",authMiddleware,addItemToCart);
cartRouter.post("/remove",authMiddleware,removeItemsFromCart);
cartRouter.post("/get",authMiddleware,getCart);
cartRouter.put("/update",authMiddleware,updateCart);

export default cartRouter;
