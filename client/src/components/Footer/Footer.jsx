import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer__text">© {new Date().getFullYear()} Kouame's Ice Vending Inc. All Rights Reserved</p>
    </footer>
  );
};

export default Footer;
