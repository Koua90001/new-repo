import React from "react";
import "./Preloader.css";

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="circle-preloader"></div>
      <p className="preloader__text">Loading...</p>
    </div>
  );
};

export default Preloader;
