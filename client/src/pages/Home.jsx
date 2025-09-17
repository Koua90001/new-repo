import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";   // ✅ import useNavigate
import Main from "../components/Main";
import WeatherWidget from "../components/WeatherWidget";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      navigate("/purchase", { state: { product: e.detail.product } });
    };
    window.addEventListener("purchase:navigate", handler);
    return () => window.removeEventListener("purchase:navigate", handler);
  }, [navigate]);

  return (
    <div className="home" role="document">
      <h1 className="home__title">Welcome to the Ice Man</h1>

      <section className="home__intro" aria-labelledby="home-intro-heading">
        <h2 id="home-intro-heading" className="home__heading">
          Shop fresh, filtered ice
        </h2>
        <p className="home__description">
          Buy clean, fresh ice instantly and securely using mobile money.
        </p>
      </section>

      <section className="home__products" aria-labelledby="home-products-heading">
        <h2 id="home-products-heading" className="home__heading">Choose your ice</h2>
        <Main />
      </section>

      <section className="home__weather" aria-labelledby="home-weather-heading">
        <h2 id="home-weather-heading" className="home__heading">
          Current weather in Abidjan
        </h2>
        <WeatherWidget city="Abidjan,CI" />
      </section>

      <section className="home__features" aria-labelledby="home-features-heading">
        <h2 id="home-features-heading" className="home__heading"></h2>
        <ul className="home__featureList">
          <li className="home__feature">❄️ Freshly frozen, filtered ice</li>
          <li className="home__feature">📱 Pay with MTN & Orange</li>
          <li className="home__feature">🕒 24/7 vending availability</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;






