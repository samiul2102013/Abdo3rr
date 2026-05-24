export interface PackagingType {
  id: number;
  name: string;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePackagingTypePayload {
  name: string;
  status: boolean;
}

export interface UpdatePackagingTypePayload {
  name: string;
}
