import React, { useState } from "react";
import ModalWithForm from "./ModalWithForm/ModalWithForm";
import LabeledInput from "./LabeledInput/LabeledInput";

const RegisterModal = ({ onClose, onRegister }) => {
  const [form, setForm] = useState({
    name: "",
    avatar: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    onRegister(form); // handled in App.jsx
  };

  return (
    <ModalWithForm onClose={onClose} title="Create your account">
      <form className="modal__form" onSubmit={handleSubmit} noValidate>
        <LabeledInput
          id="reg-name"
          name="name"
          label="Full name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Alice Johnson"
          required
          autoComplete="name"
        />
        <LabeledInput
          id="reg-avatar"
          name="avatar"
          label="Avatar URL"
          value={form.avatar}
          onChange={handleChange}
          placeholder="https://…"
          required
          autoComplete="url"
          inputMode="url"
        />
        <LabeledInput
          id="reg-email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <LabeledInput
          id="reg-password"
          name="password"
          type="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          autoComplete="new-password"
        />

        {error && <p className="modal__error" role="alert">{error}</p>}

        <div className="modal__actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary">Register</button>
        </div>
      </form>
    </ModalWithForm>
  );
};

export default RegisterModal;

