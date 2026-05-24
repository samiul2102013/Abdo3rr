import { apiClient, ApiResponse } from "@/lib/api-client";
import { Banner, CreateBannerPayload, UpdateBannerPayload } from "@/types/banner";

export const bannerApi = {
  getBanners(): Promise<ApiResponse<Banner[]>> {
    return apiClient.get<ApiResponse<Banner[]>>("/api/banners/admin/list/");
  },

  createBanner(payload: CreateBannerPayload): Promise<ApiResponse<Banner>> {
    const form = new FormData();
    form.append("image", payload.image);
    if (payload.headline) form.append("headline", payload.headline);
    if (payload.tagline) form.append("tagline", payload.tagline);
    form.append("is_active", payload.is_active !== false ? "true" : "false");
    return apiClient.post<ApiResponse<Banner>>("/api/banners/admin/create/", form);
  },

  updateBanner(id: number, payload: UpdateBannerPayload): Promise<ApiResponse<Banner>> {
    const form = new FormData();
    if (payload.headline !== undefined) form.append("headline", payload.headline);
    if (payload.tagline !== undefined) form.append("tagline", payload.tagline);
    return apiClient.patch<ApiResponse<Banner>>(`/api/banners/admin/${id}/update/`, form);
  },

  deleteBanner(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/api/banners/admin/${id}/delete/`);
  },
};
