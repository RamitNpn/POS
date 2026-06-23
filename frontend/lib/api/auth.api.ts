// lib/api/auth.api.ts

import { apiClient } from "@/utils/apiClient";
import { AuthData } from "@/context/auth-context";

export interface LoginResponse {
  success: boolean;
  message: string;
  user: AuthData;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface MeResponse {
  success: boolean;
  user: AuthData;
}

export async function loginUser(email: string, password: string) {
  const response = await apiClient.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function logoutUser() {
  const response = await apiClient.post<LogoutResponse>("/auth/logout");

  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get<MeResponse>("/auth/me");

  return response.data;
}