export interface InventoryItem {
  id: number;
  product_name: string;
  product_image: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  reserved: string;
  preorder: string;
  in_transit: string;
  available_stock: number;
  updated_at: string;
}

export interface InventoryPaginatedData {
  results: InventoryItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
