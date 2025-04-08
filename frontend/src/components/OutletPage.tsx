import { Outlet } from "react-router";
import { NavigationBar } from "./Navigation";

export const OutletPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      {/* TODO: replace with user's ID */}
      <NavigationBar user={"hwei-shin"} />
    </div>
  );
};
