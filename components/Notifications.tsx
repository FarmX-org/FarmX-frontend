// components/Notifications.tsx
"use client";
import React from "react";

type NotificationItem = {
  createdAt: string | number | Date;
  id: number;
  title: string;
  message: string;
  read: boolean;
};

type NotificationsProps = {
  notifications: NotificationItem[];
  showNotifications: boolean;
  toggleNotifications: () => void;
  children: React.ReactNode;
};

export default function Notifications({
  notifications,
  showNotifications,
  toggleNotifications,
  children,
}: NotificationsProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {children}

      <div
        style={{
          position: "fixed",
          bottom: "550px",
          right: "15px",
          width: "80px",
          height: "80px",
          cursor: "pointer",
          zIndex: 1000,
        }}
        onClick={toggleNotifications}
      >
        <img
          src="/images/mailbox2.png"
          alt="Mailbox"
          style={{ width: "100%" }}
        />
        {unreadCount > 0 && (
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: "red",
              borderRadius: "50%",
              color: "white",
              width: 20,
              height: 20,
              fontSize: 14,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {/* Top bar with title and X */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontSize: "18px", margin: 0 }}>📬 Notifications</h3>
            <button
              onClick={toggleNotifications}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: "#999",
              }}
              aria-label="Close notifications"
            >
              ❌
            </button>
          </div>

          <hr style={{ margin: "12px 0" }} />

          {notifications.length === 0 && <p>No notifications yet.</p>}

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[...notifications]
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((n) => (
                <li
                  key={n.id}
                  style={{
                    marginBottom: "10px",
                    backgroundColor: n.read ? "#eee" : "#cce5ff",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                >
                  <strong>{n.title}</strong>: {n.message}
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
}
