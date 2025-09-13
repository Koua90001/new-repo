cat > app.js <<'EOF'
require('dotenv').config();
require('./db');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const { PORT } = require('./config/config');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errors');
const limiter = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(helmet());
app.use(cors({ origin: ['https://iceman.cartes.cl'] }));
app.use(express.json());
app.use(morgan('dev'));
app.use(requestLogger);
app.use(limiter);

// health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// main router
app.use(routes);

// error logging + centralized error handler
app.use(errorLogger);
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`✅ API listening on http://localhost:${PORT}`);
});
EOF


