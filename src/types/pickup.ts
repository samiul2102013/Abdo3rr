export interface PickupLocation {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  is_active: boolean;
}

export interface CreatePickupLocationPayload {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
}

export interface UpdatePickupLocationPayload {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  is_active?: boolean;
}
