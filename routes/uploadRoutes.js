const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticate } = require("../middleware/auth");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

// Helper function to generate file URLs
const generateFileUrl = (filename) => {
  return `http://localhost:3000/uploads/${filename}`;
};

// Helper function to delete a file
const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    const filePath = fileUrl.replace("http://localhost:3000/uploads/", "");
    const fullPath = path.join(uploadDir, filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.error("Error deleting file:", err);
  }
};

// Single file upload
router.post("/single", authenticate, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = generateFileUrl(req.file.filename);

  res.status(200).json({
    message: "Image uploaded successfully",
    file: {
      ...req.file,
      url: fileUrl,
    },
  });
});

// Multiple files upload
router.post(
  "/multiple",
  authenticate,
  upload.array("files", 10),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = req.files.map((file) => ({
      ...file,
      url: generateFileUrl(file.filename),
    }));

    res.status(200).json({
      message: "Images uploaded successfully",
      files: uploadedFiles,
    });
  }
);

// Event-specific upload - for both thumbnail and gallery
router.post(
  "/event",
  authenticate,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  (req, res) => {
    const result = {
      thumbnail: null,
      gallery: [],
    };

    if (req.files) {
      // Process thumbnail
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        result.thumbnail = {
          ...req.files.thumbnail[0],
          url: generateFileUrl(req.files.thumbnail[0].filename),
        };
      }

      // Process gallery images
      if (req.files.gallery) {
        result.gallery = req.files.gallery.map((file) => ({
          ...file,
          url: generateFileUrl(file.filename),
        }));
      }
    }

    res.status(200).json({
      message: "Images uploaded successfully",
      ...result,
    });
  }
);

// Delete a file
router.delete("/:filename", authenticate, async (req, res) => {
  try {
    const fileUrl = `http://localhost:3000/uploads/${req.params.filename}`;
    await deleteFile(fileUrl);

    res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware for uploading files
router.uploadMiddleware = {
  single: upload.single.bind(upload),
  array: upload.array.bind(upload),
  fields: upload.fields.bind(upload),
};

router.fileUtils = {
  generateFileUrl,
  deleteFile,
};

module.exports = router;
