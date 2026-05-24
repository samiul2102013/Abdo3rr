import { apiClient, ApiResponse } from "@/lib/api-client";
import { DashboardStats, SalesDataPoint, TopInventoryItem, RecentOrder } from "@/types/dashboard";

export const dashboardApi = {
  getStats(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<ApiResponse<DashboardStats>>("/api/dashboard/admin/dashboard/stats/");
  },

  getSales(): Promise<ApiResponse<SalesDataPoint[]>> {
    return apiClient.get<ApiResponse<SalesDataPoint[]>>("/api/dashboard/admin/dashboard/sales/");
  },

  getTopInventory(): Promise<ApiResponse<TopInventoryItem[]>> {
    return apiClient.get<ApiResponse<TopInventoryItem[]>>("/api/dashboard/admin/dashboard/top-inventory/");
  },

  getRecentOrders(): Promise<ApiResponse<RecentOrder[]>> {
    return apiClient.get<ApiResponse<RecentOrder[]>>("/api/dashboard/admin/dashboard/recent-orders/");
  },
};
