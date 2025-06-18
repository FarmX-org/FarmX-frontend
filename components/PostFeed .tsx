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
} from "@chakra-ui/react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  addDoc,
  serverTimestamp,
  onSnapshot as onSubSnapshot,
} from "firebase/firestore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { db } from "@/lib/firebase";
dayjs.extend(relativeTime);

interface Post {
  id: string;
  userName: string;
  avatarUrl: string;
  userId: string;
  content: string;
  createdAt: any;
  likes?: string[];
}

interface Comment {
  id: string;
  userName: string;
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
      const postsData: Post[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(postsData);
      setLoading(false);

      postsData.forEach(post => {
        const commentsRef = collection(db, "posts", post.id, "comments");
        onSubSnapshot(commentsRef, (snap) => {
          const postComments: Comment[] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
          setComments(prev => ({ ...prev, [post.id]: postComments }));
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
      userName: user.name,
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
    <Box maxW="600px" mx="auto" mb={10}>
      {posts.map((post) => (
        <Box key={post.id} p={4} mb={4} bg="white" borderRadius="lg" boxShadow="base">
          <Flex align="center" mb={2} gap={3} justify="space-between">
            <Flex align="center" gap={3}>
              <Avatar src={post.avatarUrl} name={post.userName} size="sm" />
              <Box>
                <Text fontWeight="semibold">{post.userName}</Text>
                <Text fontSize="xs" color="gray.500">
                  {post.createdAt?.seconds ? dayjs(post.createdAt.seconds * 1000).fromNow() : "now"}
                </Text>
              </Box>
            </Flex>
            {user?.id === post.userId && (
              <Button size="sm" variant="ghost" colorScheme="red" onClick={() => handleDelete(post.id)}>
                Delete
              </Button>
            )}
          </Flex>
          <Text mb={2} whiteSpace="pre-wrap">{post.content}</Text>


          {/* Comments */}
          <Box mt={3}>
            {comments[post.id]?.map(comment => (
              <Box key={comment.id} p={2} bg="gray.50" borderRadius="md" mb={2}>
                <Text fontWeight="bold">{comment.userName}</Text>
                <Text>{comment.text}</Text>
              </Box>
            ))}
            <Textarea
              placeholder="Add a comment..."
              value={newComment[post.id] || ""}
              onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
              size="sm"
            />
            <Button onClick={() => handleComment(post.id)} size="sm" mt={1} colorScheme="green">
              Comment
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default PostFeed;
