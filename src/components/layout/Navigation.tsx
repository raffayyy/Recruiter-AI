import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BriefcaseIcon,
  UserCircle,
  Settings,
  Sun,
  Moon,
  ClipboardList,
  Users,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";

export function Navigation() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavItems = () => {
    if (!isAuthenticated) {
      return [{ path: "/", icon: BriefcaseIcon, label: "Home" }];
    }

    const items = [
      { path: "/dashboard", icon: BriefcaseIcon, label: "Dashboard" },
    ];

    if (user?.role === "recruiter") {
      items.push(
        { path: "/applications", icon: ClipboardList, label: "Applications" },
        { path: "/candidates", icon: Users, label: "Candidates" }
      );
    } else {
      items.push(
        {
          path: "/applications",
          icon: ClipboardList,
          label: "My Applications",
        },
        { path: "/profile", icon: UserCircle, label: "Profile" }
      );
    }

    items.push({ path: "/settings", icon: Settings, label: "Settings" });

    return items;
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Recruiter.AI
          </span>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}

          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="ml-4"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}

            {!isAuthenticated && (
              <div className="mt-3 flex flex-col space-y-2 px-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}

            <div className="mt-3 px-3">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  toggleTheme();
                  setMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-5 w-5" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
