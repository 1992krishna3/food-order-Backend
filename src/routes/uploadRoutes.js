import express from "express";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", upload, (req, res) => {
  res
    .status(200)
    .json({ message: "File uploaded successfully", file: req.file });
});

export default router;
