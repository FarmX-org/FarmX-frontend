// components/NotificationsContainer.tsx
"use client";
import { use, useEffect, useState } from "react";
import Notifications from "@/components/Notifications";
import { useNotificationStore } from "@/stores/notificationStore";
import useFCMToken from "@/hooks/useFCMToken";
import { apiRequest } from "@/lib/api";

export default function NotificationsContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { notifications, addNotification, setNotifications, markAllAsRead } =
    useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await apiRequest("/api/notifications");
      setNotifications(data);
    } catch (err) {
      console.error("❌ Failed to fetch notifications:", err);
    }
  };

  const onNotificationReceived = (payload: any) => {
    const newNoti = {
      id: Date.now(),
      title: payload.notification?.title || "New Notification",
      message: payload.notification?.body || "",
      read: false,
      createdAt: new Date().toISOString(),
    };

    addNotification(newNoti);

    // ✅ Play sound
    const audio = new Audio("/sounds/notify.mp3");
    audio.play().catch((e) => console.error("🔇 Audio play failed:", e));
  };

  useFCMToken(onNotificationReceived);

  const toggleNotifications = async () => {
    const newState = !showNotifications;
    setShowNotifications(newState);

    if (newState) {
      try {
        await apiRequest("/api/notifications/mark-read", "POST");
        markAllAsRead();
      } catch (err) {
        console.error("❌ Failed to mark notifications as read", err);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Notifications
      notifications={notifications}
      showNotifications={showNotifications}
      toggleNotifications={toggleNotifications}
    >
      {children}
    </Notifications>
  );
}
