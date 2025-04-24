import { Home, LogOut, Plus, Search, User } from "lucide-react";
import { JSX } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

export const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signout } = useAuth();

  const showCreateButton = location.pathname !== "/create-post";

  const handleSignout = async () => {
    try {
      await signout();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // If not authenticated, show login/register buttons
  if (!isAuthenticated) {
    return (
      <nav className="bg-white shadow-md w-full flex justify-between items-center px-4 fixed bottom-0 left-0 z-10">
        <div className="flex-1 flex justify-between items-center max-w-4xl mx-auto">
          <NavItem
            icon={<Home size={24} />}
            to="/"
            isActive={location.pathname === "/"}
          />

          <NavItem
            icon={<User size={24} />}
            to="/login"
            isActive={location.pathname === "/login"}
          />

          <Link
            to="/register"
            className="flex flex-col items-center justify-center py-2 px-4"
          >
            <div className="bg-blue-600 rounded-full p-3 text-white">
              <Plus size={24} />
            </div>
          </Link>
        </div>
      </nav>
    );
  }

  // If authenticated, show normal nav with sign-out option
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
          icon={<User size={24} />}
          to={`/profile/${user?.username || ""}`}
          isActive={location.pathname.startsWith("/profile")}
        />

        <button
          onClick={handleSignout}
          className="flex flex-col items-center justify-center py-2 px-4 text-gray-600 hover:text-blue-500"
        >
          <div className="flex items-center justify-center">
            <LogOut size={24} />
          </div>
        </button>
      </div>
    </nav>
  );
};
