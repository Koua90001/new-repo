cat > models/Item.js <<'EOF'
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, maxlength: 120 },
  data: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
EOF
