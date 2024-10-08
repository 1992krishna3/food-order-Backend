
import userModel from "../models/userModel.js";

//Add item to cart
export const addItemToCart = async (req,res) => {
  try {
    console.log("Request body:", req.body); // Log the entire request body
    
    const { itemId } = req.body;

   // Check if userId is provided
    if (!req.user || !req.user.id) {
      return res.status(400).json({ success: false, message: "User ID not found" });
    }
    
    const userId = req.user.id;
    
     // Find user by ID
    let userData = await userModel.findById(userId);

    // Check if userData is null
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData =  userData.cartData || {};

    // Add item to cart or increment quantity
    if(!cartData[itemId]){
      cartData[itemId] = 1;
    } else{
        cartData[itemId] += 1;
    }

    // Update user's cart data
    await userModel.findByIdAndUpdate(userId,{cartData});
    res.json({success:true,message:"Added To Cart"});
  }catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

//Remove items from cart
export const removeItemsFromCart = async (req,res) => {
  try {
    const userId = req.user.id; 
    console.log("User ID from token:", userId);

    // Find user by ID
    let userData = await userModel.findById(userId);

    // Check if userData is null
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    console.log("User data retrieved:", userData);

    let cartData = userData.cartData || {};

    //removing items from the cart
    const { itemId } = req.body;
    if (cartData[itemId]) {
        cartData[itemId];
    }

    await userModel.findByIdAndUpdate(userId,{cartData});
    res.json({success:true,message:"Removed From Cart"})
  } catch (error) {
     console.log(error);
     res.json({success:false,message:"Error"})
     }
}


//Fetch cart data
export const getCart = async (req,res) => {
    try {
      const userId = req.user.id;

      // Find user by ID
       let userData = await userModel.findById(userId);

       // Check if userData is null
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

       let cartData = userData.cartData || {};
       res.json({success:true,cartData})
    } catch (error) {
      console.log(error);
      res.json(500)({success:false,message:"Error"})

    }
}


const cartController = {
    addItemToCart,
    removeItemsFromCart,
    getCart
    
};
export default cartController;