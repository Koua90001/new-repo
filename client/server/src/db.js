cat > db.js <<'EOF'
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./config/config');

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Mongo connected'))
  .catch((e) => console.error('Mongo connection error', e));

module.exports = mongoose;
EOF


