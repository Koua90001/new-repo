import React from "react";
import Navigation from "./Navigation";
import "./Header.css";
import iceLogo from "../assets/Icelogo.png"; // ✅ Import the actual logo file

const Header = ({ onLoginClick, onRegisterClick }) => {
  return (
    <header className="header">
      <div className="header__brand">
        <img
          src={iceLogo}
          alt="Ice Vending Logo"
          className="header__logo"
        />
        <h1 className="header__title">ICE MAN WORLD</h1>
      </div>

      <div className="header__auth">
        <button className="header__button" onClick={onLoginClick}>Login</button>
        <button className="header__button" onClick={onRegisterClick}>Register</button>
      </div>

      <Navigation />
    </header>
  );
};

export default Header;

