require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ===== In-memory auth =====
const users = new Map(); // email -> { _id, email, name, passwordHash }
let seq = 1;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// signup
app.post('/signup', async (req, res) => {
  const { email, name, password } = req.body || {};
  if (!email || !name || !password) return res.status(400).json({ error: 'email, name, and password are required' });
  if (users.has(email)) return res.status(409).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { _id: String(seq++), email, name, passwordHash };
  users.set(email, user);
  return res.status(201).json({ _id: user._id, email: user.email, name: user.name });
});

// signin
app.post('/signin', async (req, res) => {
  const { email, password } = req.body || {};
  const user = users.get(email);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid email or password' });
  const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token });
});

// auth middleware for protected routes
function authCheck(req, res, next) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Authorization required' });
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ===== In-memory items (protected) =====
const items = []; // { _id, ownerId, title, data }
let itemSeq = 1;

app.get('/items', authCheck, (req, res) => {
  res.json(items.filter(it => String(it.ownerId) === String(req.user._id)));
});

app.post('/items', authCheck, (req, res) => {
  const { title, data = '' } = req.body || {};
  if (!title || String(title).trim() === '') return res.status(400).json({ error: 'title is required' });
  const newItem = { _id: String(itemSeq++), ownerId: String(req.user._id), title: String(title), data: String(data) };
  items.push(newItem);
  return res.status(201).json(newItem);
});

app.delete('/items/:id', authCheck, (req, res) => {
  const { id } = req.params;
  const idx = items.findIndex(it => it._id === id);
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  if (items[idx].ownerId !== String(req.user._id)) return res.status(403).json({ error: 'Not allowed' });
  const removed = items.splice(idx, 1)[0];
  return res.json({ message: 'Deleted', _id: removed._id });
});

// 404 after all routes
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
