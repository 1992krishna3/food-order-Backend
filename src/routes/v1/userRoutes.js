import express from "express";
import {
  signup,
  signin,
  getUserProfile,
  logout,
  updateUser,
  checkUser,
} from "../../controllers/userControllers.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.post("/logout", logout);
userRouter.put("/update", authMiddleware, updateUser);
userRouter.post("/checkuser", checkUser);

export default userRouter;
