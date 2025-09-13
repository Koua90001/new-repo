cat > middlewares/auth.js <<'EOF'
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const { UnauthorizedError } = require('./errors');

module.exports = function auth(req, _res, next) {
  const hdr = req.headers.authorization || '';
  if (!hdr.startsWith('Bearer ')) return next(new UnauthorizedError('Authorization required'));
  try {
    const token = hdr.slice(7);
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return next(new UnauthorizedError('Invalid token'));
  }
};
EOF
