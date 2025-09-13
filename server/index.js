// server/index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");


const app = express();
// use 3002 so it matches your NGINX proxy
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

app.use(cors());
app.use(bodyParser.json());

// In-memory "database"
let nextUserId = 1;
const usersByEmail = new Map();
const usersById = new Map();
const userPurchases = {};

// 🔐 Auth middleware – accept _id or id
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET); // may have id OR _id
    const userId = payload._id ?? payload.id;
    if (!userId) return res.status(401).json({ message: "Invalid token payload" });
    req.user = { id: userId, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Signup
app.post("/signup", (req, res) => {
  const { name, avatar, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email and password are required" });
  }
  if (usersByEmail.has(email)) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const user = {
    id: String(nextUserId++), // use string ids to look like Mongo ids
    name,
    email,
    avatar: avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000",
    password,
  };

  usersByEmail.set(email, user);
  usersById.set(user.id, user);

  // NOTE: include _id so it’s compatible with other services
  const token = jwt.sign({ _id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  return res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
  });
});

// ✅ Signin
app.post("/signin", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }
  const user = usersByEmail.get(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = jwt.sign({ _id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  return res.status(200).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
  });
});

// ✅ Current user
app.get("/users/me", authenticate, (req, res) => {
  const user = usersById.get(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const purchases = userPurchases[user.id] || [];
  return res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    purchases,
  });
});

// ✅ Purchase
app.post("/purchase", authenticate, (req, res) => {
  const user = usersById.get(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { product } = req.body || {};
  if (!product) {
    return res.status(400).json({ message: "Missing product details" });
  }
  if (!userPurchases[user.id]) userPurchases[user.id] = [];
  userPurchases[user.id].push({ ...product, purchasedAt: new Date().toISOString() });

  return res.status(200).json({ message: "Purchase successful" });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});

