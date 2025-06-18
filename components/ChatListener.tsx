"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAllUsers } from "@/lib/users";
import { useToast } from "@chakra-ui/react";


export default function ChatListener({ onNewMessage }: { onNewMessage?: () => void }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const toast = useToast();

  const normalizeUsername = (name: string) => name.trim().toLowerCase();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const user = JSON.parse(stored);
    setCurrentUser({
      ...user,
      username: normalizeUsername(user.username || user.name),
    });
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        const filtered = allUsers.filter(
          (user: any) =>
            normalizeUsername(user.username) !== currentUser.username
        );
        setUsers(
          filtered.map((user: any) => ({
            ...user,
            username: normalizeUsername(user.username),
          }))
        );
      } catch (err) {
        console.error("Error fetching users for chat listener:", err);
      }
    };

    fetchUsers();
  }, [currentUser]);

useEffect(() => {
  if (!currentUser || users.length === 0) {
    return;
  }

  const unsubscribes: (() => void)[] = [];

  users.forEach((user) => {
    const chatId = [currentUser.username, user.username].sort().join("_");
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      const lastMsg = msgs[msgs.length - 1];

      if (
        lastMsg &&
        typeof lastMsg === "object" &&
        lastMsg.sender &&
        lastMsg.content &&
        lastMsg.sender !== currentUser.username
      ) {
       if (onNewMessage) onNewMessage(); 
toast({
  title: `New message from ${user.username}`,
  description: lastMsg.content,
  status: "info",
  duration: 3000,
  isClosable: true,
  position: "top-right",
});

      }
    });

    unsubscribes.push(unsubscribe);
  });

  return () => {
    unsubscribes.forEach((unsub) => unsub());
  };
}, [users, currentUser]);

  return null; // component doesn't render anything
}
