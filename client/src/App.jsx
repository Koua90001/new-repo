// client/src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Preloader from "./components/Preloader/Preloader";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";

import Home from "./pages/Home";
import Purchase from "./pages/Purchase";
import Profile from "./pages/Profile";

import { getToken, setToken, removeToken } from "./utils/token";
import { fetchUser, registerUser } from "./utils/api";

import "./App.css";

function RequireLogin() {
  return (
    <div style={{ padding: "2rem 1rem" }}>
      <h2>Sign in required</h2>
      <p>You need to be logged in to view your profile.</p>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalType, setModalType] = useState(""); // 'login' | 'register' | ''

  const openLoginModal = () => setModalType("login");
  const openRegisterModal = () => setModalType("register");
  const closeModal = () => setModalType("");

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch profile if token exists (initial load or refresh)
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetchUser(token)
      .then((userData) => {
        setCurrentUser(userData);
        setIsLoggedIn(true);
      })
      .catch(() => {
        removeToken();
        setIsLoggedIn(false);
        setCurrentUser(null);
      });
  }, []);

  const handleRegister = (formData) => {
    registerUser(formData)
      .then(({ token, user }) => {
        setToken(token);
        setCurrentUser(user);
        setIsLoggedIn(true);
        closeModal();
      })
      .catch(() => alert("Registration failed"));
  };

  return (
    <Router>
      {isLoading && <Preloader />}
      <div className="app">
        <Header
          isLoggedIn={isLoggedIn}
          onLogoutClick={handleLogout}
          onLoginClick={openLoginModal}
          onRegisterClick={openRegisterModal}
        />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/purchase"
              element={
                <Purchase
                  onPurchaseComplete={(updatedUser) =>
                    setCurrentUser(updatedUser)
                  }
                />
              }
            />
            <Route
              path="/profile"
              element={
                isLoggedIn ? (
                  <Profile currentUser={currentUser} />
                ) : (
                  <RequireLogin />
                )
              }
            />
          </Routes>
        </main>

        <Footer />

        {modalType === "login" && (
          <LoginModal
            onClose={closeModal}
            onLoginSuccess={(user, token) => {
              setCurrentUser(user);
              setIsLoggedIn(true);
              setToken(token);
              closeModal();
            }}
          />
        )}

        {modalType === "register" && (
          <RegisterModal onClose={closeModal} onRegister={handleRegister} />
        )}
      </div>
    </Router>
  );
}

export default App;
