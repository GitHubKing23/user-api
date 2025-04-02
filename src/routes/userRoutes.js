const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ✅ Controllers
const {
  createOrUpdateUser,
  getUser,
  uploadAvatar,
  updateUserProfile, // ✅ Add this!
} = require('../controllers/userController');

// ✅ JWT Middleware (ensure correct import)
const authenticate = require('../middleware/authenticate');

// 🔧 Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 📌 Routes
router.post('/', createOrUpdateUser);
router.get('/:address', getUser);
router.post('/avatar', upload.single('avatar'), uploadAvatar);

// 🔐 JWT-protected route to update profile
router.put('/update', authenticate, updateUserProfile); // ✅ FIXED

module.exports = router;
