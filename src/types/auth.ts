export interface User {
  id?: number;
  email: string;
  name?: string | null;
  phone?: string | null;
  profile_picture?: string | null;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface ProfileUpdatePayload {
  name?: string | null;
  phone?: string | null;
  profile_picture?: File | null;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
