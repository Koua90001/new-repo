cat > config/config.js <<'EOF'
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/final_project';

module.exports = { PORT, JWT_SECRET, MONGODB_URI };
EOF
