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

// Table names as constants for easier referencing
export enum TableNames {
  PROFILES = "Profiles",
  POSTS = "Posts",
}
