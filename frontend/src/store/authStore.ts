import { create } from "zustand";
import type { School } from "../types";

interface AuthState {
  token: string | null;
  school: School | null;
  setAuth: (token: string, school: School) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem("chalk_token"),
  school: (() => {
    try {
      const s = localStorage.getItem("chalk_school");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  })(),

  setAuth: (token, school) => {
    localStorage.setItem("chalk_token", token);
    localStorage.setItem("chalk_school", JSON.stringify(school));
    set({ token, school });
  },

  logout: () => {
    localStorage.removeItem("chalk_token");
    localStorage.removeItem("chalk_school");
    set({ token: null, school: null });
  },

  isAuthenticated: () => !!get().token,
}));