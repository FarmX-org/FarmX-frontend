// hooks/useNotifications.ts
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await apiRequest("/api/notifications");
      setNotifications(data);
    } catch (err) {
      console.error("❌ Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return { notifications, loading, refetch: fetchNotifications };
}
