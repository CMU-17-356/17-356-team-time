import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import Landing from "./routes/Landing";
import { ProfilePage } from "./routes/ProfilePage";
import Registration from "./routes/Registration";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Outlet />} key="route-base">
            <Route index element={<Landing />} key="route-index"/>
            <Route path="/register" element={<Registration />} />
            <Route path="/profile/:userId" element={<ProfilePage />} key={`route-profile`} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;