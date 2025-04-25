const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ✅ Controllers
const {
  createOrUpdateUser,
  getUser,
  uploadAvatar,
  updateUserProfile,
} = require('../controllers/userController');

// ✅ JWT Middleware
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
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.put('/update', authenticate, updateUserProfile);

// ✅ Health Check Route (placed BEFORE dynamic route)
router.get('/health', (req, res) => {
  res.json({ status: "✅ User API is healthy!" });
});

// 🚨 Dynamic route LAST to avoid conflicts
router.get('/:address', getUser);

module.exports = router;
