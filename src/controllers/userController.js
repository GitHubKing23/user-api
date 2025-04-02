const path = require('path');
const User = require('../models/User');

// 📌 Create or update user profile
exports.createOrUpdateUser = async (req, res) => {
  const { ethereumAddress, username, bio, avatarUrl } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { ethereumAddress: ethereumAddress.toLowerCase() },
      { username, bio, avatarUrl },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(user);
  } catch (err) {
    console.error('❌ Error creating/updating user:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// 📌 Get user profile
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ ethereumAddress: req.params.address.toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('❌ Error fetching user:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// 📌 Upload avatar (via Multer)
exports.uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { ethereumAddress } = req.body;

  if (!ethereumAddress) {
    return res.status(400).json({ error: 'Ethereum address is required' });
  }

  const avatarUrl = `/uploads/${req.file.filename}`;

  try {
    const user = await User.findOneAndUpdate(
      { ethereumAddress: ethereumAddress.toLowerCase() },
      { avatarUrl },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: '✅ Avatar uploaded', avatarUrl });
  } catch (err) {
    console.error('❌ Error uploading avatar:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// 🔐 JWT-Protected Profile Update
exports.updateUserProfile = async (req, res) => {
  const { username, bio, avatarUrl } = req.body;
  const { ethereumAddress } = req.user; // Extracted from JWT

  try {
    const user = await User.findOneAndUpdate(
      { ethereumAddress: ethereumAddress.toLowerCase() },
      { username, bio, avatarUrl },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: '✅ Profile updated', user });
  } catch (err) {
    console.error('❌ Error updating profile:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
