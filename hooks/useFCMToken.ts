
// hooks/useFCMToken.ts
import { useEffect } from "react";
import { messaging } from "@/firebase/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { apiRequest } from "@/lib/api";

export default function useFCMToken(onNotificationReceived: (payload: any) => void) {
  useEffect(() => {
    if (typeof window === "undefined") return;

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
  }, [onNotificationReceived]);
}
