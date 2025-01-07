import { ApiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { User, AuthResponse } from "../../types/auth";
import type { CandidateFormData } from "../../types/candidate";
import type { RecruiterFormData } from "../../types/recruiter";

export class AuthAPI {
  constructor(private client: ApiClient) {}

  async login(
    email: string,
    password: string,
    role: "candidate" | "recruiter"
  ): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>(API_ENDPOINTS.LOGIN, {
      email,
      password,
      role,
    });

    const authResponse = response;
    localStorage.setItem("access_token", authResponse.access_token);
    localStorage.setItem("user_role", role);
    return authResponse;
  }

  async signup(
    data: CandidateFormData | RecruiterFormData,
    role: "candidate" | "recruiter"
  ): Promise<AuthResponse> {
    const endpoint =
      role === "candidate"
        ? API_ENDPOINTS.REGISTER_CANDIDATE
        : API_ENDPOINTS.REGISTER_RECRUITER;
    const authResponse = await this.client.post<AuthResponse>(endpoint, data);

    localStorage.setItem("access_token", authResponse.access_token);
    localStorage.setItem("user_role", role);
    return authResponse;
  }

  async getProfile(): Promise<User> {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    const user = await this.client.get<User>(API_ENDPOINTS.PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return user;
  }
}
