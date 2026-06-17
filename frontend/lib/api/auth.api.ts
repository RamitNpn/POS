import { apiClient } from "@/utils/apiClient";
import type { User } from "@/lib/types";

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface MeResponse {
  success: boolean;
  user: User;
}

export async function loginUser(email: string, password: string) {
  const response = await apiClient.post<LoginResponse>("/user/login", {
    email,
    password,
  });
  return response.data;
}

export async function logoutUser() {
  const response = await apiClient.post<LogoutResponse>("/user/logout", {});
  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get<MeResponse>("/user/me");
  return response.data;
}
