import express from "express";
import userRouter from "./userRoutes.js";
import adminRouter from "./adminRoutes.js";

const apiRouter = express.Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/admin", adminRouter);

export default apiRouter;
