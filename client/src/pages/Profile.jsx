// client/src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import "./Profile.css";
import { getToken } from "../utils/token";
import { fetchUser } from "../utils/api";

const formatMoney = (n) => (typeof n === "number" ? n.toLocaleString() : "—");
const formatDate = (iso) => {
  if (!iso) return "Date unavailable";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "Date unavailable" : d.toLocaleString();
};

const Profile = ({ currentUser: userProp }) => {
  const [user, setUser] = useState(userProp);
  const [state, setState] = useState(userProp ? "idle" : "loading"); // loading | idle | error
  const [err, setErr] = useState("");

  useEffect(() => {
    setUser(userProp);
  }, [userProp]);

  useEffect(() => {
    if (userProp) return; // already provided by App
    const token = getToken();
    if (!token) {
      setState("error");
      setErr("Not logged in");
      return;
    }
    setState("loading");
    fetchUser(token)
      .then((u) => {
        setUser(u);
        setState("idle");
      })
      .catch((e) => {
        setErr(e.message || "Failed to load profile");
        setState("error");
      });
  }, [userProp]);

  if (state === "loading") {
    return <div className="profile"><p>Loading profile…</p></div>;
  }
  if (state === "error") {
    return <div className="profile"><p>⚠️ {err}</p></div>;
  }

  const purchases = user?.purchases || [];

  return (
    <div className="profile">
      <h2 className="profile__title">My Profile</h2>

      <section className="profile__card">
        <img
          src={user?.avatar}
          alt="User avatar"
          className="profile__avatar"
        />
        <p><strong>Name:</strong> {user?.name || "—"}</p>
        <p><strong>Email:</strong> {user?.email || "—"}</p>
      </section>

      <section className="profile__purchases">
        <h3>Purchase History</h3>
        {purchases.length === 0 ? (
          <p className="profile__empty">No purchases yet.</p>
        ) : (
          <ul className="profile__list">
            {purchases.map((p) => {
              const qty   = p.quantity ?? p.data?.quantity ?? 0;
              const name  = p.name ?? p.title ?? p.data?.name ?? "Ice";
              const total = p.total ?? p.data?.total;
              const when  = p.purchasedAt ?? p.createdAt;
              return (
                <li key={p.id} className="profile__item">
                  <div className="profile__row">
                    <span className="profile__prod">{qty} × {name}</span>
                    <span className="profile__amt">{formatMoney(total)} CFA</span>
                  </div>
                  <div className="profile__meta">{formatDate(when)}</div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Profile;




