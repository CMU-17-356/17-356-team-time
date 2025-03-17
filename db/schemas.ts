/**
 * The basic User model
 */
export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

/**
 * Profile model - contains researcher-specific information
 */
export interface Profile {
  profileId: string; // Primary key
  userId: string; // Foreign key to User table
  firstName: string;
  lastName: string;
  email: string;
  phone?: string; // Optional
  institution?: string; // Optional
  fieldOfInterest?: string; // Optional
  bio?: string; // Optional
  createdAt: string;
  updatedAt?: string;
}

// Table names as constants for easier referencing
export const TableNames = {
  USERS: "Users",
  PROFILES: "Profiles",
};
