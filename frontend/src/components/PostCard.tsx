import { useState } from "react";
import {
  Heart,
  MessageSquare,
  ExternalLink,
  Repeat2,
  Share2,
} from "lucide-react";
import { PostCardProps } from "../types";
import { Link } from "react-router-dom";

export const PostCard = ({
  post,
  onLike,
  onComment,
  fetchComments,
}: PostCardProps) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = () => {
    if (onComment && commentText.trim()) {
      onComment(
        post.postId,
        post.authorId,
        commentText,
        new Date().toISOString(),
      );
      setCommentText("");
    }
  };

  const handleLike = () => {
    if (onLike) {
      onLike(post.postId);
    }
  };

  const toggleComments = () => {
    if (!commentOpen && fetchComments) {
      fetchComments(post.postId);
    }
    setCommentOpen(!commentOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center mb-4">
        <img
          src={post.authorProfilePicture}
          alt={post.authorName}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <Link
            to={`/profile/${post.authorId}`}
            className="font-semibold hover:text-[#faab99]"
          >
            {post.authorName}
          </Link>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.content}</p>

      {post.attachments && post.attachments.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Attachments:</h3>
          <div className="flex flex-col gap-1">
            {post.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:underline"
              >
                <ExternalLink size={14} className="mr-1" />
                PDF {index + 1}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm">
        <button
          onClick={handleLike}
          className="flex items-center text-gray-500 hover:text-red-500"
        >
          <Heart
            size={18}
            fill={post.liked ? "currentColor" : "none"}
            className="mr-1"
          />
          <span>{post.likeCount}</span>
        </button>

        <button className="flex items-center text-gray-500 hover:text-green-500">
          <Repeat2 size={18} className="mr-1" />
          <span>Repost</span>
        </button>

        <button
          onClick={toggleComments}
          className="flex items-center text-gray-500 hover:text-green-500"
        >
          <MessageSquare size={18} className="mr-1" />
          <span>{post.commentCount}</span>
        </button>

        <button className="flex items-center text-gray-500 hover:text-purple-500">
          <Share2 size={18} className="mr-1" />
          <span>Share</span>
        </button>
      </div>

      {commentOpen && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-3 mb-3">
              {post.comments.map((c) => (
                <div key={c.id} className="bg-gray-50 p-3 rounded-md text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{c.author}</span>
                    <span className="text-xs text-gray-500">{c.timestamp}</span>
                  </div>
                  <p className="mt-1">{c.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}

          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleSubmitComment}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
