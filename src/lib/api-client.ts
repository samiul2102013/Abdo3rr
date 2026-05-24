const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://72.62.248.97:85";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  status_code?: number;
  timestamp?: string;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Inject token client-side
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_refresh_token");
        localStorage.removeItem("admin_user");
        if (window.location.pathname !== "/signin") {
          window.location.href = "/signin";
        }
      }
      throw new ApiError("Session expired. Please sign in again.", 401);
    }

    let responseData: any;

    if (response.status === 204) {
      return { success: true, message: "Deleted successfully" } as unknown as T;
    }

    const text = await response.text();
    if (!text) {
      responseData = { success: response.ok };
    } else {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          responseData = JSON.parse(text);
        } catch (e) {
          responseData = { success: response.ok, message: text };
        }
      } else {
        responseData = text;
      }
    }

    if (!response.ok) {
      const errorMessage = responseData?.message || responseData?.detail || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, responseData);
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : "An unexpected error occurred", 500);
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<RequestInit, "method">) =>
    request<T>(endpoint, { ...options, method: "GET" }),
    
  post: <T>(endpoint: string, body?: any, options?: Omit<RequestInit, "method" | "body">) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    
  put: <T>(endpoint: string, body?: any, options?: Omit<RequestInit, "method" | "body">) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    
  patch: <T>(endpoint: string, body?: any, options?: Omit<RequestInit, "method" | "body">) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    
  delete: <T>(endpoint: string, options?: Omit<RequestInit, "method">) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
