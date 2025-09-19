// server/index.js (or app.js if that's what you run)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

app.use(cors());
app.use(bodyParser.json());

// In-memory store
let nextUserId = 1;
const usersByEmail = new Map();
const usersById = new Map();
const userPurchases = {}; // { userId: [items...] }

// Auth middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    const userId = payload._id ?? payload.id;
    if (!userId) return res.status(401).json({ message: 'Invalid token payload' });
    req.user = { id: String(userId), email: payload.email };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Signup
app.post('/signup', (req, res) => {
  const { name, email, password, avatar } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: 'name, email and password are required' });
  if (usersByEmail.has(email)) return res.status(409).json({ message: 'Email already registered' });

  const user = {
    id: String(nextUserId++),
    name,
    email,
    password,
    avatar: avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000',
  };
  usersByEmail.set(email, user);
  usersById.set(user.id, user);

  const token = jwt.sign({ _id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  return res.status(201).json({ token, user: { id: user.id, name, email, avatar: user.avatar } });
});

// Signin
app.post('/signin', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
  const user = usersByEmail.get(email);
  if (!user || user.password !== password) return res.status(401).json({ message: 'Invalid email or password' });

  const token = jwt.sign({ _id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  return res.status(200).json({ token, user: { id: user.id, name: user.name, email, avatar: user.avatar } });
});

// Users/me  ✅ (what your client calls after purchase)
app.get('/users/me', authenticate, (req, res) => {
  let user = usersById.get(req.user.id);
  if (!user) {
    // Optional rehydrate to avoid 404 after server restarts
    user = {
      id: req.user.id,
      name: req.user.email?.split('@')[0] || 'User',
      email: req.user.email || `user-${req.user.id}@example.com`,
      avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000',
    };
    usersById.set(user.id, user);
    usersByEmail.set(user.email, user);
  }
  const purchases = userPurchases[user.id] || [];
  return res.json({ id: user.id, name: user.name, email: user.email, avatar: user.avatar, purchases });
});

// Items  ✅ (what your client uses for purchaseIce)
app.post('/items', authenticate, (req, res) => {
  const user = usersById.get(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { title, data } = req.body || {};
  if (!title || !data) return res.status(400).json({ message: 'Missing item payload' });

  const purchase = { id: String(Date.now()), title, data, purchasedAt: new Date().toISOString() };
  userPurchases[user.id] = userPurchases[user.id] || [];
  userPurchases[user.id].push(purchase);

  return res.status(201).json({ message: 'Item stored', purchase });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
