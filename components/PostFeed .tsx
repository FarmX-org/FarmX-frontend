"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Avatar,
  Flex,
  Spinner,
  Button,
  Textarea,
  useToast,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  onSnapshot as onSubSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiTrash2 } from "react-icons/fi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Post {
  id: string;
  username: string;
  avatarUrl: string;
  userId: string;
  content: string;
  createdAt: any;
  likes?: string[];
}

interface Comment {
  id: string;
  username: string;
  text: string;
  createdAt: any;
}

const PostFeed = () => {
  const toast = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; id: string } | null>(null);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: Post[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Post)
      );
      setPosts(postsData);
      setLoading(false);

      postsData.forEach((post) => {
        const commentsRef = collection(db, "posts", post.id, "comments");
        onSubSnapshot(commentsRef, (snap) => {
          const postComments: Comment[] = snap.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Comment)
          );
          setComments((prev) => ({ ...prev, [post.id]: postComments }));
        });
      });
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, "posts", postId));
      toast({ title: "Post deleted", status: "success" });
    } catch (err) {
      toast({ title: "Error deleting post", status: "error" });
    }
  };

  const handleComment = async (postId: string) => {
    if (!user || !newComment[postId]?.trim()) return;
    const commentRef = collection(db, "posts", postId, "comments");
    await addDoc(commentRef, {
      username: user.name,
      text: newComment[postId],
      createdAt: serverTimestamp(),
    });
    setNewComment((prev) => ({ ...prev, [postId]: "" }));
  };

  if (loading) {
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box maxW="650px" mx="auto" mb={10} px={2}>
      {posts.map((post) => (
        <Box
          key={post.id}
          p={5}
          mb={6}
          bg="white"
          borderRadius="2xl"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.100"
        >
          <Flex align="center" justify="space-between" mb={3}>
            <HStack spacing={3}>
              <Avatar src={post.avatarUrl} name={post.username} size="sm" />
              <Box>
                <Text fontWeight="bold" fontSize="md">
                  {post.username}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {post.createdAt?.seconds
                    ? dayjs(post.createdAt.seconds * 1000).fromNow()
                    : "now"}
                </Text>
              </Box>
            </HStack>
            {user?.name === post.username && (
              <IconButton
                icon={<FiTrash2 />}
                aria-label="Delete"
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => handleDelete(post.id)}
              />
            )}
          </Flex>

          <Text mb={4} fontSize="md" whiteSpace="pre-wrap">
            {post.content}
          </Text>

          <Box mt={3}>
            {comments[post.id]?.map((comment) => (
              <Box
                key={comment.id}
                p={3}
                bg="gray.50"
                borderRadius="md"
                mb={2}
                border="1px solid"
                borderColor="gray.200"
              >
                <Text fontWeight="medium" fontSize="sm">
                  {comment.username}
                </Text>
                <Text fontSize="sm" color="gray.700">
                  {comment.text}
                </Text>
              </Box>
            ))}
            <Textarea
              placeholder="Add a comment..."
              value={newComment[post.id] || ""}
              onChange={(e) =>
                setNewComment((prev) => ({
                  ...prev,
                  [post.id]: e.target.value,
                }))
              }
              size="sm"
              borderRadius="lg"
              mt={2}
              mb={1}
            />
            <Flex justify="flex-end">
              <Button
                onClick={() => handleComment(post.id)}
                size="sm"
                mt={1}
                colorScheme="green"
                borderRadius="full"
              >
                Comment
              </Button>
            </Flex>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default PostFeed;
