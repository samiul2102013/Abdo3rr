import { subcategoryApi } from "@/lib/subcategory-api";
import { CreateSubcategoryPayload, UpdateSubcategoryPayload } from "@/types/category";

export const subcategoryService = {
  async getSubcategories() {
    return subcategoryApi.getSubcategories();
  },

  async getSubcategoryById(id: number) {
    return subcategoryApi.getSubcategoryById(id);
  },

  async createSubcategory(payload: CreateSubcategoryPayload) {
    const formData = new FormData();
    formData.append("category", String(payload.category));
    formData.append("name", payload.name);
    formData.append("status", String(payload.status));
    if (payload.icon) formData.append("icon", payload.icon);

    return subcategoryApi.createSubcategory(formData);
  },

  async updateSubcategory(id: number, payload: UpdateSubcategoryPayload) {
    const formData = new FormData();
    if (payload.category !== undefined) formData.append("category", String(payload.category));
    if (payload.name !== undefined) formData.append("name", payload.name);
    if (payload.status !== undefined) formData.append("status", String(payload.status));
    if (payload.icon) formData.append("icon", payload.icon);

    return subcategoryApi.updateSubcategory(id, formData);
  },

  async toggleSubcategoryStatus(id: number) {
    return subcategoryApi.toggleSubcategoryStatus(id);
  },

  async deleteSubcategory(id: number) {
    return subcategoryApi.deleteSubcategory(id);
  },
};
