import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";
import barsImg from "../assets/Icebar.jpg";
import blocksImg from "../assets/Iceblocks.jpg";
import cubesImg from "../assets/icecube.jpg";

const products = [
  {
    id: "bars",
    name: "Ice Bars",
    image: barsImg,
    description:
      "Long solid bars of clean, filtered ice. Ideal for coolers and transport.",
    price: 2000,
  },
  {
    id: "blocks",
    name: "Ice Blocks",
    image: blocksImg,
    description: "Large blocks of pure ice for preserving food and drinks.",
    price: 1000,
  },
  {
    id: "cubes",
    name: "Ice Cube Bags",
    image: cubesImg,
    description:
      "Bags of ice cubes ready for drinks, parties, or quick chill needs.",
    price: 500,
  },
];

const Main = () => {
  const [quantities, setQuantities] = useState({
    bars: 0,
    blocks: 0,
    cubes: 0,
  });

  const navigate = useNavigate(); // ✅ init navigate

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, value), // Prevent negative values
    }));
  };

  const handleBuy = (product) => {
    const count = quantities[product.id];
    if (count > 0) {
      navigate("/purchase", {
        state: {
          product: {
            ...product,
            quantity: count,
            total: product.price * count,
          },
        },
      });
    } else {
      alert("Please select at least one item.");
    }
  };

  return (
    <main className="main">
      <h1 className="home__title">Welcome to the Ice Man</h1>
      <p className="home__description">
        Buy clean, fresh ice instantly and securely using mobile money.
      </p>
      <h1 className="main__title">Choose Your Ice</h1>
      <p className="main__description">
        We offer different forms of high-quality ice. Pick what suits your
        needs!
      </p>
      <div className="main__products">
        {products.map((product) => (
          <div className="main__card" key={product.id}>
            <img
              src={product.image}
              alt={product.name}
              className="main__image"
            />
            <h3 className="main__name">{product.name}</h3>
            <p className="main__text">{product.description}</p>
            <p className="main__price">{product.price} CFA per unit</p>

            <div className="main__quantity">
              <label htmlFor={`qty-${product.id}`}>Quantity:</label>
              <input
                type="number"
                id={`qty-${product.id}`}
                min="0"
                value={quantities[product.id]}
                onChange={(e) =>
                  handleQuantityChange(product.id, parseInt(e.target.value))
                }
              />
            </div>

            <button
              className="main__buy"
              onClick={() => handleBuy(product)}
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Main;

