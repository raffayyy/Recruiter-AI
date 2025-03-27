import React from "react";
import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorBoundary } from "../components/common/ErrorBoundary";

// Import components directly to avoid dynamic import issues
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import CandidateDashboard from "../pages/dashboard/CandidateDashboard";
import RecruiterDashboard from "../pages/dashboard/RecruiterDashboard";
import ApplicationsPage from "../pages/applications/ApplicationsPage";
import ApplicationDetailsPage from "../pages/applications/ApplicationDetailsPage";
import InterviewPage from "../pages/interview/InterviewPage";
import ProfilePage from "../pages/profile/ProfilePage";
import SettingsPage from "../pages/settings/SettingsPage";
import FeedbackPage from "../pages/feedback/FeedbackPage";
import JobDetailsPage from "../pages/jobs/JobDetailsPage";
import EditJobPage from "../pages/jobs/EditJobPage";
import CreateJobPage from "../pages/jobs/CreateJobPage";
import CandidatesPage from "../pages/recruiter/CandidatesPage";
import InterviewCompletePage from "../pages/interview/InterviewCompletePage";

export function AppRoutes() {
  const { user } = useAuth();

  const DashboardComponent =
    user?.role === "recruiter" ? RecruiterDashboard : CandidateDashboard;

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardComponent />
              </PrivateRoute>
            }
          />

          <Route
            path="/applications"
            element={
              <PrivateRoute>
                <ApplicationsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/applications/:applicationId/details"
            element={
              <PrivateRoute>
                <ApplicationDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/applications/:applicationId/feedback"
            element={
              <PrivateRoute>
                <FeedbackPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/jobs/:jobId/details"
            element={
              <PrivateRoute>
                <JobDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/jobs/:jobId/edit"
            element={
              <PrivateRoute>
                <EditJobPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/jobs/create"
            element={
              <PrivateRoute>
                <CreateJobPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/candidates"
            element={
              <PrivateRoute>
                <CandidatesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/interview/:id"
            element={
              <PrivateRoute>
                <InterviewPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/interview-complete"
            element={<InterviewCompletePage />}
          />
        </Routes>
      </React.Suspense>
    </ErrorBoundary>
  );
}
