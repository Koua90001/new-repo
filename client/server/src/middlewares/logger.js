cat > middlewares/logger.js <<'EOF'
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const requestLogStream = fs.createWriteStream(path.join(logsDir, 'request.log'), { flags: 'a' });
const errorLogStream = fs.createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' });

const requestLogger = morgan('combined', { stream: requestLogStream });
const errorLogger = (err, req, _res, next) => {
  const line = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${err.status || 500} ${err.message}\n`;
  errorLogStream.write(line);
  next(err);
};

module.exports = { requestLogger, errorLogger };
EOF
