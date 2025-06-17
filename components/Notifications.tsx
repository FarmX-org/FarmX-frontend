"use client";
import { useState } from "react";
import { useNotificationSocket } from "../hooks/useNotificationSocket";

export default function Notifications({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, setNotifications } = useNotificationSocket();

  const toggleNotifications = () => setShowNotifications((prev) => !prev);

  const markAsRead = async (id: number) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("❌ Failed to mark as read", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {children}
      <div style={{ position: "relative" }}>
        <img
          src="/images/mailbox2.png"
          alt="Mailbox"
          onClick={toggleNotifications}
          style={{
            position: "fixed",
            bottom: "550px",
            right: "15px",
            width: "80px",
            cursor: "pointer",
            zIndex: 1000,
          }}
        />
        {unreadCount > 0 && (
          <div
            style={{
              position: "fixed",
              bottom: "585px",
              right: "15px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "12px",
              fontWeight: "bold",
              zIndex: 1001,
            }}
          >
            {unreadCount}
          </div>
        )}
      </div>

      {showNotifications && (
        <div
          style={{
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
          }}
        >
          <h3
            style={{ marginBottom: "12px", fontSize: "18px", color: "#2d3748" }}
          >
            📬 Notifications
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {notifications.map((n) => (
              <li
                key={n.id}
                onClick={() => markAsRead(n.id)}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  opacity: n.read ? 0.6 : 1,
                }}
              >
                📢{" "}
                <span style={{ marginLeft: "8px" }}>
                  {n.title}: {n.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
