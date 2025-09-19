// src/utils/api.js
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const handleResponse = async (res) => {
  const ct = res.headers.get('Content-Type') || '';
  const data = ct.includes('application/json') ? await res.json().catch(() => ({})) : {};
  if (!res.ok) throw new Error(data.error || data.message || `${res.status} ${res.statusText}`);
  return data;
};

// --- Auth ---
export const registerUser = ({ name, email, password }) =>
  fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  }).then(handleResponse);

export const loginUser = ({ email, password }) =>
  fetch(`${API_BASE}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);

export const fetchUser = (token) =>
  fetch(`${API_BASE}/users/me?t=${Date.now()}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
    },
  }).then(handleResponse);

// --- Items ---
export const fetchItems = (token) =>
  fetch(`${API_BASE}/items`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  }).then(handleResponse);

// Create purchase -> server stores an item
export const purchaseIce = (token, product) => {
  const body = {
    title: product.name,
    data: {
      id: product.id,
      price: product.price,
      quantity: product.quantity,
      total: product.total,
      description: product.description,
    },
  };
  return fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  }).then(handleResponse);
};

export const deleteItem = (token, id) =>
  fetch(`${API_BASE}/items/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);


