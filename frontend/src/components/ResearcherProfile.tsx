import { Heart, MessageSquare, Repeat2, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ProfileHeaderProps, Researcher } from "../types";
import { ProfileHeader } from "./ProfileHeader";
import axios from "axios";
import { FOLLOWS_API_ENDPOINT } from "../consts";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface FollowStatusResponse {
  isFollowing: boolean;
}

export const ResearcherProfile = (props: Researcher) => {
  const [researcher, setResearcher] = useState<Researcher>({
    ...props,
    following: props.following || 0,
    followers: props.followers || 0,
    isFollowing: props.isFollowing || false,
  });
  // Sample posts
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      title: "Quantum Entanglement in Large Scale Systems",
      content:
        "Just published our new paper on quantum entanglement! Check out the link for the full text.",
      author: "You",
      timestamp: "March 22, 2025",
      likes: 0,
      comments: [],
    },
    {
      id: "2",
      title: "IQCC 2025 Schedule",
      content:
        "Excited to announce I'll be speaking at the International Quantum Computing Conference next month! Looking forward to sharing our latest research.",
      author: "You",
      timestamp: "March 15, 2025",
      likes: 0,
      comments: [],
    },
    {
      id: "3",
      title: "PhD Positions",
      content:
        "Our lab is recruiting PhD students for Fall 2025. Looking for candidates with strong backgrounds in physics and computer science.",
      author: "You",
      timestamp: "March 10, 2025",
      likes: 0,
      comments: [],
    },
  ]);

  // UI States
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  // Toggle like on a post
  const toggleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  };

  // Toggle comments for a post
  const toggleComments = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments: post.comments.length > 0 ? [] : post.comments }
          : post,
      ),
    );
  };

  // Handle comment text change
  const handleCommentChange = (postId: string, text: string) => {
    setCommentText({
      ...commentText,
      [postId]: text,
    });
  };

  // Submit a comment
  const submitComment = (postId: string) => {
    if (!commentText[postId]?.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      text: commentText[postId],
      author: "You",
      timestamp: new Date().toLocaleDateString(),
    };

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post,
      ),
    );

    // Clear the comment text
    setCommentText({
      ...commentText,
      [postId]: "",
    });
  };

  // Check follow status when profile loads
  useEffect(() => {
    if (!props.isOwnProfile) {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        console.error("No user data found");
        return;
      }

      const currentUserId = JSON.parse(userData).username;

      // Check follow status
      axios
        .get<FollowStatusResponse>(
          `${FOLLOWS_API_ENDPOINT}/${props.userId}/status?followerId=${currentUserId}`,
        )
        .then((response) => {
          setResearcher((prev) => ({
            ...prev,
            isFollowing: response.data.isFollowing,
          }));
        })
        .catch((error) => {
          console.error("Error checking follow status:", error);
        });

      // Get follower count
      axios
        .get(`${FOLLOWS_API_ENDPOINT}/${props.userId}/followers/count`)
        .then((response) => {
          setResearcher((prev) => ({
            ...prev,
            followers: response.data.followers || 0,
          }));
        })
        .catch((error) => {
          console.error("Error getting followers count:", error);
        });

      // Get following count
      axios
        .get(`${FOLLOWS_API_ENDPOINT}/${props.userId}/following/count`)
        .then((response) => {
          setResearcher((prev) => ({
            ...prev,
            following: response.data.following || 0,
          }));
        })
        .catch((error) => {
          console.error("Error getting following count:", error);
        });
    }
  }, [props.userId, props.isOwnProfile]);

  // Handle follow state updates
  const handleFollowUpdate = (researcher: Researcher) => {
    setResearcher((prev) => ({
      ...prev,
      ...researcher,
      isFollowing: researcher.isFollowing,
      followers: researcher.followers,
    }));
  };

  const headerProps: ProfileHeaderProps = {
    ...researcher,
    isFollowing: researcher.isFollowing || false,
    setResearcher: handleFollowUpdate,
    isOwnProfile: props.isOwnProfile,
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-[#ffffff] min-h-screen">
      <ProfileHeader {...headerProps} />
      {/* Posts Feed */}
      <h3 className="text-xl font-semibold mb-4">Recent Updates</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
            <p className="mb-2">{post.content}</p>
            <div className="mt-2 text-sm text-gray-500">{post.timestamp}</div>

            {/* Post Actions */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center ${
                  post.likes > 0 ? "text-red-500" : "text-gray-500"
                } hover:text-red-500`}
              >
                <Heart
                  size={18}
                  fill={post.likes > 0 ? "currentColor" : "none"}
                  className="mr-1"
                />
                <span className="text-sm">Like</span>
              </button>

              <button className="flex items-center text-gray-500 hover:text-green-500">
                <Repeat2 size={18} className="mr-1" />
                <span className="text-sm">Repost</span>
              </button>

              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center text-gray-500 hover:text-blue-500"
              >
                <MessageSquare size={18} className="mr-1" />
                <span className="text-sm">Comment</span>
              </button>

              <button className="flex items-center text-gray-500 hover:text-purple-500">
                <Share2 size={18} className="mr-1" />
                <span className="text-sm">Share</span>
              </button>
            </div>

            {/* Comment Section */}
            {post.comments && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                {/* Existing Comments */}
                {post.comments.length > 0 && (
                  <div className="mb-4 space-y-3">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-xs text-gray-500">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="mt-1 text-sm">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Editor */}
                <div className="mt-2">
                  <textarea
                    placeholder="Write a comment..."
                    value={commentText[post.id] || ""}
                    onChange={(e) =>
                      handleCommentChange(post.id, e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => submitComment(post.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
