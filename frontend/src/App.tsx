import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Landing from "./routes/Landing";
import { ProfilePage } from "./routes/ProfilePage";
import SearchPage, { Profile } from "./routes/SearchPage";
import Registration from "./routes/Registration";
import { FeedPage } from "./routes/FeedPage";
import CreatePost from "./routes/CreatePost";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/profiles");
        setProfiles(response.data.profiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Outlet />} key="route-base">
            <Route index element={<Landing />} key="route-index" />
            <Route path="/register" element={<Registration />} />
            <Route
              path="/profile/:userId"
              element={<ProfilePage />}
              key={`route-profile`}
            />
            <Route
              path="/create-post"
              element={<CreatePost />}
              key="route-create-post"
            />
          </Route>
          <Route path="/search" element={<SearchPage profiles={profiles} />} />
          <Route path="/feed" element={<FeedPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
