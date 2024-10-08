import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";


//Signup function
export const signup = async (req, res) => {
    try {
      const { firstName, lastName,email, password, confirmPassword,role} = req.body
      console.log(email)
      
      if (!email || !password || !confirmPassword || !firstName || !lastName) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
  }

     
     // Check if the user already exists
      const userExist = await User.findOne({ email });
      console.log(userExist);
      
      if (userExist) {
        return res.status(400).json({message:"User is already exist"});
      }
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const newUser = new User({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role: 'user' 
      });
      
      const newUserCreated = await newUser.save();
      console.log(newUserCreated);
  
      if (!newUserCreated) {
        return res.status(400).json({message:"user is not created"});
      }
      
      // Generate token
      const token = generateToken(newUser._id,newUser.role);
      console.log('Generated Token:', token);
    
      res.status(201).json({message: "Signed successfully!",token});
    } catch (error) {
      console.log(error);
      res.status(500).json({message: "Internal Server Error", error: error.message});
    }
  };
  //Signin function
  export const signin = async (req, res) => {
    try {
      const { email, password } = req.body;
     console.log(email);

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message:"User not found"});
      }
      
      console.log('Received Password:', password);
      console.log('Stored Hashed Password:', user.password);

      const matchPassword = await bcrypt.compare(password, user.password);
      console.log(matchPassword);

      if (!matchPassword) {
        return res.status(400).json({message:"Password is not correct"});
      }
      
      // Generate JWT token
      const token = generateToken(user._id,user.role);
      console.log('Generated Token:', token)
      
      res.status(201).json({message:"signin successful", token});
    } catch (error) {
      console.log(error, "Something wrong");
      res.status(500).json({message:"Internal Server Error", error: error.message});
    }
  };

  

const userController = {
  signup,
  signin,
  
};

export default userController;