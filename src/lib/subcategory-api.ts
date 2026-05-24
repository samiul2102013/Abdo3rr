import { apiClient, ApiResponse } from "@/lib/api-client";
import { Subcategory, CreateSubcategoryPayload, UpdateSubcategoryPayload } from "@/types/category";

export const subcategoryApi = {
  getSubcategories(): Promise<ApiResponse<Subcategory[]>> {
    return apiClient.get<ApiResponse<Subcategory[]>>("/api/categories/admin/subcategories/");
  },

  getSubcategoryById(id: number): Promise<ApiResponse<Subcategory>> {
    return apiClient.get<ApiResponse<Subcategory>>(`/api/categories/admin/subcategories/${id}/`);
  },

  createSubcategory(payload: FormData): Promise<ApiResponse<Subcategory>> {
    return apiClient.post<ApiResponse<Subcategory>>("/api/categories/admin/subcategories/create/", payload);
  },

  updateSubcategory(id: number, payload: FormData): Promise<ApiResponse<Subcategory>> {
    return apiClient.patch<ApiResponse<Subcategory>>(`/api/categories/admin/subcategories/${id}/`, payload);
  },

  toggleSubcategoryStatus(id: number): Promise<ApiResponse<Subcategory>> {
    return apiClient.patch<ApiResponse<Subcategory>>(`/api/categories/admin/subcategories/${id}/toggle-status/`);
  },

  deleteSubcategory(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/api/categories/admin/subcategories/${id}/`);
  },
};
