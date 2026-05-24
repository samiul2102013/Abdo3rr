import { apiClient, ApiResponse } from "@/lib/api-client";
import { CutType, CreateCutTypePayload, UpdateCutTypePayload } from "@/types/cut-type";

export const cutTypeApi = {
  getCutTypes(): Promise<ApiResponse<CutType[]>> {
    return apiClient.get<ApiResponse<CutType[]>>("/api/products/admin/cut-types/");
  },

  getCutTypeById(id: number): Promise<ApiResponse<CutType>> {
    return apiClient.get<ApiResponse<CutType>>(`/api/products/admin/cut-types/${id}/`);
  },

  createCutType(payload: CreateCutTypePayload): Promise<ApiResponse<CutType>> {
    return apiClient.post<ApiResponse<CutType>>("/api/products/admin/cut-types/create/", payload);
  },

  updateCutType(id: number, payload: UpdateCutTypePayload): Promise<ApiResponse<CutType>> {
    return apiClient.patch<ApiResponse<CutType>>(`/api/products/admin/cut-types/${id}/`, payload);
  },

  toggleCutTypeStatus(id: number): Promise<ApiResponse<CutType>> {
    return apiClient.patch<ApiResponse<CutType>>(`/api/products/admin/cut-types/${id}/toggle-status/`);
  },

  deleteCutType(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/api/products/admin/cut-types/${id}/`);
  },
};
