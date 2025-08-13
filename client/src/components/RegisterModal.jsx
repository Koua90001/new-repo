import React, { useState } from "react";
import ModalWithForm from "./ModalWithForm";

const RegisterModal = ({ onClose, onRegister }) => {
  const [form, setForm] = useState({
    name: "",
    avatar: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    onRegister(form); // handled in App.jsx
  };

  return (
    <ModalWithForm onClose={onClose}>
      <form className="modal__form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="avatar"
          placeholder="Avatar URL"
          value={form.avatar}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="modal__error">{error}</p>}

        <div className="modal__actions">
          <button type="submit">Register</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </ModalWithForm>
  );
};

export default RegisterModal;

