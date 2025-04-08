import { BrowserRouter, Route, Routes } from "react-router";
import { OutletPage } from "./components/OutletPage";
import CreatePost from "./routes/CreatePost";
import { FeedPage } from "./routes/FeedPage";
import Landing from "./routes/Landing";
import { ProfilePage } from "./routes/ProfilePage";
import Registration from "./routes/Registration";

function App() {
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
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
