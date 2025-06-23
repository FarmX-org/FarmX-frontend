"use client";

import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { apiRequest } from "@/lib/api";
import { getMessagingClient } from "@/lib/firebaseMessaging";

export default function useFCMToken(onNotificationReceived: (payload: any) => void) {
  useEffect(() => {
    const setup = async () => {
      if (typeof window === "undefined") return;

      const messaging = await getMessagingClient();
      if (!messaging) {
        console.warn("Firebase messaging not supported.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      try {
        const currentToken = await getToken(messaging, {
          vapidKey: "BNiONZn5p2t177kr9aeoDQYgXmrLUKVKsdPZ9QEx_HO0BZrnhNRJGMprbQ0l1p2yBQNn01iUNjr5jA7qKYdRuOo",
        });

        if (currentToken) {
          await apiRequest("/api/notifications/save-token", "POST", {
            fcmToken: currentToken,
          });

          const unsubscribe = onMessage(messaging, (payload) => {
            console.log("📩 Foreground Notification:", payload);
            onNotificationReceived(payload);
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Error retrieving FCM token", error);
      }
    };

    setup();
  }, [onNotificationReceived]);
}
