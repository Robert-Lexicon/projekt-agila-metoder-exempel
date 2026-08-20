import { API_URL } from "./config";
import type {
  Category,
  Product,
  ProductsResponse,
} from "./types";

/**
 * Utility for standard fetch with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    ...(options?.body ? { "Content-Type": "application/json" } : {}),
    ...(options?.headers as Record<string, string>),
  };

  const res = await fetch(url, {
    ...options,
    headers
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`API Error ${res.status}: ${errorText} at ${url}`);
  }

  // Some DELETE responses might be empty
if (res.status === 204 || res.headers.get("content-length") === "0") {
    return {} as T;
  }

  return res.json();
}

// --- PRODUCT API ---
export interface GetProductsOptions {
  limit?: number | string;
  page?: number | string;
  sort?: string;
  order?: "asc" | "desc";
  expand?: string;
  [key: string]: string | number | boolean | undefined; // Allows categoryId, stock, q, etc.
}

export async function getProducts(
  options: GetProductsOptions = {}
): Promise<ProductsResponse> {
  const params = new URLSearchParams();
//   if (options.limit) params.append("_limit", options.limit.toString());
//   if (options.page) params.append("_page", options.page.toString());
//   if (options.sort) params.append("_sort", options.sort);
//   if (options.order) params.append("_order", options.order);
//   if (options.expand) params.append("_expand", options.expand);

  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      // Map standard keys to JSON-Server / API convention if needed (since they are prefixed with _)
      const paramKey = ["limit", "page", "sort", "order", "expand"].includes(key)
        ? `_${key}`
        : key;
      params.append(paramKey, String(value));
    }
  });

  const query = params.toString();
  return fetchApi<ProductsResponse>(`/products${query ? `?${query}` : ""}`);
}

export async function getProduct(
  id: string | number,
  options: { expand?: string } = {},
): Promise<Product> {
  const query = options.expand ? `?_expand=${options.expand}` : "";
  return fetchApi<Product>(`/products/${id}${query}`);
}

export async function createProduct(
  product: Partial<Product>,
): Promise<Product> {
  return fetchApi<Product>("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export async function updateProduct(
  id: string | number,
  product: Partial<Product>,
): Promise<Product> {
  return fetchApi<Product>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id: string | number): Promise<boolean> {
  await fetchApi<void>(`/products/${id}`, {
    method: "DELETE",
  });
  return true;
}

// --- CATEGORY API ---

export async function getCategories(): Promise<Category[]> {
  return fetchApi<Category[]>("/categories");
}