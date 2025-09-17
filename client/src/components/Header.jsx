// client/src/components/Header.jsx
import React from "react";
import Navigation from "./Navigation";
import "./Header.css";
import iceLogo from "../assets/Icelogo.png";

const Header = ({ isLoggedIn, onLogoutClick, onLoginClick, onRegisterClick }) => {
  return (
    <header className="header" role="banner">
      <div className="header__top">
        <div className="header__brand">
          <img src={iceLogo} alt="Ice Vending Logo" className="header__logo" />
          <span className="header__title">ICE MAN WORLD</span>
        </div>

        <div className="header__auth" role="group" aria-label="Authentication">
          {isLoggedIn ? (
            <button
              className="header__button header__button--primary"
              onClick={onLogoutClick}
              aria-label="Logout"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                className="header__button header__button--primary"
                onClick={onLoginClick}
                aria-label="Open login"
              >
                Login
              </button>
              <button
                className="header__button header__button--ghost"
                onClick={onRegisterClick}
                aria-label="Open registration"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      <div className="header__nav">
        <Navigation isLoggedIn={isLoggedIn} />
      </div>
    </header>
  );
};

export default Header;


