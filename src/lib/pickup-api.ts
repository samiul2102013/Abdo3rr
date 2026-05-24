import { apiClient, ApiResponse } from "@/lib/api-client";
import {
  PickupLocation,
  CreatePickupLocationPayload,
  UpdatePickupLocationPayload,
} from "@/types/pickup";

export const pickupApi = {
  getPickupLocations(): Promise<ApiResponse<PickupLocation[]>> {
    return apiClient.get<ApiResponse<PickupLocation[]>>("/api/orders/admin/pickup-locations/");
  },

  getPickupLocationById(id: number): Promise<ApiResponse<PickupLocation>> {
    return apiClient.get<ApiResponse<PickupLocation>>(`/api/orders/admin/pickup-locations/${id}/`);
  },

  createPickupLocation(payload: CreatePickupLocationPayload): Promise<ApiResponse<PickupLocation>> {
    return apiClient.post<ApiResponse<PickupLocation>>("/api/orders/admin/pickup-locations/", payload);
  },

  updatePickupLocation(id: number, payload: UpdatePickupLocationPayload): Promise<ApiResponse<PickupLocation>> {
    return apiClient.patch<ApiResponse<PickupLocation>>(`/api/orders/admin/pickup-locations/${id}/`, payload);
  },

  deletePickupLocation(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/api/orders/admin/pickup-locations/${id}/`);
  },
};
