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
 * Profile model - extends User since it contains duplicate information
 */
export interface Profile extends User {
  profileId: string; // Primary key
  createdAt: string;
  updatedAt?: string;
  phone?: string; // Optional
  institution?: string; // Optional
  fieldOfInterest?: string; // Optional
  bio?: string; // Optional
}

// Table names as constants for easier referencing
export enum TableNames {
  USERS = "Users",
  PROFILES = "Profiles",
}
