import { packagingApi } from "@/lib/packaging-api";
import { CreatePackagingTypePayload, UpdatePackagingTypePayload } from "@/types/packaging";

export const packagingService = {
  async getPackagingTypes() {
    return packagingApi.getPackagingTypes();
  },

  async createPackagingType(payload: CreatePackagingTypePayload) {
    return packagingApi.createPackagingType(payload);
  },

  async updatePackagingType(id: number, payload: UpdatePackagingTypePayload) {
    return packagingApi.updatePackagingType(id, payload);
  },

  async togglePackagingStatus(id: number) {
    return packagingApi.togglePackagingStatus(id);
  },

  async deletePackagingType(id: number) {
    return packagingApi.deletePackagingType(id);
  },
};
