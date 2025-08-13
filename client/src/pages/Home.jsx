import React from "react";
import Main from "../components/Main";
import ItemsList from "../components/ItemsList";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleSelect = () => {
    const selectedProduct = {
      id: "bag5",
      name: "5kg Ice Bag",
      price: 1000,
      quantity: 1,
      total: 1000,
      description: "Clean, filtered, food-grade ice.",
    };

    // NOTE: wrap in { product: ... } so Purchase can read location.state.product
    navigate("/purchase", { state: { product: selectedProduct } });
  };

  return (
    <div className="home">
      <Main />
      <section className="home__info">
        <div className="home__features">
          <div className="home__feature">❄️ Freshly frozen, filtered ice</div>
          <div className="home__feature">📱 Pay with MTN & Orange</div>
          <div className="home__feature">🕒 24/7 vending availability</div>
        </div>
      </section>
    </div>
  );
};

export default Home;






