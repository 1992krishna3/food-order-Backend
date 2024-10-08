import express from "express";
import {  addFood,getFoodItems,getFoodItemById,updateFoodItem,deleteFoodItem, } from "../../controllers/foodController.js";
import {upload} from "../../middleware/uploadMiddleware.js";



const foodRouter = express.Router();

// Route to add a new food item

foodRouter.post('/add',upload.single('image'), addFood);
foodRouter.get('/list', getFoodItems);
foodRouter.get('/:id', getFoodItemById);
foodRouter.put('/:id',  updateFoodItem);
foodRouter.delete('/:id', deleteFoodItem );

export default foodRouter;
