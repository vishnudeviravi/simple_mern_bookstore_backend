const jwt = require('jsonwebtoken');

const checkToken = roles => {
  return (req, res, next) => {
    try {
      const bearerToken = req.headers.authorization;

      if (!bearerToken) {
        return res.status(403).json({ message: 'You are not authorized' });
      }

      const token = bearerToken.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log(decoded);
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'You are not authorized' });
      }

      next();
    } catch (e) {
      return res.status(403).json({ message: 'You are not authorized' });
    }
  };
};

module.exports = checkToken;
