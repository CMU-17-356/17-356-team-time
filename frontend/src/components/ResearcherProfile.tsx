import {
  ExternalLink,
  Heart,
  MessageSquare,
  Repeat2,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { ProfileHeaderProps, Researcher } from "../types";
import { ProfileHeader } from "./ProfileHeader";

interface Post {
  id: string;
  content: string;
  timestamp: string;
  links: Array<{
    url: string;
    title: string;
  }>;
  liked: boolean;
  commentOpen: boolean;
  comments: Array<{
    id: string;
    text: string;
    author: string;
    timestamp: string;
  }>;
}

export const ResearcherProfile = (props: Researcher) => {
  const [researcher, setResearcher] = useState<Researcher>(props);
  // Sample posts
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      content:
        "Just published our new paper on quantum entanglement! Check out the link for the full text.",
      timestamp: "March 22, 2025",
      links: [
        {
          url: "https://arxiv.org/abs/2503.12345",
          title: "Quantum Entanglement in Large Scale Systems",
        },
      ],
      liked: false,
      commentOpen: false,
      comments: [],
    },
    {
      id: "2",
      content:
        "Excited to announce I'll be speaking at the International Quantum Computing Conference next month! Looking forward to sharing our latest research.",
      timestamp: "March 15, 2025",
      links: [{ url: "https://iqcc2025.org", title: "IQCC 2025 Schedule" }],
      liked: false,
      commentOpen: false,
      comments: [],
    },
    {
      id: "3",
      content:
        "Our lab is recruiting PhD students for Fall 2025. Looking for candidates with strong backgrounds in physics and computer science.",
      timestamp: "March 10, 2025",
      links: [
        { url: "https://mit.edu/qclab/positions", title: "PhD Positions" },
      ],
      liked: false,
      commentOpen: false,
      comments: [],
    },
  ]);

  // UI States
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  // Toggle like on a post
  const toggleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, liked: !post.liked } : post,
      ),
    );
  };

  // Toggle comment section
  const toggleComment = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, commentOpen: !post.commentOpen } : post,
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

  const headerProps: ProfileHeaderProps = {
    ...researcher,
    isFollowing: false, // Placeholder for follow state
    setResearcher,
    isOwnProfile: props.isOwnProfile,
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 min-h-screen">
      <ProfileHeader {...headerProps} />
      {/* Posts Feed */}
      <h3 className="text-xl font-semibold mb-4">Recent Updates</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
            <p className="mb-2">{post.content}</p>
            {post.links.length > 0 && (
              <div className="mt-2">
                {post.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="flex items-center text-blue-600 hover:underline mt-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    {link.title}
                  </a>
                ))}
              </div>
            )}
            <div className="mt-2 text-sm text-gray-500">{post.timestamp}</div>

            {/* Post Actions */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => toggleLike(post.id)}
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
                onClick={() => toggleComment(post.id)}
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
