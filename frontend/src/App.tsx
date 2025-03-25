import axios from "axios";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { ProfilePage } from "./ProfilePage";
import { API_ENDPOINT, defaultResearcher, emptyResearcher } from "./consts";
import { Researcher } from "./types";

function App() {
  const [profiles, setProfiles] = useState<Researcher[]>([]);
  const [researcher, setResearcher] = useState(emptyResearcher);

  const createProfile = () => {
    if (researcher.profileId === "nouser") {
      console.log("trying to create researcher with id: ", defaultResearcher.profileId);
      axios.post(API_ENDPOINT, defaultResearcher)
      .then((response) => {
        setResearcher({...defaultResearcher, ...response.data});
        setProfiles([...profiles, response.data]);
        console.log(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
    } else {
      console.log("researcher already exists");
    }
  }

  // useEffect(() => {
  //   console.log("trying to fetch all profiles");
  //   axios.get(API_ENDPOINT).then((response) => {
  //     if (response.data.profiles) {
  //       setProfiles(response.data.profiles);
  //     }
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>Reach</div>} key="route-base">
            <Route index element={<div className="w-20 h-20 rounded-lg bg-blue-500" onClick={createProfile}>Make</div>} key="route-home" />
            <Route path="/u/:profile" element={<ProfilePage />} key="route-profile" />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
