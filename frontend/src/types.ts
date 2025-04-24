/**
 * The basic User model
 */
export interface User {
  userId: string; // Primary key
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Profile model - extends User since it contains duplicate information
 */
export interface Profile extends User {
  phone?: string; // Optional
  institution?: string; // Optional
  fieldOfInterest?: string; // Optional
  bio?: string; // Optional
}

export interface Researcher extends Profile {
  profilePicture: string; // todo
  following: number; // todo
  followers: number; // todo
  socials: SocialLinks; // todo
  isOwnProfile?: boolean; // Whether the profile being viewed belongs to the current user
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}
export interface ProfileHeaderProps extends Researcher {
  setResearcher: (researcher: Researcher) => void;
  isFollowing: boolean;
}

export interface Post {
  postId: string;
  authorId: string;
  authorName: string;
  authorProfilePicture: string;
  title: string;
  content: string;
  attachments?: string[]; // URLs to PDF files
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  liked?: boolean;
}

export interface PostFeedProps {
  posts: Post[];
  isLoading: boolean;
  error?: string;
}

export interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}
