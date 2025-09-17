// server/app.js  (ESM)
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

app.use(cors());
app.use(bodyParser.json());

// ---------------- In-memory data ----------------
let nextUserId = 1;
const usersByEmail = new Map(); // email -> user
const usersById = new Map();    // id -> user
const items = [];               // simple “purchases” store

// ---------------- Helpers ----------------
const sign = (user) =>
  jwt.sign({ _id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

const auth = (req, res, next) => {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = h.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const userId = payload._id ?? payload.id;
    if (!userId) return res.status(401).json({ message: 'Invalid token payload' });
    req.user = { id: userId, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ---------------- Health ----------------
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ---------------- Auth ----------------
app.post('/signup', (req, res) => {
  const { name, email, password, avatar } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }
  if (usersByEmail.has(email)) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const user = {
    id: String(nextUserId++),
    name,
    email,
    password, // demo only
    avatar: avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000',
  };
  usersByEmail.set(email, user);
  usersById.set(user.id, user);

  const token = sign(user);
  return res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
  });
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }
  const user = usersByEmail.get(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = sign(user);
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
  });
});

// ---------------- Current user ----------------
app.get('/users/me', auth, (req, res) => {
  const user = usersById.get(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const purchases = items
    .filter((it) => it.ownerId === user.id)
    .map(({ id, title, data, createdAt }) => ({ id, title, data, createdAt }));

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    purchases,
  });
});

// ---------------- Items (used by purchaseIce) ----------------
app.get('/items', auth, (_req, res) => {
  res.json(items);
});

app.post('/items', auth, (req, res) => {
  const { title, data } = req.body || {};
  if (!title) return res.status(400).json({ message: 'title is required' });
  const item = {
    id: String(items.length + 1),
    title,
    data: data || {},
    ownerId: req.user.id,
    createdAt: new Date().toISOString(),
  };
  items.push(item);
  return res.status(201).json(item);
});

app.delete('/items/:id', auth, (req, res) => {
  const idx = items.findIndex((i) => i.id === req.params.id && i.ownerId === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'Item not found' });
  const [removed] = items.splice(idx, 1);
  return res.json(removed);
});

// ---------------- 404 fallback ----------------
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

