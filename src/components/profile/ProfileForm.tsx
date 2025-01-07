import React, { useState } from "react";
import { FileText } from "lucide-react";
import { User } from "../../types/auth";
import axios from "axios";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];
export function ProfileForm({ user }: { user: User }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // src/components/profile/ProfileForm.tsx
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
      formData.append("file", file); // Changed from 'resume' to 'file'

      await axios.post<{ url: string }>(
        "https://96f9-2400-adc5-123-a700-8056-37a-e256-83e9.ngrok-free.app/candidate/upload-resume",
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
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  if (user.role !== "candidate") return null;

  return (
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
  );
}
