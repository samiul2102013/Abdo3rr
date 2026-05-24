export interface CutType {
  id: number;
  name: string;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCutTypePayload {
  name: string;
  status: boolean;
}

export interface UpdateCutTypePayload {
  name: string;
}
