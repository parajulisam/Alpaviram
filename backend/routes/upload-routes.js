import multer from "multer";
import express from "express";
import path from "path";
import fs from "fs-extra";

import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// To set the storage info (such as destination and file name)
// used in "upload" function
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// To check file type
// used in "upload" function
const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(null, false);
  }
};

// Here file is uploaded
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    To upload image
// @route   GET api/v1/upload
// @access  Public
router.post("/", upload.single("image"), async (req, res) => {
  // After successful upload (send the file path)
  if (!req.file) {
    res.status(400);
    throw new Error(
      "No file received or invalid image file type! Image type must be one of the following (jpg|jpeg|png)"
    );
  }
  console.log(req.file);
  //   console.log(req.file.path);
  const filename = path.basename(req.file.path);

  console.log(filename);
  // Return only the filename
  res.send(`/uploads/${filename}`);
  //   res.send(`${req.file.path.replace("\\", "/")}`);
  //   res.send(req.file.path);
});

// @desc    To delete uploaded image
// @route   GET api/v1/upload/delete
// @access  Public// @desc    To delete uploaded image
// @route   POST api/v1/upload/delete
// @access  Public
router.post("/delete", async (req, res) => {
  try {
    const filePath = req.body.imagePath;

    const file = path.basename(filePath);

    await fs.remove(path.join(__dirname, `../uploads/${file}`));

    res.json("File deleted successfully!");
  } catch (err) {
    console.error("Error occurred while trying to delete the image:", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the image." });
  }
});

export default router;
