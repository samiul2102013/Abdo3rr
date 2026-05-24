import { orderApi } from "@/lib/order-api";
import { UpdateOrderStatusPayload } from "@/types/order";

export const orderService = {
  async getOrders(page = 1) {
    return orderApi.getOrders(page);
  },

  async getOrderById(id: number) {
    return orderApi.getOrderById(id);
  },

  async updateOrderStatus(id: number, payload: UpdateOrderStatusPayload) {
    return orderApi.updateOrderStatus(id, payload);
  },
};
