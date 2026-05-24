import { inventoryApi } from "@/lib/inventory-api";

export const inventoryService = {
  async getInventory(page = 1) {
    return inventoryApi.getInventory(page);
  },
};
