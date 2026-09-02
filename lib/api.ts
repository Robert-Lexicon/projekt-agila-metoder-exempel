import "server-only";

import type {
	Category,
	Product,
	ProductOutputData,
	ProductStats,
	ProductsResponse,
} from "./types";

const API_URL = process.env.API_URL || "http://localhost:4000";

/**
 * Fetch utility with standard JSON headers and error handling.
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 */
async function fetchApi<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<T> {
	const url = `${API_URL}${endpoint}`;

	// Simulated network latency for testing Suspense / transitions
	// await new Promise((resolve) => setTimeout(resolve, 2000));
	const headers: Record<string, string> = {
		...(options?.body ? { "Content-Type": "application/json" } : {}),
		...(options?.headers as Record<string, string>),
	};

	const res = await fetch(url, {
		...options,
		headers,
	});

	if (!res.ok) {
		const errorText = await res.text().catch(() => "Unknown error");
		throw new Error(`API Error ${res.status}: ${errorText} at ${url}`);
	}

	// Handle empty responses (e.g. 204 No Content for DELETE)
	if (res.status === 204 || res.headers.get("content-length") === "0") {
		return {} as T;
	}

	return res.json();
}

// ── Product API ──────────────────────────────────────────────────────────

export interface GetProductsOptions {
	limit?: number | string;
	page?: number | string;
	sort?: string;
	order?: "asc" | "desc";
	expand?: string;
	[key: string]: string | number | boolean | undefined; // Allows categoryId, stock, q, etc.
}

export async function getProducts(
	options: GetProductsOptions = {},
): Promise<ProductsResponse> {
	const params = new URLSearchParams();

	Object.entries(options).forEach(([key, value]) => {
		if (value !== undefined && value !== "") {
			// Map standard query keys to JSON Server convention (_limit, _page, etc.)
			const paramKey = ["limit", "page", "sort", "order", "expand"].includes(
				key,
			)
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

export async function getProductStats(): Promise<ProductStats> {
	return fetchApi<ProductStats>("/products/stats");
}

export async function createProduct(
	product: ProductOutputData,
): Promise<Product> {
	return fetchApi<Product>("/products", {
		method: "POST",
		body: JSON.stringify(product),
	});
}

export async function updateProduct(
	id: string | number,
	product: ProductOutputData,
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

// ── Category API ─────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
	return fetchApi<Category[]>("/categories");
}
