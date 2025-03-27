import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api/auth.service";
import { useToast } from "./ToastContext";
import type { User } from "../types/auth";
import type { CandidateFormData } from "../types/candidate";
import type { RecruiterFormData } from "../types/recruiter";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    role: "candidate" | "recruiter"
  ) => Promise<void>;
  token?: string;
  register: (data: CandidateFormData | RecruiterFormData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | undefined>(undefined);
  const { addToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_role");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    role: "candidate" | "recruiter"
  ) => {
    setIsLoading(true);
    try {
      const { user: userData, access_token } = await authService.login({
        email,
        password,
      });
      
      localStorage.setItem("access_token", access_token);
      setToken(access_token);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: CandidateFormData | RecruiterFormData) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      addToast(
        "success",
        "User Created!",
        "You have successfully created a user."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    setUser(null);
    addToast("info", "Logged Out", "You have been logged out successfully.");
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (data.resume instanceof File) {
        const { url } = await authService.uploadResume(data.resume);
        data.resumeUrl = url;
        delete data.resume;
      }

      const updatedUser = await authService.getProfile();
      setUser(updatedUser);
      addToast(
        "success",
        "Profile Updated",
        "Your profile has been updated successfully."
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      addToast("error", "Update Failed", message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
