cat > controllers/authController.js <<'EOF'
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/config');
const { BadRequestError, ConflictError, UnauthorizedError } = require('../middlewares/errors');

exports.signup = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) throw new ConflictError('Email already registered');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, passwordHash });
    res.status(201).json({ _id: user._id, email: user.email, name: user.name });
  } catch (e) {
    if (e.name === 'ValidationError') return next(new BadRequestError('Invalid user data'));
    return next(e);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) throw new UnauthorizedError('Invalid email or password');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedError('Invalid email or password');
    const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (e) { next(e); }
};
EOF
