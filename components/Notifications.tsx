'use client';
import { useState } from "react";

export default function Notifications({ children }: { children: React.ReactNode }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => setShowNotifications(prev => !prev);

  return (
    <>
      {children}

      {showNotifications && (
        <div style={{
          position: "fixed",
          top: "90px",
          right: "30px",
          backgroundColor: "#fefefe",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          width: "280px",
          zIndex: 1000,
          fontFamily: "sans-serif",
        }}>
          <h3 style={{ marginBottom: "12px", fontSize: "18px", color: "#2d3748" }}>
            📬 Notifications
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
              🌿 <span style={{ marginLeft: "8px" }}>Irrigation is due today.</span>
            </li>
            <li style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
              🌽 <span style={{ marginLeft: "8px" }}>Corn harvest time is near.</span>
            </li>
            <li style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
              ☀️ <span style={{ marginLeft: "8px" }}>Expect sunny weather tomorrow.</span>
            </li>
            <li style={{ display: "flex", alignItems: "center" }}>
              🛒 <span style={{ marginLeft: "8px" }}>New tools available in the store.</span>
            </li>
          </ul>
        </div>
      )}

      <img
        src="/images/mailbox2.png"
        alt="Mailbox"
        onClick={toggleNotifications}
        style={{
          position: "fixed",
          bottom: "550px",
          right: "15px",
          width: "80px",
          height: "auto",
          cursor: "pointer",
          zIndex: 1000,
        }}
      />
    </>
  );
}
