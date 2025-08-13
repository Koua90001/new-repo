import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  return (
    <nav className="navigation">
      <Link to="/">Home</Link>
      <Link to="/purchase">Purchase</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  );
};

export default Navigation;
