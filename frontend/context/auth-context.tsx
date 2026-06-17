"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { User, UserRole } from "@/lib/types";
import { getCurrentUser, loginUser, logoutUser } from "@/lib/api/auth.api";

export interface AuthData {
  id: string;
  name: string;
  email: string;
  token: string;
  role: string;
}
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "auth-data";
const TOKEN_KEY = "token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const token = localStorage.getItem(TOKEN_KEY);

        if (stored && token) {
          const parsed: AuthData = JSON.parse(stored);

          setUser({
            ...parsed,
          } as unknown as User);
        } else {
          const response = await getCurrentUser();

          if (response.success) {
            setUser(response.user);
          }
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<User | null> => {
      setIsLoading(true);

      try {
        const response = await loginUser(email, password);

        if (response.success) {
          const user = response.user;
          const token = response.token;

          setUser(user);

          const authData: AuthData = {
            id: user.id,
            name: user.name,
            email: user.email,
            token,
            role: user.role,
          };

          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));

          return user;
        }

        return null;
      } catch {
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
    } catch {
      // ignore
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
      setIsLoading(false);
    }
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUser((current) =>
      current
        ? {
            ...current,
            role,
          }
        : null,
    );
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
