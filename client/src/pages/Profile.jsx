// src/pages/Profile.jsx
import React from "react";
import "./Profile.css";

const Profile = ({ currentUser }) => {
  if (!currentUser) {
    return (
      <div className="profile">
        <h2 className="profile__title">My Profile</h2>
        <p className="profile__message">Please log in to view your profile.</p>
      </div>
    );
  }

  const purchases = Array.isArray(currentUser.purchases)
    ? currentUser.purchases
    : [];

  return (
    <div className="profile">
      <h2 className="profile__title">My Profile</h2>

      <div className="profile__card">
        <img
          src={currentUser.avatar}
          alt="User avatar"
          className="profile__avatar"
        />
        <div className="profile__info">
          <p>
            <strong>Name:</strong> {currentUser.name}
          </p>
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
        </div>
      </div>

      <div className="profile__purchases">
        <h3>Purchase History</h3>

        {purchases.length === 0 ? (
          <p>No purchases yet.</p>
        ) : (
          <ul className="profile__purchase-list">
            {purchases.map((p, i) => (
              <li key={`${p.purchasedAt ?? i}-${i}`} className="profile__purchase-item">
                <div className="purchase-row">
                  <span className="purchase-name">
                    {p.quantity} × {p.name}
                  </span>
                  <span className="purchase-total">
                    {Number(p.total).toLocaleString()} CFA
                  </span>
                </div>
                <div className="purchase-meta">
                  <small>
                    {p.purchasedAt
                      ? new Date(p.purchasedAt).toLocaleString()
                      : "Date unavailable"}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;




