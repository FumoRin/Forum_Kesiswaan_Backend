const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticate } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

router.post('/', authenticate, upload.single('file'), async (req, res) => {
  const uploadToken = process.env.UPLOADTHING_TOKEN;
  const legacySecret = process.env.UPLOADTHING_SECRET;
  const legacyAppId = process.env.UPLOADTHING_APP_ID;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({
    message: 'Image uploaded successfully',
    file: req.file
  });
});

module.exports = router;
