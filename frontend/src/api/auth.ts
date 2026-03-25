import { apiClient } from "./client";
import type { AuthResponse, School, SchoolCreate } from "../types";

export const authApi = {
  register: async (data: SchoolCreate): Promise<School> => {
    const res = await apiClient.post<School>("/register/", data);
    return res.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    // FastAPI OAuth2 expects form data
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const res = await apiClient.post<AuthResponse>("/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return res.data;
  },
};