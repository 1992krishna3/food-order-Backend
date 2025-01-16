import Cart from "../models/cartModel.js";
import userModel from "../models/userModel.js";
import Food from "../models/foodModel.js";



//Add item to cart
export const addItemToCart = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the entire request body

    const { foodId } = req.body;
    const userId = req.user.id;

    if (!foodId) {
      return res
        .status(400)
        .json({ success: false, message: "food ID is required" });
    }

    // Check if userId is provided
    if (!req.user || !req.user.id) {
      console.error("User ID not found in request.");
      return res
        .status(400)
        .json({ success: false, message: "User ID not found" });
    }

    console.log(`User ID from token: ${userId}`);

    // Find user by ID
    let userData = await userModel.findById(userId);
    console.log("Fetched user data:", userData);
    // Check if userData is null
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    // Add item to cart or increment quantity
    if (!cartData[foodId]) {
      cartData[foodId] = 1;
    } else {
      cartData[foodId] += 1;
    }

    // Update user's cart data
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//Remove items from cart
export const removeItemsFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User ID from token:", userId);

    // Find user by ID
    let userData = await userModel.findById(userId);

    // Check if userData is null
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("User data retrieved:", userData);

    // Get the current cart data
    let cartData = userData.cartData || {};

    //removing items from the cart
    const { itemId } = req.body;

    // Check if the item exists in the cartData before deleting
    if (cartData[itemId]) {
      delete cartData[itemId]; // Remove the item from cartData
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Item not found in cart" });
    }

    // Update the user model with the modified cartData
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//Fetch cart data
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user by ID
    let userData = await userModel.findById(userId);

    // Check if userData is null
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// Add or update cart item
export const updateCart = async (req, res) => {
  try {
    const { userId, foodId, quantity } = req.body;

    // Ensure all required fields are provided
    if (!userId || !foodId || quantity === undefined || quantity < 1) {
      return res.status(400).json({ message: "Invalid data provided." });
    }

    // Find the cart for the user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({ userId, items: [] });
    }

    // Check if the food item is already in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.foodId.toString() === foodId
    );

    if (itemIndex > -1) {
      // Update the quantity if item exists
      cart.items[itemIndex].quantity = quantity;
    } else {
      // Add new item to the cart

      console.log("Received foodId:", foodId);
      const food = await Food.findById(foodId);

      if (!food) {
        return res.status(404).json({ message: "Food item not found." });
      }

      cart.items.push({ foodId, quantity });
    }

    // Save the updated cart
    await cart.save();

    // Send the updated cart as the response
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the cart." });
  }
};

const cartController = {
  addItemToCart,
  removeItemsFromCart,
  getCart,
  updateCart,
};
export default cartController;
