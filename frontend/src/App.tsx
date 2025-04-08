import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { OutletPage } from "./components/OutletPage";
import CreatePost from "./routes/CreatePost";
import { FeedPage } from "./routes/FeedPage";
import Landing from "./routes/Landing";
import { ProfilePage } from "./routes/ProfilePage";
import Registration from "./routes/Registration";
import SearchPage, { Profile } from "./routes/SearchPage";

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
          <Route path="/" element={<OutletPage />} key="route-base">
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
            <Route path="/feed" element={<FeedPage />} />
            <Route
              path="/search"
              element={<SearchPage profiles={profiles} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
