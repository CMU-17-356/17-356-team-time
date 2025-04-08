import { useEffect, useState } from "react";
import axios from "axios";
import { Post } from "../types";
import { POST_API_ENDPOINT } from "../consts";
import { PostFeed } from "../components/PostFeed";

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${POST_API_ENDPOINT}`);
        console.log("API Response:", response.data);
        // The API returns { posts: Post[] }
        const postsData = response.data.posts || [];
        setPosts(postsData);
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
        console.error("Error fetching posts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fce6d2]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-8 text-center">Research Feed</h1>
        <PostFeed posts={posts} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
};
