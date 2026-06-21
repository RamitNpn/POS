"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCurrentUser, loginUser, logoutUser } from "@/lib/api/auth.api";
import { socket } from "@/utils/socket";

export type UserRole = "admin" | "waiter" | "kitchen" | "cashier";

export interface AuthData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthData | null>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "auth-data";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const cachedUser = localStorage.getItem(STORAGE_KEY);

        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }

        const response = await getCurrentUser();

        if (response.success && response.user) {
          const userData: AuthData = {
            ...response.user,
            id: (response.user as any)._id || response.user.id,
          };

          setUser(userData);

          localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        }
      } catch (error: any) {
        if (error?.response?.status !== 401) {
          console.error("Failed to load current user:", error);
        }

        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthData | null> => {
      setIsLoading(true);

      try {
        const response = await loginUser(email, password);

        if (!response.success) {
          return null;
        }

        const backendUser = response.user;

        const userData: AuthData = {
          id: (backendUser as any)._id || backendUser.id,
          name: backendUser.name,
          email: backendUser.email,
          role: backendUser.role,
        };

        setUser(userData);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

        // Connect socket AFTER successful authentication
        console.log("📊 Socket status before connect:", {
          connected: socket.connected,
          disconnected: socket.disconnected,
          id: socket.id,
        });
        
        if (!socket.connected) {
          console.log("🔄 Connecting socket after login...");
          socket.connect();
          
          // Wait a bit and check status
          setTimeout(() => {
            console.log("📊 Socket status after connect attempt:", {
              connected: socket.connected,
              disconnected: socket.disconnected,
              id: socket.id,
            });
          }, 500);
        } else {
          console.warn("⚠️ Socket already connected");
        }

        return userData;
      } catch (error) {
        console.error("Login error:", error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await logoutUser();
      socket.disconnect();
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);

      localStorage.removeItem(STORAGE_KEY);

      setIsLoading(false);
    }
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUser((current) => {
      if (!current) return null;

      const updatedUser = {
        ...current,
        role,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

      return updatedUser;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
