import { Outlet } from "react-router-dom";
import { NavigationBar } from "./Navigation";
import { useAuth } from "../context/AuthContext";

export const OutletPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      {isAuthenticated && <NavigationBar />}
    </div>
  );
};
