// import profileImg from "./assets/profile.jpg";
import { Researcher, SocialLinks } from "./types";

export const PROFILE_API_ENDPOINT = "http://localhost:5001/api/profiles";
export const POST_API_ENDPOINT = "http://localhost:5001/api/posts";

export const emptyResearcher: Researcher = {
  firstName: "n/a",
  lastName: "n/a",
  userId: "nouser",
  email: "no@google.com",
  institution: "no-institution",
  profilePicture: "profileImg", // TODO commented out because image import breaks jest test
  following: 100,
  followers: 550,
  socials: {
    twitter: "https://twitter.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    website: "https://google.com",
  } as SocialLinks,
  bio: "",
  fieldOfInterest: "",
};
