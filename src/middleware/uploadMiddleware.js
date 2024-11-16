import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    console.log("file", file);
    callback(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
