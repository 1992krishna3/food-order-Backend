import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

export default generateToken;
