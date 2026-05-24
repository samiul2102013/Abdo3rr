export interface ProductCategory {
  id: number;
  name: string;
  subtitle: string | null;
  image: string | null;
  item_count: number;
  status: boolean;
  subcategories?: any[];
  created_at: string;
  updated_at: string;
}

export interface ProductSubcategory {
  id: number;
  category: number;
  name: string;
  icon: string | null;
  item_count: number;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: ProductCategory;
  subcategory: ProductSubcategory | null;
  price: string;
  image: string | null;
  rating: string;
  rating_count: number;
  notes_enabled: boolean;
  stock: number;
  status: boolean;
}

export interface ProductDetail extends Product {
  description: string | null;
  images: string[];
  cut_types: {
    id: number;
    cut_type: {
      id: number;
      name: string;
      status: boolean;
      created_at: string;
      updated_at: string;
    };
  }[];
  packaging_types: {
    id: number;
    packaging_type: {
      id: number;
      name: string;
      status: boolean;
      created_at: string;
      updated_at: string;
    };
  }[];
  inventory: {
    id: number;
    stock: string;
    reserved: string;
    preorder: string;
    in_transit: string;
    available_stock: number;
    updated_at: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface ProductListResponse {
  results: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CreateProductPayload {
  name: string;
  category_id: number;
  subcategory_id?: number | null;
  price: string;
  description?: string;
  initial_stock?: number;
  image?: File | null;
  notes_enabled?: boolean;
  status?: boolean;
  cut_type_ids?: number[];
  packaging_type_ids?: number[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}
