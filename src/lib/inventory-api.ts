import { apiClient, ApiResponse } from "@/lib/api-client";
import { InventoryPaginatedData } from "@/types/inventory";

export const inventoryApi = {
  getInventory(page = 1): Promise<ApiResponse<InventoryPaginatedData>> {
    return apiClient.get<ApiResponse<InventoryPaginatedData>>(`/api/products/admin/inventory/?page=${page}`);
  },
};
