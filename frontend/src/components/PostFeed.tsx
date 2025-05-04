import { PostFeedProps, Post } from "../types";
import { PostCard } from "./PostCard";
import { useEffect, useState } from "react";

export const PostFeed = ({
  posts: initialPosts,
  isLoading,
  error,
}: PostFeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      setPosts(initialPosts);
    }
  }, [initialPosts]);

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`api/posts/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: "current-user-id" }), // TODO: Replace with userId from auth
      });

      if (!res.ok) throw new Error("Failed to like post");

      setPosts((prev) =>
        prev.map((post) =>
          post.postId === postId
            ? { ...post, likeCount: post.likeCount + 1, liked: true }
            : post,
        ),
      );
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleComment = async (
    postId: string,
    userId: string,
    content: string,
    createdAt: string,
  ) => {
    try {
      const res = await fetch(`api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId, content, createdAt }),
      });

      if (!res.ok) throw new Error("Failed to submit comment");

      fetchComments(postId);

      setPosts((prev) =>
        prev.map((post) =>
          post.postId === postId
            ? { ...post, commentCount: post.commentCount + 1 }
            : post,
        ),
      );
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const res = await fetch(`api/posts/${postId}/comments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch comments");

      const { comments } = await res.json();

      setPosts((prev) =>
        prev.map((post) =>
          post.postId === postId ? { ...post, comments } : post,
        ),
      );
    } catch (err) {
      console.error("Fetching comments failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading posts: {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-600 p-8">
        No posts right now! Be the first to share your research.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {posts.map((post) => (
        <PostCard
          key={post.postId}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          fetchComments={fetchComments}
        />
      ))}
    </div>
  );
};
