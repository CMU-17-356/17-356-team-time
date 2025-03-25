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