import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import type { SchoolCreate } from "../types";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { setAuth, logout, school, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { access_token } = await authApi.login(email, password);
      // Decode school info from token or fetch separately
      // For now we store a minimal object; token carries email
      const payload = JSON.parse(atob(access_token.split(".")[1]));
      const minimalSchool = { email: payload.sub } as any;
      setAuth(access_token, minimalSchool);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: SchoolCreate) => {
    setLoading(true);
    try {
      const school = await authApi.register(data);
      // After register, auto-login
      const { access_token } = await authApi.login(data.email, data.password);
      setAuth(access_token, school);
      toast.success("School registered! Welcome to Chalk 🎉");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out");
  };

  return { login, register, handleLogout, loading, school, isAuthenticated };
};