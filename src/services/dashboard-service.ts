import { dashboardApi } from "@/lib/dashboard-api";

export const dashboardService = {
  async getStats() {
    return dashboardApi.getStats();
  },

  async getSales() {
    return dashboardApi.getSales();
  },

  async getTopInventory() {
    return dashboardApi.getTopInventory();
  },

  async getRecentOrders() {
    return dashboardApi.getRecentOrders();
  },
};
