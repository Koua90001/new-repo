import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Purchase.css";
import { getToken } from "../utils/token";
import { purchaseIce, fetchUser } from "../utils/api";

const Purchase = ({ onPurchaseComplete }) => {
  console.log('token used for purchase:', getToken()?.slice(0,25) + '...');

  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location.state?.product) {
      navigate("/", { replace: true });
    } else {
      setProduct(location.state.product);
    }
  }, [location, navigate]);

  const handleBuy = async () => {
    const token = getToken();
    if (!token) {
      setStatus("❌ You must be logged in to purchase.");
      return;
    }
    if (!product) return;

    setLoading(true);
    setStatus("");

    try {
      await purchaseIce(token, product);         // store on server
      const updatedUser = await fetchUser(token); // fetch with purchases
      onPurchaseComplete?.(updatedUser);          // update App state
      setStatus("✅ Purchase successful!");
      setTimeout(() => navigate("/profile"), 800);
    } catch (err) {
      console.error("Purchase error:", err);
      setStatus(err.message || "❌ Purchase failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="purchase">
      <h2 className="purchase__title">Confirm Your Purchase</h2>
      <div className="purchase__card">
        <h3 className="purchase__name">
          {product.quantity} × {product.name}
        </h3>
        <p className="purchase__desc">{product.description}</p>
        <p className="purchase__price">Total: {product.total.toLocaleString()} CFA</p>
        <button className="purchase__btn" onClick={handleBuy} disabled={loading}>
          {loading ? "Processing..." : "Confirm Purchase"}
        </button>
        {status && <p className="purchase__status">{status}</p>}
      </div>
    </div>
  );
};

export default Purchase;



