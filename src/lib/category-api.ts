import { apiClient, ApiResponse } from "@/lib/api-client";
import { Category, CreateCategoryPayload, UpdateCategoryPayload } from "@/types/category";

export const categoryApi = {
  getCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get<ApiResponse<Category[]>>("/api/categories/admin/categories/");
  },

  getCategoryById(id: number): Promise<ApiResponse<Category>> {
    return apiClient.get<ApiResponse<Category>>(`/api/categories/admin/categories/${id}/`);
  },

  createCategory(payload: FormData): Promise<ApiResponse<Category>> {
    return apiClient.post<ApiResponse<Category>>("/api/categories/admin/categories/create/", payload);
  },

  updateCategory(id: number, payload: FormData): Promise<ApiResponse<Category>> {
    return apiClient.patch<ApiResponse<Category>>(`/api/categories/admin/categories/${id}/update/`, payload);
  },

  toggleCategoryStatus(id: number): Promise<ApiResponse<Category>> {
    return apiClient.patch<ApiResponse<Category>>(`/api/categories/admin/categories/${id}/toggle-status/`);
  },

  deleteCategory(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/api/categories/admin/categories/${id}/delete/`);
  },
};
