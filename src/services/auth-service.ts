import { apiClient, ApiResponse } from "@/lib/api-client";
import { LoginCredentials, LoginResponse, ProfileUpdatePayload, User } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<ApiResponse<LoginResponse>>("/api/accounts/admin/login/", credentials);
  },

  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>("/api/accounts/admin/profile/");
  },

  async updateProfile(payload: ProfileUpdatePayload): Promise<ApiResponse<User>> {
    const formData = new FormData();
    if (payload.name) formData.append("name", payload.name);
    if (payload.phone) formData.append("phone", payload.phone);
    if (payload.profile_picture) {
      formData.append("profile_picture", payload.profile_picture);
    }
    return apiClient.patch<ApiResponse<User>>("/api/accounts/admin/profile/", formData);
  },

  async changePassword(payload: { old_password: string; new_password: string; new_password2: string }): Promise<ApiResponse<null>> {
    return apiClient.post<ApiResponse<null>>("/api/accounts/admin/change-password/", payload);
  },

  async logout(refreshToken: string): Promise<ApiResponse<null>> {
    return apiClient.post<ApiResponse<null>>("/api/accounts/admin/logout/", { refresh: refreshToken });
  },
};
