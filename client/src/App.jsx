import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Preloader from "./components/Preloader";
import ModalWithForm from "./components/ModalWithForm";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import MomoTest from "./components/MomoTest";

import Home from "./pages/Home";
import Purchase from "./pages/Purchase";
import Profile from "./pages/Profile";

import { getToken, setToken } from "./utils/token";
import { fetchUser, registerUser } from "./utils/api";

import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalType, setModalType] = useState(""); // 'login' or 'register'

  const openLoginModal = () => setModalType("login");
  const openRegisterModal = () => setModalType("register");
  const closeModal = () => setModalType("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchUser(token)
        .then((userData) => {
          setCurrentUser(userData);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          console.error("Token invalid:", err);
          localStorage.removeItem("jwt");
          setIsLoggedIn(false);
        });
    }
  }, []);

  const handleRegister = (formData) => {
    registerUser(formData)
      .then(({ token, user }) => {
        setToken(token);
        setCurrentUser(user);
        setIsLoggedIn(true);
        closeModal();
      })
      .catch((err) => {
        console.error("Registration failed:", err);
        alert("Registration failed");
      });
  };

  return (
    <Router>
      {isLoading && <Preloader />}
      <div className="app">
        <Header onLoginClick={openLoginModal} onRegisterClick={openRegisterModal} />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/purchase"   
            element={
             <Purchase
             onPurchaseComplete={(updatedUser) => {
              setCurrentUser(updatedUser); 
            }}
             />
            }
             />
            <Route path="/profile" element={<Profile currentUser={currentUser} />} />
          </Routes>
        </main>

        <Footer />

        {modalType && (
          <ModalWithForm onClose={closeModal}>
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
          </ModalWithForm>
        )}
      </div>
    </Router>
  );
}

export default App;

