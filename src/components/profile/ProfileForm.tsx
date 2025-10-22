// src/components/profile/ProfileForm.tsx
import React, { useState, useEffect } from "react";
import { FileText, Loader2 } from "lucide-react";
import { User } from "../../types/auth";
import axios from "axios";
import { ResumeView } from "./ResumeView";
import { getResume } from "../../services/api/candidate_endpoints";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

interface ResumeDetails {
  name: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    start_date: string;
    end_date: string;
  }>;
  experience: Array<{
    job_title: string;
    company: string;
    start_date: string;
    end_date: string;
    responsibilities: string;
  }>;
  skills: string[];
  certifications: Array<{
    title: string;
    issuer: string;
    date: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  projects: Array<{
    project_title: string;
    description: string;
    technologies: string;
  }>;
  achievements: string[];
}

export function ProfileForm({ user }: { user: User }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeDetails, setResumeDetails] = useState<ResumeDetails | null>(
    null
  );

  useEffect(() => {
    // Only fetch resume if user is a candidate
    if (user.role !== "candidate") return;

    const fetchResumeDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getResume();
        if (response !== false) {
          setResumeDetails(response);
        }
      } catch (error) {
        console.error("Failed to fetch resume:", error);
        // Don't show error for 404 - just means no resume yet
        if (axios.isAxiosError(error) && error.response?.status !== 404) {
          setError("Failed to load resume details. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumeDetails();
  }, [user.role]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      alert("Only PDF files are accepted");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be less than 5MB");
      e.target.value = "";
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) throw new Error("No access token found");

      const formData = new FormData();
      formData.append("file", file);

      await axios.post<{ url: string }>(
        "http://localhost:8000/candidate/upload-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert("Resume uploaded successfully!");
      e.target.value = "";

      // Fetch the updated resume details
      const response = await axios.get(
        "http://localhost:8000/candidate/resume",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setResumeDetails(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (user.role !== "candidate") return null;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {resumeDetails ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Resume Details
            </h3>
            <button
              onClick={() => setResumeDetails(null)}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Upload New Resume
            </button>
          </div>

          <ResumeView resume={resumeDetails} />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Resume (PDF only, max 5MB)
            </label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={isUploading}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:file:bg-gray-700 dark:file:text-gray-200"
              />
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {isUploading && (
              <p className="mt-1 text-sm text-blue-600">Uploading...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
