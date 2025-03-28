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

// Table names as constants for easier referencing
export enum TableNames {
  PROFILES = "Profiles",
}
