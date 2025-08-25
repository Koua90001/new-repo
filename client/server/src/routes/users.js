cat > routes/users.js <<'EOF'
const express = require('express');
const { getMe } = require('../controllers/userController');

const router = express.Router();
router.get('/me', getMe);

module.exports = router;
EOF
