import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { ProfilePage } from "./ProfilePage";
import { API_ENDPOINT } from "./consts";
import { Home } from "./routes/Home";
import { Researcher } from "./types";

function App() {
  const [profiles, setProfiles] = useState<Researcher[]>([]);

  useEffect(() => {
    console.log("trying to fetch all profiles");
    axios.get(API_ENDPOINT).then((response) => {
      if (response.data.profiles) {
        setProfiles(response.data.profiles);
        console.log(response.data.profiles);
      }
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  // useEffect(() => {
  //   console.log("trying to fetch researcher with id: ", defaultResearcher.profileId);
  //   axios.get(`${API_ENDPOINT}/${defaultResearcher.profileId}`).then((response) => {
  //     // setResearcher({...researcher, ...response.data});
  //     console.log("fetched researcher: ", response.data)
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }, []);

  console.log("all profiles", profiles);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home profiles={profiles}/>} key="route-base">
            <Route index element={<Home profiles={profiles}/>} key="route-index" />
            <Route path="/profile/:profileId" element={<ProfilePage profiles={profiles}/>} key={`route-profile`} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
