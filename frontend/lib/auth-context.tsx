'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  schoolSlug: string | null;
  schoolName: string | null;
  login: (token: string, schoolSlug?: string | null, schoolName?: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [schoolSlug, setSchoolSlug] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage
    const savedToken = localStorage.getItem('token');
    const savedSlug = localStorage.getItem('school_slug');
    const savedName = localStorage.getItem('school_name');

    if (savedToken) {
      setToken(savedToken);
      setSchoolSlug(savedSlug);
      setSchoolName(savedName);
    }
    setIsHydrated(true);
  }, []);
  
  const login = (newToken: string, slug?: string | null, name?: string | null) => {
    setToken(newToken);
    setSchoolSlug(slug ?? null);
    setSchoolName(name ?? null);
    localStorage.setItem('token', newToken);
    if (slug) localStorage.setItem('school_slug', slug);
    else localStorage.removeItem('school_slug');
    if (name) localStorage.setItem('school_name', name);
    else localStorage.removeItem('school_name');
  };

  const logout = () => {
    setToken(null);
    setSchoolSlug(null);
    setSchoolName(null);
    localStorage.removeItem('token');
    localStorage.removeItem('school_slug');
    localStorage.removeItem('school_name');
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        schoolSlug,
        schoolName,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
