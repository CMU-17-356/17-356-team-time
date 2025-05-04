import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NavigationBar } from "./Navigation";

export const OutletPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col h-screen pb-20">
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      {isAuthenticated && <NavigationBar />}
    </div>
  );
};
