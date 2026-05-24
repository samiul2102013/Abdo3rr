import { OrderListItem } from "@/types/order";

export interface DashboardStats {
  total_customers: number;
  today_orders: number;
  total_revenue: number;
  total_orders: number;
}

export interface SalesDataPoint {
  label: string;
  revenue: number;
}

export interface TopInventoryItem {
  product_id: number;
  product_name: string;
  product_image: string | null;
  stock: number;
}

export type RecentOrder = OrderListItem;
