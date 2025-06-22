"use client";

import React from "react";
import CreatePost from "@/components/CreatePost";
import PostFeed from "@/components/PostFeed ";

const PostsPage = () => {
  return (
    <>
      <CreatePost />
      <PostFeed />
    </>
  );
};

export default PostsPage;
