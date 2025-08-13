// src/utils/api.js

// src/utils/api.js
const baseUrl = import.meta.env.PROD ? "/api" : "http://localhost:3001";


// 📦 Unified response handler
const handleResponse = async (res) => {
  const ct = res.headers.get("Content-Type") || "";
  const data = ct.includes("application/json") ? await res.json().catch(() => ({})) : {};
  if (!res.ok) throw new Error(data.message || "Something went wrong with the API");
  return data;
};

// 🧊 GET items
export const fetchItems = () => {
  return fetch(`${baseUrl}/items`, {
    headers: { "Content-Type": "application/json" },
  }).then(handleResponse);
};

// 👤 POST login
export const loginUser = ({ email, password }) => {
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
};

// 🆕 POST register
export const registerUser = ({ name, avatar, email, password }) => {
  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, avatar, email, password }),
  }).then(handleResponse);
};

// 🙋‍♂️ GET user info
export const fetchUser = (token) => {
  return fetch(`${baseUrl}/users/me?t=${Date.now()}`, { // bust caches
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
};


// 💳 POST purchase
export const purchaseIce = (token, product) => {
  return fetch(`${baseUrl}/purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product }),
  }).then(handleResponse);
};


