import React, { useState } from "react";
import ModalWithForm from "./ModalWithForm";
import { loginUser, fetchUser } from "../utils/api";
import { setToken } from "../utils/token";

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    loginUser(form)
      .then(({ token, user }) => {
        setToken(token);
        onLoginSuccess(user, token); 
      })
      .catch((err) => {
        console.error("Login error:", err);
        setError("Invalid email or password");
      })
      .finally(() => setLoading(false));
  };
  
  

  return (
    <ModalWithForm onClose={onClose}>
      <form className="modal__form" onSubmit={handleSubmit}>
        <h2>Login</h2>
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
        <div className="modal__buttons">

          <button type="submit">Login</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </ModalWithForm>
  );
};

export default LoginModal;
