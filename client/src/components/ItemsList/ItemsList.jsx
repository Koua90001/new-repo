// src/components/ItemsList.jsx
import React, { useEffect, useState } from "react";
import { fetchItems } from "../../utils/api";
import Preloader from "../Preloader";
import ItemCard from "./ItemCard";
import "./ItemsList.css";

const PAGE_SIZE = 3;

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // string to render friendly error

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    fetchItems()
      .then((data) => {
        if (cancelled) return;
        // normalize: accept either array or {items:[]}
        const list = Array.isArray(data) ? data : data.items || [];
        setItems(list);
        setVisible(PAGE_SIZE);
      })
      .catch(() => {
        if (cancelled) return;
        setError(
          "Sorry, something went wrong during the request. There may be a connection issue or the server may be down. Please try again later."
        );
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  const showMore = () => setVisible((v) => v + PAGE_SIZE);

  // Loading
  if (loading) return <Preloader />;

  // Error
  if (error)
    return <div className="itemslist__state itemslist__state--error">{error}</div>;

  // Empty
  if (!items.length)
    return <div className="itemslist__state">Nothing found</div>;

  // Success
  const slice = items.slice(0, visible);
  const hasMore = visible < items.length;

  return (
    <section className="itemslist">
      <div className="itemslist__grid">
        {slice.map((item) => (
          <ItemCard key={item.id || item._id || item.name} item={item} />
        ))}
      </div>

      {hasMore && (
        <button className="itemslist__more" onClick={showMore}>
          Show more
        </button>
      )}
    </section>
  );
}
