import { pickupApi } from "@/lib/pickup-api";
import { CreatePickupLocationPayload, UpdatePickupLocationPayload } from "@/types/pickup";

export const pickupService = {
  async getPickupLocations() {
    return pickupApi.getPickupLocations();
  },

  async getPickupLocationById(id: number) {
    return pickupApi.getPickupLocationById(id);
  },

  async createPickupLocation(payload: CreatePickupLocationPayload) {
    return pickupApi.createPickupLocation(payload);
  },

  async updatePickupLocation(id: number, payload: UpdatePickupLocationPayload) {
    return pickupApi.updatePickupLocation(id, payload);
  },

  async deletePickupLocation(id: number) {
    return pickupApi.deletePickupLocation(id);
  },
};
