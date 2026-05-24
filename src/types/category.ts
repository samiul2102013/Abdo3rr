export interface Subcategory {
  id: number;
  category: number;
  name: string;
  icon: string | null;
  item_count: number;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  subtitle: string | null;
  image: string | null;
  item_count: number;
  status: boolean;
  subcategories: Subcategory[];
  created_at: string;
  updated_at: string;
}

export interface CreateSubcategoryPayload {
  category: number;
  name: string;
  status: boolean;
  icon?: File | null;
}

export interface UpdateSubcategoryPayload {
  category?: number;
  name?: string;
  status?: boolean;
  icon?: File | null;
}

export interface CreateCategoryPayload {
  name: string;
  subtitle?: string;
  status: boolean;
  image?: File | null;
}

export interface UpdateCategoryPayload {
  name?: string;
  subtitle?: string;
  status?: boolean;
  image?: File | null;
}
