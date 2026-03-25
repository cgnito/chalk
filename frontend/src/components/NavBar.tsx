import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, LayoutDashboard } from "lucide-react";

import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import{ Button } from "./button";

export const Navbar = () => {
  const { school, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 inset-x-0 z-30 h-16 border-b border-white/8 backdrop-blur-xl bg-[#080e1e]/80"
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/30">
            <span className="text-white font-black text-sm">C</span>
          </div>
          <span className="font-black text-white text-xl tracking-tight">chalk</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated() ? (
            <>
              <span className="text-slate-400 text-sm hidden sm:block">
                {school?.name || school?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Log in</Button>
              <Button size="sm" onClick={() => navigate("/register")}>Get Started</Button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};