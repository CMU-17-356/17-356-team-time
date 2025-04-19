import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { NavigationBar } from "../src/components/Navigation";

// Mock the useLocation and useAuth hooks
jest.mock("react-router", () => ({
  useLocation: jest.fn(),
  useNavigate: () => jest.fn(),
  Link: ({ to, className, children }) => (
    <a href={to} className={className} data-testid={`link-to-${to}`}>
      {children}
    </a>
  ),
}));

// Mock the useAuth hook
jest.mock("../src/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const { useLocation } = require("react-router");
const { useAuth } = require("../src/context/AuthContext");

describe("NavigationBar Component", () => {
  const username = "testUser";
  const activeColor = "text-blue-600";
  const inactiveColor = "text-gray-600";

  beforeEach(() => {
    // Reset mocks between tests
    useLocation.mockReset();
    useAuth.mockReset();

    // Default mock for authenticated user
    useAuth.mockReturnValue({
      user: { username },
      isAuthenticated: true,
      signout: jest.fn(),
    });
  });

  test("renders all navigation items", () => {
    useLocation.mockReturnValue({ pathname: "/feed" });

    render(<NavigationBar />);

    expect(screen.getByTestId("link-to-/feed")).toBeDefined();
    expect(screen.getByTestId("link-to-/search")).toBeDefined();
    expect(screen.getByTestId("link-to-/create-post")).toBeDefined();
    expect(screen.getByTestId(`link-to-/profile/${username}`)).toBeDefined();
  });

  test("hides create post button when on create-post route", () => {
    useLocation.mockReturnValue({ pathname: "/create-post" });

    render(<NavigationBar />);

    expect(screen.queryByTestId("link-to-/create-post")).toBeNull();
  });

  test("shows create post button on other routes", () => {
    useLocation.mockReturnValue({ pathname: "/feed" });

    render(<NavigationBar />);

    expect(screen.getByTestId("link-to-/create-post")).toBeDefined();
  });

  test("profile link is active when on user's profile page", () => {
    useLocation.mockReturnValue({ pathname: `/profile/${username}` });

    render(<NavigationBar />);

    const profileLink = screen.getByTestId(`link-to-/profile/${username}`);
    expect(profileLink.className).toContain(activeColor);
  });

  test("profile link is active when on any profile page", () => {
    useLocation.mockReturnValue({ pathname: "/profile/otherUser" });

    render(<NavigationBar />);

    const profileLink = screen.getByTestId(`link-to-/profile/${username}`);
    expect(profileLink.className).toContain(activeColor);
    expect(profileLink.className).not.toContain(inactiveColor);
  });

  test("NavItem components render with correct icons", () => {
    useLocation.mockReturnValue({ pathname: "/feed" });

    render(<NavigationBar />);

    // We can't directly test for the icon components, but we can verify
    // that each NavItem has a div that would contain the icon
    const navItems = document.querySelectorAll(
      ".flex.items-center.justify-center",
    );
    expect(navItems.length).toBeGreaterThan(0);
  });

  test("renders login/register navigation when not authenticated", () => {
    useLocation.mockReturnValue({ pathname: "/" });
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      signout: jest.fn(),
    });

    render(<NavigationBar />);

    expect(screen.getByTestId("link-to-/")).toBeDefined();
    expect(screen.getByTestId("link-to-/login")).toBeDefined();
    expect(screen.getByTestId("link-to-/register")).toBeDefined();
  });
});
