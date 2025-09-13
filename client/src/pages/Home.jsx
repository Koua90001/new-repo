// client/src/pages/Home.jsx
import React from "react";
import Main from "../components/Main";
import WeatherWidget from "../components/WeatherWidget";
import "../components/WeatherWidget.css";
import "./Home.css";

const Home = () => (
  <div className="home">
    <Main />
    <section className="home__weather">
      <WeatherWidget city="Abidjan,CI" />
    </section>
    <section className="home__info">
      <div className="home__features">
        <div className="home__feature">❄️ Freshly frozen, filtered ice</div>
        <div className="home__feature">📱 Pay with MTN & Orange</div>
        <div className="home__feature">🕒 24/7 vending availability</div>
      </div>
    </section>
  </div>
);

export default Home;






