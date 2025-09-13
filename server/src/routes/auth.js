cat > routes/auth.js <<'EOF'
const express = require('express');
const { signup, signin } = require('../controllers/authController');
const { signupSchema, signinSchema } = require('../middlewares/validation');

const router = express.Router();

router.post('/signup', signupSchema, signup);
router.post('/signin', signinSchema, signin);

module.exports = router;
EOF
