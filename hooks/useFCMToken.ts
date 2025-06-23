"use client";

import { useEffect } from "react";
import { messaging } from "@/lib/firebase";
import { getToken, onMessage, isSupported } from "firebase/messaging";
import { apiRequest } from "@/lib/api";

export default function useFCMToken(onNotificationReceived: (payload: any) => void) {
  useEffect(() => {
    // Check if window & messaging supported
    const setupFCM = async () => {
      if (typeof window === "undefined") return;

      const supported = await isSupported();
      if (!supported) {
        console.warn("Firebase messaging is not supported in this browser.");
        return;
      }

      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          getToken(messaging, {
            vapidKey:
              "BNiONZn5p2t177kr9aeoDQYgXmrLUKVKsdPZ9QEx_HO0BZrnhNRJGMprbQ0l1p2yBQNn01iUNjr5jA7qKYdRuOo",
          })
            .then(async (currentToken) => {
              if (currentToken) {
                await apiRequest("/api/notifications/save-token", "POST", {
                  fcmToken: currentToken,
                });

                const unsubscribe = onMessage(messaging, (payload) => {
                  console.log("📩 Foreground Notification Received:", payload);
                  onNotificationReceived(payload);
                });

                return () => unsubscribe();
              }
            })
            .catch((err) => {
              console.error("Error getting token:", err);
            });
        }
      });
    };

    setupFCM();
  }, [onNotificationReceived]);
}
