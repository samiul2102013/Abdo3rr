import { cutTypeApi } from "@/lib/cut-type-api";
import { CreateCutTypePayload, UpdateCutTypePayload } from "@/types/cut-type";

export const cutTypeService = {
  async getCutTypes() {
    return cutTypeApi.getCutTypes();
  },

  async getCutTypeById(id: number) {
    return cutTypeApi.getCutTypeById(id);
  },

  async createCutType(payload: CreateCutTypePayload) {
    return cutTypeApi.createCutType(payload);
  },

  async updateCutType(id: number, payload: UpdateCutTypePayload) {
    return cutTypeApi.updateCutType(id, payload);
  },

  async toggleCutTypeStatus(id: number) {
    return cutTypeApi.toggleCutTypeStatus(id);
  },

  async deleteCutType(id: number) {
    return cutTypeApi.deleteCutType(id);
  },
};
