import profileImg from "./assets/profile.jpg";
import { Profile, Researcher, SocialLinks } from "./types";

export const API_ENDPOINT = "http://localhost:5001/api/profiles";
export const defaultProfile: Profile = {
  firstName: "Jane",
  lastName: "Smith",
  email: "test@google.com",
  userId: "janesmith",
  institution: "Quantum Computing Lab, MIT",
  bio: "Professor of Quantum Computing at MIT with over 15 years of research experience. My work focuses on quantum entanglement, quantum algorithms, and applications in computational chemistry. I lead a team of researchers exploring the boundaries of quantum information science.",
  fieldOfInterest: "Quantum Computing, Quantum Entanglement, Quantum Algorithms",
}

export const defaultResearcher: Researcher = {
  ...defaultProfile,
  profilePicture: profileImg,
  following: 245,
  followers: 1893,
  socials: {
    twitter: "https://twitter.com/janesmith",
    github: "https://github.com/janesmith",
    linkedin: "https://linkedin.com/in/janesmith",
    website: "https://janesmith.research.mit.edu",
  } as SocialLinks,
}

export const emptyResearcher: Researcher = {
  firstName: "n/a",
  lastName: "n/a",
  userId: "nouser",
  email: "no@google.com",
  institution: "no-institution",
  profilePicture: "",
  following: -1,
  followers: -1,
  socials: {} as SocialLinks,
  bio: "",
  fieldOfInterest: "",
}