import { Bell, Home, Plus, Search, User } from "lucide-react";
import { JSX } from "react";
import { Link, useLocation } from "react-router";

interface NavItemProps {
  icon: JSX.Element;
  to: string;
  isActive: boolean;
}

const NavItem = (props: NavItemProps) => {
  return (
    <Link
      to={props.to}
      data-testid={`link-to-${props.to}`}
      className={`flex flex-col items-center justify-center py-2 px-4 ${
        props.isActive
          ? "text-blue-600 font-medium"
          : "text-gray-600 hover:text-blue-500"
      }`}
    >
      <div className="flex items-center justify-center">{props.icon}</div>
    </Link>
  );
};

export const NavigationBar = ({ user }: { user: string }) => {
  const location = useLocation();
  const showCreateButton = location.pathname !== "/create-post";

  return (
    <nav className="bg-white shadow-md w-full flex justify-between items-center px-4 fixed bottom-0 left-0 z-10">
      <div className="flex-1 flex justify-between items-center max-w-4xl mx-auto">
        <NavItem
          icon={<Home size={24} />}
          to="/feed"
          isActive={location.pathname === "/feed"}
        />

        <NavItem
          icon={<Search size={24} />}
          to="/search"
          isActive={location.pathname === "/search"}
        />

        {showCreateButton && (
          <Link
            to="/create-post"
            className="flex flex-col items-center justify-center py-2 px-4"
          >
            <div className="bg-blue-600 rounded-full p-3 text-white">
              <Plus size={24} />
            </div>
          </Link>
        )}

        <NavItem
          icon={<Bell size={24} />}
          to="/notifications"
          isActive={location.pathname === "/notifications"}
        />

        <NavItem
          icon={<User size={24} />}
          to={`/profile/${user}`}
          isActive={location.pathname === `/profile/${user}`}
        />
      </div>
    </nav>
  );
};
