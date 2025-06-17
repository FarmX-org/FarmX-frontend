import { useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  recipientId: number;
}

export function useNotificationSocket() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("🚫 No JWT token found.");
      return;
    }

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ws-notifications`),

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      debug: (str) => console.log("📡 STOMP DEBUG:", str),

      onConnect: () => {
        console.log("✅ WebSocket connected");

        client.subscribe("/user/queue/notifications", (message: IMessage) => {
          try {
            const notif: Notification = JSON.parse(message.body);
            alert(`${notif.title}\n\n${notif.message}`);
            setNotifications((prev) => [notif, ...prev]);
          } catch (err) {
            console.error("❌ Failed to parse notification:", err);
          }
        });
      },

      onStompError: (frame) => {
        console.error("🛑 STOMP error:", frame.headers["message"]);
        console.error("Details:", frame.body);
      },

      onWebSocketError: (event) => {
        console.error("❌ WebSocket error:", event);
      },

      reconnectDelay: 5000,
    });

    client.activate();
    clientRef.current = client;

    return () => {
      console.log("🔌 Disconnecting WebSocket...");
      client.deactivate();
    };
  }, []);

  return { notifications, setNotifications };
}
