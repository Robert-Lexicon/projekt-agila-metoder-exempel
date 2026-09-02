import type z from "zod";
import type { ProductSchema } from "./schemas";

export interface Category {
	id: number;
	name: string;
	slug: string;
	image: string;
}

export interface Product {
	id: number;
	title: string;
	description: string;
	categoryId: number;
	category?: Category;
	price: number;
	discountPercentage?: number;
	rating?: number;
	stock?: number;
	tags?: string[];
	brand?: string;
	sku?: string;
	weight?: number;
	dimensions?: {
		width: number;
		height: number;
		depth: number;
	};
	warrantyInformation?: string;
	shippingInformation?: string;
	availabilityStatus?: string;
	reviews?: {
		rating: number;
		comment: string;
		date: string;
		reviewerName: string;
		reviewerEmail: string;
	}[];
	returnPolicy?: string;
	minimumOrderQuantity?: number;
	meta: {
		createdAt: string;
		updatedAt: string;
		barcode?: string;
		qrCode?: string;
	};
	images: string[];
	thumbnail: string;
}

// Example without Zod to pick specific properties from the Product interface:
//
// export type ProductFormData = Pick<
// 	Product,
// 	| "title"
// 	| "brand"
// 	| "price"
// 	| "description"
// 	| "thumbnail"
// 	| "categoryId"
// 	| "stock"
// >;

export type ProductInputData = z.input<typeof ProductSchema>;
export type ProductOutputData = z.output<typeof ProductSchema>;
export type ProductFlattenedErrors = Record<string, string | string[]>;

export interface ProductsResponse {
	products: Product[];
	total: number;
	limit: number;
	page: number;
	pages: number;
}

export interface ProductStats {
	total: number;
	inStock: number;
	lowStock: number;
	outOfStock: number;
}

export type ActionState<TData> = {
	status?: string;
	message?: string;
	data?: TData;
	errors?: Partial<Record<keyof TData, string[]>>;
} | null;
