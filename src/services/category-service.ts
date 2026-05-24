import { categoryApi } from "@/lib/category-api";
import { CreateCategoryPayload, UpdateCategoryPayload } from "@/types/category";

export const categoryService = {
  async getCategories() {
    return categoryApi.getCategories();
  },

  async getCategoryById(id: number) {
    return categoryApi.getCategoryById(id);
  },

  async createCategory(payload: CreateCategoryPayload) {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("status", String(payload.status));
    if (payload.subtitle !== undefined) formData.append("subtitle", payload.subtitle);
    if (payload.image) formData.append("image", payload.image);

    return categoryApi.createCategory(formData);
  },

  async updateCategory(id: number, payload: UpdateCategoryPayload) {
    const formData = new FormData();
    if (payload.name !== undefined) formData.append("name", payload.name);
    if (payload.status !== undefined) formData.append("status", String(payload.status));
    if (payload.subtitle !== undefined) formData.append("subtitle", payload.subtitle);
    if (payload.image) formData.append("image", payload.image);

    return categoryApi.updateCategory(id, formData);
  },

  async toggleCategoryStatus(id: number) {
    return categoryApi.toggleCategoryStatus(id);
  },

  async deleteCategory(id: number) {
    return categoryApi.deleteCategory(id);
  },
};
