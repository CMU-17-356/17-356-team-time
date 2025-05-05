import axios from "axios";
import { useEffect, useState } from "react";
import { PostFeed } from "../components/PostFeed";
import { FOLLOWS_API_ENDPOINT, POST_API_ENDPOINT } from "../consts";
import { useAuth } from "../context/AuthContext";
import { FollowStatusResponse, Post } from "../types";

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [viewMode, setViewMode] = useState("recent"); // "recent" or "following"
  const { user } = useAuth();
  const [following, setFollowing] = useState<Map<string, boolean>>(new Map());
  const currentUserId = user?.username;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${POST_API_ENDPOINT}`);
        console.log("API Response:", response.data);
        // The API returns { posts: Post[] }
        const postsData = response.data.posts || [];
        setPosts(postsData);
        setFilteredPosts(postsData);
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
        console.error("Error fetching posts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchFollows = async () => {
      Promise.all(
        posts.map(async (post) => {
          if (following.has(post.authorId)) {
            return;
          }
          // Check follow status
          try {
            const response = await axios.get<FollowStatusResponse>(
              `${FOLLOWS_API_ENDPOINT}/${post.authorId}/status?followerId=${currentUserId}`,
            );
            setFollowing((prev) =>
              prev.set(post.authorId, response.data.isFollowing || false),
            );
          } catch (error) {
            console.error("Error checking follow status:", error);
          }
        }),
      ).then(() => {
        setFilteredPosts(posts.filter((post) => following.get(post.authorId)));
      });
    };
    if (viewMode === "recent") {
      setFilteredPosts(posts);
      return;
    } else if (viewMode === "following") {
      fetchFollows();
    }
  }, [viewMode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffffff] w-screen">
      <div className="p-8 w-full max-w-2xl min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-900">
          Research Feed
        </h1>
        <div className="flex flex-row justify-center text-md text-slate-600 gap-4">
          <button
            onClick={() => {
              if (viewMode !== "recent") {
                setViewMode("recent");
              }
            }}
            className="cursor-pointer hover:text-blue-500"
          >
            Recent
          </button>
          <button
            onClick={() => {
              if (viewMode !== "following") {
                setViewMode("following");
              }
            }}
            className="cursor-pointer hover:text-blue-500"
          >
            Following
          </button>
        </div>
        <PostFeed
          posts={filteredPosts}
          isLoading={isLoading}
          error={error}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
};
