import { apiClient, ApiResponse } from "@/lib/api-client";
import { PackagingType, CreatePackagingTypePayload, UpdatePackagingTypePayload } from "@/types/packaging";

export const packagingApi = {
  getPackagingTypes(): Promise<ApiResponse<PackagingType[]>> {
    return apiClient.get<ApiResponse<PackagingType[]>>("/api/categories/admin/packaging-types/");
  },

  createPackagingType(payload: CreatePackagingTypePayload): Promise<ApiResponse<PackagingType>> {
    return apiClient.post<ApiResponse<PackagingType>>("/api/categories/admin/packaging-types/create/", payload);
  },

  updatePackagingType(id: number, payload: UpdatePackagingTypePayload): Promise<ApiResponse<PackagingType>> {
    return apiClient.patch<ApiResponse<PackagingType>>(`/api/categories/admin/packaging-types/${id}/update/`, payload);
  },

  togglePackagingStatus(id: number): Promise<ApiResponse<PackagingType>> {
    return apiClient.patch<ApiResponse<PackagingType>>(`/api/categories/admin/packaging-types/${id}/toggle-status/`);
  },

  deletePackagingType(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/api/categories/admin/packaging-types/${id}/delete/`);
  },
};
