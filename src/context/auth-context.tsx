"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { User, LoginCredentials } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  updateUser: (newUser: User) => void;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if tokens exist in client storage
      const storedUser = localStorage.getItem("admin_user");
      const storedToken = localStorage.getItem("admin_access_token");

      if (storedToken) {
        try {
          // If we have a token, try to fetch the latest profile
          const response = await authService.getProfile();
          if (response.success && response.data) {
            const existingUser = storedUser ? JSON.parse(storedUser) : {};
            const mergedUser = { ...existingUser, ...response.data };
            setUser(mergedUser);
            localStorage.setItem("admin_user", JSON.stringify(mergedUser));
          } else if (storedUser) {
            // Fallback to stored user if API fails but token exists
            setUser(JSON.parse(storedUser));
          }
        } catch (e) {
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const updateUser = (newUser: User) => {
    setUser(prev => {
      const merged = { ...prev, ...newUser };
      localStorage.setItem("admin_user", JSON.stringify(merged));
      return merged;
    });
  };

  const refreshProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        updateUser(response.data);
      }
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        const { access, refresh } = response.data;
        
        localStorage.setItem("admin_access_token", access);
        localStorage.setItem("admin_refresh_token", refresh);
        
        // Fetch the latest profile immediately to ensure we have up-to-date info (like profile picture)
        try {
          const profileRes = await authService.getProfile();
          if (profileRes.success && profileRes.data) {
            const finalUser = { ...response.data.user, ...profileRes.data };
            localStorage.setItem("admin_user", JSON.stringify(finalUser));
            setUser(finalUser);
          } else {
            localStorage.setItem("admin_user", JSON.stringify(response.data.user));
            setUser(response.data.user);
          }
        } catch (profileErr) {
          // Fallback to login user data if profile fetch fails
          localStorage.setItem("admin_user", JSON.stringify(response.data.user));
          setUser(response.data.user);
        }
        
        router.push("/");
      } else {
        throw new Error(response.message || "Failed to sign in. Please try again.");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("admin_refresh_token");
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // proceed with local cleanup even if API call fails
    } finally {
      localStorage.removeItem("admin_access_token");
      localStorage.removeItem("admin_refresh_token");
      localStorage.removeItem("admin_user");
      setUser(null);
      router.push("/signin");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        updateUser,
        refreshProfile,
        logout,
        isAuthenticated: !!user,
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
