export type OrderStatus =
  | "order_confirmed"
  | "processing"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "card" | "cash" | "tabby" | string;
export type ReceiveMethod = "home_delivery" | "pickup" | string;
export type DeliveryType  = "today" | "scheduled" | string;

export interface OrderListItem {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  total: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  created_at: string;
}

export interface OrderDeliveryAddress {
  id: number;
  title: string;
  full_address: string;
  city: string;
  area: string;
  latitude: number | null;
  longitude: number | null;
  delivery_zone: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  product_image: string | null;
  cut_type_name: string;
  packaging_type_name: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface OrderTracking {
  id: number;
  status: OrderStatus;
  note: string;
  timestamp: string;
}

export interface OrderDetail {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  receive_method: ReceiveMethod;
  delivery_type: DeliveryType;
  scheduled_at: string | null;
  delivery_address: OrderDeliveryAddress | null;
  items: OrderItem[];
  subtotal: string;
  delivery_fee: string;
  total: string;
  tracking: OrderTracking[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderListResponse {
  results: OrderListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}
