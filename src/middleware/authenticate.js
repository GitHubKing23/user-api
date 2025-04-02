const jwt = require('jsonwebtoken');

module.exports = function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 👈 sets user info for use in controllers
    next();
  } catch (err) {
    console.error('❌ JWT Verification Failed:', err.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
