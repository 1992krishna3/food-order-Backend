import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
 try {

 //Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  
  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  console.log(token);
  
  // Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET );
    console.log('Decoded token:', decoded);    

    // Check if decoded contains the user object and its id
    if (!decoded ||!decoded.id) {
      return res.status(401).json({ msg: 'Token is invalid' });
    }
    req.user = decoded;

    // Check if user exists
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    next();

    const roleAuthorization = (allowedRoles) => {
      return (req, res, next) => {
          if (!allowedRoles.includes(req.user.role)) {
              return res.status(403).json({ message: "Access denied: insufficient permissions" });
          }
          next();
      };
  };
  
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token has expired" });
    } else if (err.name === "JsonWebTokenError") {
    res.status(401).json({ msg: 'Token is not valid' });
  } else {
    return res.status(500).json({ msg: "Server error" });
};
}
}
export default authMiddleware;