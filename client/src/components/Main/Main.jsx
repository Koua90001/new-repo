import React, { useState } from "react";
import "./Main.css";
import barsImg from "../../assets/Icebar.jpg";
import blocksImg from "../../assets/Iceblocks.jpg";
import cubesImg from "../../assets/icecube.jpg";

const products = [
  {
    id: "bars",
    name: "Ice Bars",
    image: barsImg,
    description: "Long solid bars of clean, filtered ice. Ideal for coolers and transport.",
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
    description: "Bags of ice cubes ready for drinks, parties, or quick chill needs.",
    price: 500,
  },
];

const Main = () => {
  const [quantities, setQuantities] = useState({ bars: 0, blocks: 0, cubes: 0 });

  const handleQuantityChange = (id, value) => {
    const n = Number.isNaN(Number(value)) ? 0 : Number(value);
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, n) }));
  };

  const handleBuy = (product) => {
    const count = quantities[product.id];
    if (count <= 0) {
      // Not ideal UX but keeps behavior consistent. Consider inline error text instead of alert().
      alert("Please select at least one item.");
      return;
    }

    // Use the router from the page (Home) by dispatching a custom event
    const event = new CustomEvent("purchase:navigate", {
      detail: {
        product: {
          ...product,
          quantity: count,
          total: product.price * count,
        },
      },
    });
    window.dispatchEvent(event);
  };

  return (
    // NOTE: not <main>; this is a section of the page
    <section className="main" aria-label="Product list">
      {/* Section heading is provided by Home. Keep this component heading at h4 to preserve hierarchy */}
      <ul className="main__grid" role="list">
        {products.map((product) => {
          const inputId = `qty-${product.id}`;
          return (
            <li className="main__card" key={product.id}>
              <article className="main__article">
                <header className="main__header">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="main__image"
                    loading="lazy"
                  />
                  <h4 className="main__name">{product.name}</h4>
                </header>

                <p className="main__text">{product.description}</p>
                <p className="main__price">
                  <span className="visually-hidden">Price:</span>
                  {product.price.toLocaleString()} CFA per unit
                </p>

                <div className="main__quantity">
                  <label htmlFor={inputId} className="main__label">
                    Quantity
                  </label>
                  <input
                    id={inputId}
                    name={inputId}
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={quantities[product.id]}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="main__input"
                  />
                </div>

                <button
                  type="button"
                  className="main__buy"
                  aria-label={`Buy ${product.name}`}
                  onClick={() => handleBuy(product)}
                >
                  Buy
                </button>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Main;


