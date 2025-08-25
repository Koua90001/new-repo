cat > controllers/userController.js <<'EOF'
const User = require('../models/User');
const { NotFoundError } = require('../middlewares/errors');

exports.getMe = async (req, res, next) => {
  try {
    const me = await User.findById(req.user._id);
    if (!me) throw new NotFoundError('User not found');
    res.json({ _id: me._id, email: me.email, name: me.name });
  } catch (e) { next(e); }
};
EOF
