import { PostCardProps } from "../types";
import { Link } from "react-router-dom";

export const PostCard = ({ post, onLike, onComment }: PostCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 mb-4 border border-gray-200">
      <div className="flex items-center mb-4">
        <img
          src={post.authorProfilePicture}
          alt={post.authorName}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <Link to={`/profile/${post.authorId}`} className="font-semibold hover:text-[#faab99]">
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
          <div className="flex gap-2">
            {post.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#faab99] hover:text-[#f89686] hover:underline"
              >
                PDF {index + 1}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-gray-600">
        <button
          onClick={() => onLike?.(post.postId)}
          className="flex items-center gap-1 hover:text-[#faab99]"
        >
          <span>❤️</span>
          <span>{post.likeCount}</span>
        </button>
        <button
          onClick={() => onComment?.(post.postId)}
          className="flex items-center gap-1 hover:text-[#faab99]"
        >
          <span>💬</span>
          <span>{post.commentCount}</span>
        </button>
      </div>
    </div>
  );
}; 