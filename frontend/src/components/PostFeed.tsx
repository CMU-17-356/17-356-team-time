import { PostFeedProps } from "../types";
import { PostCard } from "./PostCard";

export const PostFeed = ({ posts, isLoading, error }: PostFeedProps) => {
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
          onLike={(postId) => {
            // TODO: Implement like functionality
            console.log("Liked post:", postId);
          }}
          onComment={(postId) => {
            // TODO: Implement comment functionality
            console.log("Comment on post:", postId);
          }}
        />
      ))}
    </div>
  );
};
