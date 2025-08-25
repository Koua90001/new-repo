import 'dotenv/config.js';
import http from 'http';
import app from './app.js';

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(app);
server.listen(PORT, () => {
  // must start on localhost:3000 per rubric
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`);
});
