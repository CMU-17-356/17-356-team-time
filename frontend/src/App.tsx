// src/App.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { OutletPage } from "./components/OutletPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import CreatePost from "./routes/CreatePost";
import { FeedPage } from "./routes/FeedPage";
import Landing from "./routes/Landing";
import Login from "./routes/Login";
import { ProfilePage } from "./routes/ProfilePage";
import Registration from "./routes/Registration";
import SearchPage, { Profile } from "./routes/SearchPage";
import Verification from "./routes/Verification";

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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}

          <Route index element={<Landing />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verification />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<OutletPage />}>
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route
                path="/search"
                element={<SearchPage profiles={profiles} />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
