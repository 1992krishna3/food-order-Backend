import Food from "../models/foodModel.js";
import cloudinaryInstance from "../config/cloudinaryConfig.js";


//Add food item
export const addFood = async (req, res) => {
    try {
      console.log(req.file.path,"hitted");
      if(!req.file){
        return res.send("file is not visible")
      }

      //Upload image to Cloudinary
      const result = await cloudinaryInstance.uploader.upload(req.file.path);
      console.log(result, "result");
      

      const imageUrl =result.secure_url;
      const body = req.body;
      console.log(imageUrl)
      console.log(body, "body");

      const { name, description, price } = req.body;
      
     
      const newFood = new Food({
        name,
        description,
        price,
        imageUrl
      });
  
      await newFood.save();
     console.log(newFood);
      res.status(201).json({
        message: 'Food item added successfully',
        food: newFood
      });
    } catch (error) {
        console.log(error);
      res.status(500).json({
        message: 'An error occurred while adding the food item',
        error: error.message
      });
    }
}; 
  
//Get all food items
export const getFoodItems = async (req, res) =>{

    try {
        const foodItems = await Food.find();
        res.status(200).json(foodItems);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

    // Get a food item by ID
export const getFoodItemById = async (req, res) => {
    
    try {
        const foodItem = await Food.findById(req.params.id);
        if (foodItem) {
            res.status(200).json(foodItem);
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

    

// Update a food item
export const updateFoodItem = async (req, res) => {
    const { name, description, price, category } = req.body;

    try {
        let foodItem = await Food.findById(req.params.id);

        if (!foodItem) {
            return res.status(404).json({ msg: 'Food item not found' });
        }

        foodItem = await Food.findByIdAndUpdate(
            req.params.id,
            { $set: { name, description, price, category } },
            { new: true }
        );

        res.json({
            msg: 'Food item updated successfully',
            food: foodItem
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
// Delete a food item
export const deleteFoodItem = async (req, res) => {
    try {
        let foodItem = await Food.findById(req.params.id);
        console.log(foodItem);
        if (!foodItem) {
            return res.status(404).json({ msg: 'Food item not found' });
        }

        await Food.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Food item removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const foodController = {
    addFood,
    getFoodItems,
    getFoodItemById,
    updateFoodItem,
    deleteFoodItem
  };
  
  export default foodController;