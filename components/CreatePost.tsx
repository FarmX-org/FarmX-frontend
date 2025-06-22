"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Textarea,
  Button,
  Flex,
  Avatar,
  Text,
  useToast,
} from "@chakra-ui/react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CreatePost = () => {
  const toast = useToast();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ name: string; avatarUrl: string; id: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handlePost = async () => {
    if (!content.trim()) {
      toast({ title: "please write something ", status: "warning", duration: 2000 });
      return;
    }
    if (!user) {
      toast({ title: "you must be logged in  ", status: "error", duration: 3000 });
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        userName: user.name,
        avatarUrl: user.avatarUrl,
        userId: user.id,
        content: content.trim(),
        createdAt: serverTimestamp(),
        likes: [],
      });
      setContent("");
      toast({ title: "Post created ", status: "success", duration: 2000 });
    } catch (error) {
      toast({ title: "Error creating post ", status: "error", duration: 3000 });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="md" maxW="600px" mx="auto" mb={6}>
      <Flex gap={3} align="center" mb={2}>
        <Avatar src={user?.avatarUrl} name={user?.name} />
        <Text fontWeight="bold">{user?.name || "User"}</Text>
      </Flex>
      <Textarea
        placeholder="What's your Opinion ..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        resize="vertical"
      />
      <Flex justify="flex-end">
        <Button
          mt={3}
          colorScheme="green"
          isLoading={loading}
          onClick={handlePost}
          borderRadius="full"
          disabled={!content.trim()}
        >
          Post
        </Button>
      </Flex>
    </Box>
  );
};

export default CreatePost;