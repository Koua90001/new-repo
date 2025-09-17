import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";

export default function Navigation({ isLoggedIn = false }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav__inner">
        <NavLink to="/" className="nav__brand" onClick={() => setOpen(false)}>
         
        </NavLink>

        {/* Hamburger (mobile) */}
        <button
          type="button"
          className="nav__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__bar" />
          <span className="nav__bar" />
          <span className="nav__bar" />
        </button>

        {/* Menu */}
        <div className={`nav__menu ${open ? "is-open" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) => `nav__link ${isActive ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/purchase"
            className={({ isActive }) => `nav__link ${isActive ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            Purchase
          </NavLink>

          {isLoggedIn && (
            <NavLink
              to="/profile"
              className={({ isActive }) => `nav__link ${isActive ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              Profile
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}


