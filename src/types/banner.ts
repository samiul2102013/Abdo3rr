export interface Banner {
  id: number;
  headline: string | null;
  tagline: string | null;
  call_to_action: string | null;
  image: string | null;
  is_active: boolean;
  order: number;
  created_at: string;
}

export interface CreateBannerPayload {
  image: File;
  headline?: string;
  tagline?: string;
  is_active?: boolean;
}

export interface UpdateBannerPayload {
  headline?: string;
  tagline?: string;
}
