"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Avatar,
  Text,
  HStack,
  Spinner,
  Flex,
  Input,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAllUsers } from "@/lib/users";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp?: any;
}

export default function ChatPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const router = useRouter();

  const bgColor = "#f0fdf4";
  const myMsgBg = "#a7f3d0";
  const otherMsgBg = "#ffffff";

  const normalizeUsername = (name: string) => name.trim().toLowerCase();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const normalized = normalizeUsername(parsedUser.username || parsedUser.name);

    setCurrentUser({
      ...parsedUser,
      username: normalized,
    });
  }, [router]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) return;

      try {
        const allUsers = await getAllUsers();
        const filtered = allUsers.filter(
          (user: any) =>
            normalizeUsername(user.username) !== normalizeUsername(currentUser.username)
        );

        const normalizedUsers = filtered.map((user: any) => ({
          ...user,
          username: normalizeUsername(user.username),
        }));

        setUsers(normalizedUsers);
      } catch (err: any) {
        console.error("Error fetching users:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedUser || !currentUser) {
      setMessages([]);
      return;
    }

    const chatId = [currentUser.username, selectedUser.username].sort().join("_");
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        ...(doc.data() as Message),
        id: doc.id,
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedUser, currentUser]);

  const sendMessage = async () => {
    if (!input.trim() || !currentUser || !selectedUser) return;

    const chatId = [currentUser.username, selectedUser.username].sort().join("_");

    await addDoc(collection(db, "chats", chatId, "messages"), {
      sender: currentUser.username,
      content: input,
      timestamp: serverTimestamp(),
    });

    setInput("");
  };

  if (loading || !currentUser) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="lg" />
        <Text mt={4}>Loading ...</Text>
      </Box>
    );
  }

  return (
    <Flex height="100vh" maxW="1200px" mx="auto" boxShadow="lg" rounded="md" bg="white" mt={20}>
      {/* User List */}
      <Box
        width={["100%", "30%", "25%"]}
        borderRight="1px solid"
        borderColor="gray.200"
        p={4}
        overflowY="auto"
        bg="#ffffff"
      >
        <Heading size="md" mb={4}>Chats</Heading>
        <VStack spacing={3} align="stretch">
          {users.map((user) => (
            <HStack
              key={user.id}
              p={2}
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: "#d1fae5" }}
              onClick={() => setSelectedUser(user)}
              bg={selectedUser?.username === user.username ? "#bbf7d0" : "transparent"}
              align="start"
            >
              <Avatar
                name={user.username}
                src={`https://ui-avatars.com/api/?name=${user.username}`}
              />
              <Box>
                <Text fontWeight="medium">{user.username}</Text>
                <Text fontSize="sm" color="gray.500">
                  {user.roles?.[0] || "User"}
                </Text>
              </Box>
            </HStack>
          ))}
        </VStack>
      </Box>

      {/* Chat Section */}
      <Flex flex="1" direction="column" p={4} bg={bgColor}>
        {selectedUser ? (
          <>
            <HStack
              p={2}
              borderRadius="md"
              bg="#bbf7d0"
              align="start"
            >
              <Avatar
                name={selectedUser.username}
                src={`https://ui-avatars.com/api/?name=${selectedUser.username}`}
              />
              <Box>
                <Text fontWeight="medium">{selectedUser.username}</Text>
                <Text fontSize="sm" color="gray.500">
                  {selectedUser.roles?.[0] || "User"}
                </Text>
              </Box>
            </HStack>

            {/* Messages */}
            <Box
              flex="1"
              bg="#ffffff"
              p={4}
              rounded="md"
              shadow="inner"
              overflowY="auto"
              mb={2}
            >
              {messages.map((msg) => {
                const isMe = msg.sender === currentUser.username;
                return (
                  <Box
                    key={msg.id}
                    alignSelf={isMe ? "flex-end" : "flex-start"}
                    bg={isMe ? myMsgBg : otherMsgBg}
                    px={4}
                    py={2}
                    borderRadius="20px"
                    borderBottomRightRadius={isMe ? "0" : "20px"}
                    borderBottomLeftRadius={isMe ? "20px" : "0"}
                    maxW="70%"
                    mb={2}
                  >
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      {isMe ? "You" : msg.sender}
                    </Text>
                    <Text whiteSpace="pre-wrap">{msg.content}</Text>
                    {msg.timestamp?.toDate && (
                      <Text fontSize="xs" color="gray.400" mt={1} textAlign="right">
                        {new Date(msg.timestamp.toDate()).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    )}
                  </Box>
                );
              })}
            </Box>

            {/* Input */}
            <HStack mt="auto">
              <Input
                placeholder="Type your message ..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                bg="white"
                borderRadius="full"
                px={5}
                py={2}
                shadow="sm"
              />
              <Button colorScheme="green" borderRadius="full" px={6} onClick={sendMessage}>
                Send
              </Button>
            </HStack>
          </>
        ) : (
          <Text mt={10} textAlign="center" color="gray.500">
            Please select a user to start chatting.
          </Text>
        )}
      </Flex>
    </Flex>
  );
}
