import { apiClient, ApiResponse } from "@/lib/api-client";
import {
  Product,
  ProductDetail,
  ProductListResponse,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/types/product";

export const productApi = {
  getProducts(page = 1): Promise<ApiResponse<ProductListResponse>> {
    return apiClient.get<ApiResponse<ProductListResponse>>(`/api/products/admin/products/?page=${page}`);
  },

  getProductById(id: number): Promise<ApiResponse<ProductDetail>> {
    return apiClient.get<ApiResponse<ProductDetail>>(`/api/products/admin/products/${id}/`);
  },

  createProduct(payload: CreateProductPayload): Promise<ApiResponse<ProductDetail>> {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return apiClient.post<ApiResponse<ProductDetail>>("/api/products/admin/products/create/", formData);
  },

  updateProduct(id: number, payload: UpdateProductPayload): Promise<ApiResponse<ProductDetail>> {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return apiClient.patch<ApiResponse<ProductDetail>>(`/api/products/admin/products/${id}/update/`, formData);
  },

  toggleStatus(id: number): Promise<ApiResponse<ProductDetail>> {
    return apiClient.patch<ApiResponse<ProductDetail>>(`/api/products/admin/products/${id}/toggle-status/`);
  },

  deleteProduct(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/api/products/admin/products/${id}/delete/`);
  },
};
