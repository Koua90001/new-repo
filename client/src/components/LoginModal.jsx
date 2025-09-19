import React, { useState } from "react";
import ModalWithForm from "./ModalWithForm/ModalWithForm";
import LabeledInput from "./LabeledInput/LabeledInput";
import { loginUser } from "../utils/api";
import { setToken } from "../utils/token";

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, user } = await loginUser(form);
      setToken(token);
      onLoginSuccess(user, token); // updates App state + closes modal in your handler
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWithForm onClose={onClose} title="Sign in">
      <form className="modal__form" onSubmit={handleSubmit} noValidate>
        <LabeledInput
          id="login-email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          autoComplete="email"
          inputMode="email"
        />
        <LabeledInput
          id="login-password"
          name="password"
          type="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        {error && (
          <p className="modal__error" role="alert" aria-live="assertive">
            {error}
          </p>
        )}

        <div className="modal__actions">
          <button type="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </ModalWithForm>
  );
};

export default LoginModal;

