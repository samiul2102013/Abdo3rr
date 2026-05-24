import { apiClient, ApiResponse } from "@/lib/api-client";
import {
  OrderListResponse,
  OrderDetail,
  UpdateOrderStatusPayload,
} from "@/types/order";

export const orderApi = {
  getOrders(page = 1): Promise<ApiResponse<OrderListResponse>> {
    return apiClient.get<ApiResponse<OrderListResponse>>(`/api/orders/admin/orders/?page=${page}`);
  },

  getOrderById(id: number): Promise<ApiResponse<OrderDetail>> {
    return apiClient.get<ApiResponse<OrderDetail>>(`/api/orders/admin/orders/${id}/`);
  },

  updateOrderStatus(id: number, payload: UpdateOrderStatusPayload): Promise<ApiResponse<OrderDetail>> {
    return apiClient.patch<ApiResponse<OrderDetail>>(`/api/orders/admin/orders/${id}/update-status/`, payload);
  },
};
