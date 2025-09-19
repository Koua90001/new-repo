// src/components/ItemCard.jsx
import React from "react";
import "./ItemCard.css";

export default function ItemCard({ item }) {
  const { name, imageUrl, weather, price } = item;
  return (
    <article className="itemcard">
      {imageUrl && <img className="itemcard__img" src={imageUrl} alt={name} />}
      <h3 className="itemcard__title">{name}</h3>
      {weather && <p className="itemcard__meta">For: {weather}</p>}
      {price != null && <p className="itemcard__price">{price} CFA</p>}
    </article>
  );
}
