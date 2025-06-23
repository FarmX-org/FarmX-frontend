// hooks/useFCMToken.ts
import { useEffect } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { apiRequest } from "@/lib/api";
import { app } from "@/lib/firebase";

export default function useFCMToken(onNotificationReceived: (payload: any) => void) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const messaging = getMessaging(app); // ✅ هيك كلشي واضح لـ TypeScript

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
