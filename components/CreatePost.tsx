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
  Divider,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CreatePost = () => {
  const toast = useToast();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ name: string; avatarUrl: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) {
          setUser(parsed);
        } else {
          console.warn("User data missing name field.");
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
      }
    }
  }, []);

  const handlePost = async () => {
    if (!content.trim()) {
      toast({ title: "Please write something.", status: "warning", duration: 2000 });
      return;
    }

    if (!user || !user.name) {
      toast({ title: "You must be logged in.", status: "error", duration: 3000 });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        username: user.name,
        avatarUrl: user.avatarUrl,
        content: content.trim(),
        createdAt: serverTimestamp(),
        likes: [],
      });

      setContent("");
      toast({ title: "Post created", status: "success", duration: 2000 });
    } catch (error) {
      toast({ title: "Error creating post", status: "error", duration: 3000 });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      p={5}
      mt={20}
      bg="white"
      borderRadius="2xl"
      boxShadow="md"
      maxW="600px"
      mx="auto"
      mb={8}
      border="1px solid"
      borderColor="gray.100"
    >
      <Flex align="flex-start" gap={4}>
        <Avatar name={user?.name} src={user?.avatarUrl} size="md" />
        <Box flex="1">
          <Text fontWeight="bold" fontSize="md" mb={1}>
            {user?.name || "Anonymous"}
          </Text>
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            resize="none"
            borderRadius="lg"
            minH="100px"
            borderColor="gray.300"
            _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px green.300" }}
          />
          <HStack justify="flex-end" mt={3}>
            <Button
              rightIcon={<Icon as={FiSend} />}
              colorScheme="green"
              borderRadius="full"
              isLoading={loading}
              onClick={handlePost}
              disabled={!content.trim()}
              px={6}
            >
              Post
            </Button>
          </HStack>
        </Box>
      </Flex>
      <Divider mt={4} />
    </Box>
  );
};

export default CreatePost;
