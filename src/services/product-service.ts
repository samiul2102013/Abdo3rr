import { productApi } from "@/lib/product-api";
import { CreateProductPayload, UpdateProductPayload } from "@/types/product";

export const productService = {
  async getProducts(page = 1) {
    return productApi.getProducts(page);
  },

  async getProductById(id: number) {
    return productApi.getProductById(id);
  },

  async createProduct(payload: CreateProductPayload) {
    return productApi.createProduct(payload);
  },

  async updateProduct(id: number, payload: UpdateProductPayload) {
    return productApi.updateProduct(id, payload);
  },

  async toggleStatus(id: number) {
    return productApi.toggleStatus(id);
  },

  async deleteProduct(id: number) {
    return productApi.deleteProduct(id);
  },
};
