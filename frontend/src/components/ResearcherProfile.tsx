import "axios";
import axios from "axios";
import { Heart, MessageSquare, Repeat2, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { POST_API_ENDPOINT } from "../consts";
import { Post, ProfileHeaderProps, Researcher } from "../types";
import { ProfileHeader } from "./ProfileHeader";

interface ProfilePost extends Post {
  commentOpen?: boolean; // Whether the comment section is open
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export const ResearcherProfile = (props: Researcher) => {
  const [researcher, setResearcher] = useState<Researcher>(props);
  // Sample posts
  const [posts, setPosts] = useState<ProfilePost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${POST_API_ENDPOINT}`);
        console.log("API Response:", response.data);
        // The API returns { posts: Post[] }
        const postsData = (response.data.posts || []).filter(
          (post: Post) => post.authorId === researcher.userId,
        );

        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, [researcher.userId]);

  // UI States
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  // Toggle like on a post
  const toggleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.postId === postId ? { ...post, liked: !post.liked } : post,
      ),
    );
  };

  // // Toggle comment section
  const toggleComment = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.postId === postId
          ? { ...post, commentOpen: !post.commentOpen }
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
        post.postId === postId
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

  const headerProps: ProfileHeaderProps = {
    ...researcher,
    isFollowing: false, // Placeholder for follow state
    setResearcher,
    isOwnProfile: props.isOwnProfile,
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-[#ffffff] min-h-screen">
      <ProfileHeader {...headerProps} />
      {/* Posts Feed */}
      <h3 className="text-xl font-semibold mb-4">Recent Updates</h3>
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.postId}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <p className="mb-2">{post.content}</p>
              <div className="mt-2 text-sm text-gray-500">{post.updatedAt}</div>

              {/* Post Actions */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                <button
                  onClick={() => toggleLike(post.postId)}
                  className={`flex items-center ${
                    post.liked ? "text-red-500" : "text-gray-500"
                  } hover:text-red-500`}
                >
                  <Heart
                    size={18}
                    fill={post.liked ? "currentColor" : "none"}
                    className="mr-1"
                  />
                  <span className="text-sm">Like</span>
                </button>

                <button className="flex items-center text-gray-500 hover:text-green-500">
                  <Repeat2 size={18} className="mr-1" />
                  <span className="text-sm">Repost</span>
                </button>

                <button
                  onClick={() => toggleComment(post.postId)}
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
              {post.commentOpen && (
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
                            <span className="font-medium">
                              {comment.author}
                            </span>
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
                      value={commentText[post.postId] || ""}
                      onChange={(e) =>
                        handleCommentChange(post.postId, e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => submitComment(post.postId)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-lg italic font-semibold text-slate-500">
            This user has no posts yet.
          </div>
        )}
      </div>
    </div>
  );
};
