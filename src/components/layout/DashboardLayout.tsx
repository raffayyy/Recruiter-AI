import React from "react";
import { useNavigate } from "react-router-dom";
import { BriefcaseIcon, LogOutIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { NotificationPopover } from "../notifications/NotificationPopover";
import { Button } from "../ui/Button";
import { div } from "three/tsl";
import { getResume } from "../../services/api/candidate_endpoints";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleResume = async () => {
    if (user?.role === "candidate") {
      const resume = await getResume();
      if (resume != null) {
        localStorage.setItem("resume", "true");
      }
    }
  };

  const user_resume = localStorage.getItem("resume") ? true : false;

  React.useEffect(() => {
    handleResume();
  }, [user]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <BriefcaseIcon className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  Recruiter.AI
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationPopover />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Welcome{" "}
                <span className="text-md font-black">{user?.full_name},</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOutIcon className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {user?.role === "candidate" && !user_resume && (
        <div>
          <div className="h-4"></div>
          <nav className="border-2 rounded-xs bg-red-50 shadow-sm dark:bg-red-300 dark:border-red-700">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <span className="text-sm font-medium text-red-800 dark:text-red-900">
                  Please upload your resume.
                </span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 px-4 py-2 transition-all  hover:bg-red-100 dark:hover:bg-red-500"
                >
                  Upload Resume
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
