import { bannerApi } from "@/lib/banner-api";
import { CreateBannerPayload, UpdateBannerPayload } from "@/types/banner";

export const bannerService = {
  async getBanners() {
    return bannerApi.getBanners();
  },

  async createBanner(payload: CreateBannerPayload) {
    return bannerApi.createBanner(payload);
  },

  async updateBanner(id: number, payload: UpdateBannerPayload) {
    return bannerApi.updateBanner(id, payload);
  },

  async deleteBanner(id: number) {
    return bannerApi.deleteBanner(id);
  },
};
