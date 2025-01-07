import axios, { AxiosError, AxiosInstance } from "axios";
import type { LoginForm } from "../../schemas/auth";
import type { AuthResponse } from "../../types/auth";
import type { CandidateFormData } from "../../types/candidate";
import type { RecruiterFormData } from "../../types/recruiter";

const API_URL =
  "https://96f9-2400-adc5-123-a700-8056-37a-e256-83e9.ngrok-free.app/auth";

// Token utilities
const TOKEN_KEY = "access_token";
const ROLE_KEY = "user_role";

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
const removeToken = () => localStorage.removeItem(TOKEN_KEY);
const setRole = (role: string) => localStorage.setItem(ROLE_KEY, role);

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Error handler
const handleError = (error: AxiosError) => {
  if (error.response?.status === 401) {
    removeToken();
    window.location.href = "/login";
  }
  throw error;
};

export const authService = {
  async login(data: LoginForm): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/login", data);
      const { access_token, user } = response.data;
      setToken(access_token);
      setRole(user.role);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  async register(data: CandidateFormData | RecruiterFormData): Promise<any> {
    try {
      const endpoint =
        "role" in data && data.role === "recruiter"
          ? "/recruiter/signup"
          : "/candidate/signup";

      await api.post<AuthResponse>(endpoint, data);
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  async getProfile(): Promise<AuthResponse["user"]> {
    try {
      const response = await api.get<AuthResponse["user"]>("/profile");
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  async uploadResume(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const response = await api.post<{ url: string }>(
        "/upload-resume",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  logout(): void {
    removeToken();
    window.location.href = "/login";
  },
};
