cat > models/User.js <<'EOF'
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, minlength: 2, maxlength: 50 },
  passwordHash: { type: String, required: true, select: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
EOF
