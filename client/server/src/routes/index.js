cat > routes/index.js <<'EOF'
const express = require('express');
const { errors: celebrateErrors } = require('celebrate');
const auth = require('../middlewares/auth');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const itemRoutes = require('./items');

const router = express.Router();

router.use(authRoutes);                 // public: /signup, /signin
router.use('/users', auth, userRoutes); // protected
router.use('/items', auth, itemRoutes); // protected

router.use(celebrateErrors());          // validation error formatter

module.exports = router;
EOF
