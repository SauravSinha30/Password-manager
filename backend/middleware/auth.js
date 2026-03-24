const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get token from the headers (React will send it as 'Bearer <token>')
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    req.user = verified; // Attach the decoded user payload (which includes the id) to the request
    next(); // Move to the next function
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = verifyToken;