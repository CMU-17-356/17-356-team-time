/**
 * Profile model - extends User since it contains duplicate information
 */
export interface Profile {
  userId: string; // Primary key
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
  phone?: string; // Optional
  institution?: string; // Optional
  fieldOfInterest?: string; // Optional
  bio?: string; // Optional
  following?: number; // Number of users this profile is following
  followers?: number; // Number of users following this profile
}

/**
 * Post model - represents a user's post
 */
export interface Post {
  postId: string; // Primary key
  userId: string; // Foreign key to Profile.userId
  title: string;
  content: string;
  tags: string[]; // Array of tags like "machine learning", "computer vision", etc.
  likeCount: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Follow relationship model - tracks who follows whom
 */
export interface FollowRelationship {
  followerId: string; // Partition key
  followingId: string; // Sort key
  createdAt: string;
}

// Table names as constants for easier referencing
export enum TableNames {
  USERS = "Users",
  PROFILES = "Profiles",
  POSTS = "Posts",
  FOLLOWS = "Follows",
}
