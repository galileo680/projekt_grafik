const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // const token = req.header('x-auth-token');
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //req.user = decoded;
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};
