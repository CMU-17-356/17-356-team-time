import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { SocialLinks } from "./ProfileHeader";
import ResearcherProfile, { Researcher } from "./ProfilePage";
import profileImg from "./assets/profile.jpg";

function App() {
  const emptyResearcher = {
    firstName: "n/a",
    lastName: "n/a",
    email: "no@google.com",
    createdAt: Date.now().toString(),
    userId: "nouser",
    institution: "no-institution",
    profilePicture: "",
    following: -1,
    followers: -1,
    socials: {} as SocialLinks,
    bio: "",
    fieldOfInterest: [],
  }

  const defaultResearcher = {
    firstName: "Jane",
    lastName: "Smith",
    email: "test@google.com",
    createdAt: Date.now().toString(),
    userId: "janesmith",
    institution: "Quantum Computing Lab, MIT",
    profilePicture: profileImg,
    following: 245,
    followers: 1893,
    socials: {
      twitter: "https://twitter.com/janesmith",
      github: "https://github.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith",
      website: "https://janesmith.research.mit.edu",
    } as SocialLinks,
    bio: "Professor of Quantum Computing at MIT with over 15 years of research experience. My work focuses on quantum entanglement, quantum algorithms, and applications in computational chemistry. I lead a team of researchers exploring the boundaries of quantum information science.",
    fieldOfInterest: [
      "Quantum Computing",
      "Quantum Entanglement",
      "Quantum Algorithms",
    ],
  }

  const [profiles, setProfiles] = useState<Researcher[]>([]);
  const [researcher, setResearcher] = useState(emptyResearcher);

  const createProfile = async () => {
    axios.post(`http://localhost:5001/api/profiles`, defaultResearcher)
    .then((response) => {
      setResearcher(response.data.result);
    })
    .catch((error: any) => {
      console.log(error);
    });
  }
  useEffect(() => {
    axios.get(`http://localhost:5001/api/profiles/${defaultResearcher.userId}`).then((response) => {
      setResearcher(response.data.result);
    }).catch((error) => {
      console.log(error);
      console.log("trying to create researcher");
    });
  }, [researcher]);

  useEffect(() => {
    axios.get(`http://localhost:5001/api/profiles`).then((response) => {
      setProfiles(response.data.result);
    }).catch((error) => {
      console.log(error);
      console.log("trying to create researcher");
    });
  }, [profiles]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BaseContent />} key="route-base">
            <Route index element={<div>Home</div>} key="route-home" />
            {profiles.map((p) => (
              <Route
                path={p.userId}
                element={<ResearcherProfile {...p} key={`route-${p.userId}`} />}
              />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    <div className="w-20 h-20 rounded-lg bg-blue-500" onClick={createProfile}>Make</div>
      {researcher.userId !== "nouser" && <ResearcherProfile {...researcher}/>}
    </>
  );
}

export default App;
