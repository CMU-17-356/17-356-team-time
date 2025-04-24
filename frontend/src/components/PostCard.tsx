import {
  ExternalLink,
  Heart,
  MessageSquare,
  Repeat2,
  Share2,
} from "lucide-react";
import { PostCardProps } from "../types";
import { Link } from "react-router-dom";

export const PostCard = ({
  post,
  onLike,
  onToggleComment,
  isCommentOpen,
  commentText,
  onCommentTextChange,
  onSubmitComment,
}: PostCardProps & {
  onToggleComment?: (postId: string) => void;
  isCommentOpen?: boolean;
  commentText?: string;
  onCommentTextChange?: (text: string) => void;
  onSubmitComment?: () => void;
}) => {
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
          onClick={() => onLike?.(post.postId)}
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
          onClick={() => onToggleComment?.(post.postId)}
          className="flex items-center text-gray-500 hover:text-blue-500"
        >
          <MessageSquare size={18} className="mr-1" />
          <span>{post.commentCount}</span>
        </button>

        <button className="flex items-center text-gray-500 hover:text-purple-500">
          <Share2 size={18} className="mr-1" />
          <span>Share</span>
        </button>
      </div>

      {/* Comment Section */}
      {isCommentOpen && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="mt-2">
            <textarea
              placeholder="Write a comment..."
              value={commentText || ""}
              onChange={(e) => onCommentTextChange?.(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={2}
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={onSubmitComment}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
