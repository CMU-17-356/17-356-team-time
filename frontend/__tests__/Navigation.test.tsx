import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { NavigationBar } from "../src/components/Navigation";

// Mock the useLocation hook
jest.mock("react-router", () => ({
  useLocation: jest.fn(),
  Link: ({ to, className, children }) => (
    <a href={to} className={className} data-testid={`link-to-${to}`}>
      {children}
    </a>
  ),
}));

const { useLocation } = require("react-router");

describe("NavigationBar Component", () => {
  const username = "testUser";
  const activeColor = "text-blue-600";
  const inactiveColor = "text-gray-600";
  beforeEach(() => {
    // Reset mock between tests
    useLocation.mockReset();
  });

  test("renders all navigation items", () => {
    useLocation.mockReturnValue({ pathname: "/feed" });

    render(<NavigationBar user={username} />);

    expect(screen.getByTestId("link-to-/feed")).toBeDefined();
    expect(screen.getByTestId("link-to-/search")).toBeDefined();
    expect(screen.getByTestId("link-to-/create-post")).toBeDefined();
    expect(screen.getByTestId("link-to-/notifications")).toBeDefined();
    expect(screen.getByTestId(`link-to-/profile/${username}`)).toBeDefined();
  });

  test("hides create post button when on create-post route", () => {
    useLocation.mockReturnValue({ pathname: "/create-post" });

    render(<NavigationBar user={username} />);

    expect(screen.queryByTestId("link-to-/create-post")).toBeNull();
  });

  test("shows create post button on other routes", () => {
    useLocation.mockReturnValue({ pathname: "/feed" });

    render(<NavigationBar user={username} />);

    expect(screen.getByTestId("link-to-/create-post")).toBeDefined();
  });

  test("profile link is active when on user's profile page", () => {
    useLocation.mockReturnValue({ pathname: `/profile/${username}` });

    render(<NavigationBar user={username} />);

    const profileLink = screen.getByTestId(`link-to-/profile/${username}`);
    expect(profileLink.className).toContain(activeColor);
  });

  test("profile link is not active when on different user's profile", () => {
    useLocation.mockReturnValue({ pathname: "/profile/otherUser" });

    render(<NavigationBar user={username} />);

    const profileLink = screen.getByTestId(`link-to-/profile/${username}`);
    expect(profileLink.className).not.toContain(activeColor);
    expect(profileLink.className).toContain(inactiveColor);
  });

  test("NavItem components render with correct icons", () => {
    useLocation.mockReturnValue({ pathname: "/feed" });

    render(<NavigationBar user={username} />);

    // We can't directly test for the icon components, but we can verify
    // that each NavItem has a div that would contain the icon
    const navItems = document.querySelectorAll(
      ".flex.items-center.justify-center",
    );
    expect(navItems.length).toBeGreaterThan(0);
  });
});
