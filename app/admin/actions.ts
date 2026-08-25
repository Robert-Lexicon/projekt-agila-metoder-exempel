"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import { createProduct, deleteProduct, updateProduct } from "@/lib/api";
import { Product } from "@/lib/types";

// ---- CREATE functions ----

// Basic create without error handling or states
export async function createProductAction(formData: FormData) {
	// We manually get the fields from the form data and cast to strings
	const title = formData.get("title") as string;
	const price = formData.get("price") as string;
	const description = formData.get("description") as string;
	const thumbnail = formData.get("thumbnail") as string;
	const categoryId = formData.get("categoryId") as string;
	const stock = formData.get("stock") as string;
	const brand = formData.get("brand") as string;

	const now = new Date().toISOString();

	// Create a new object with the right conversions to pass to the fetch/API
	const newProduct = {
		title,
		brand,
		description,
		thumbnail,
		price: parseInt(price, 10),
		stock: parseInt(stock, 10),
		categoryId: parseInt(categoryId, 10),
		meta: {
			createdAt: now,
			updatedAt: now,
		},
		images: [],
	};

	//Try/catch
	try {
		await createProduct(newProduct);
		revalidatePath("/");
		updateTag("products-list"); // Purges cached status box results immediately
	} catch {
		console.error("...");
		// 	return {
		//   message: "Something went wrong, check your data and try again",
		//   data: newProduct,
		// };
	}

	redirect("/admin/?status=success");
}

// ----------------------------------------------

// This should probably belong in another file (to make this one cleaner)
// export type ActionState = {
// 	message: string;
// 	data: unknown;
// 	errors?: Record<string, string[]>;
// } | null;

export type ActionState<TData = ProductInputData> = {
	status?: string;
	message?: string;
	data?: TData;
	errors?: Partial<Record<keyof TData, string[]>>;
} | null;

// Our zod schema which both convert and validate our data
// This is usually in another file called schemas or similar
const ProductSchema = z.object({
	title: z.string().min(3).max(64),
	brand: z.string().min(1).max(64),
	description: z.string().min(1).max(256),
	thumbnail: z
		.string()
		.transform((val) => encodeURI(val.trim()))
		.pipe(z.url()),
	price: z.coerce.number().min(0.01).max(10000),
	categoryId: z.coerce.number().int().positive("Category is required"),
	stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
});

//export type Product = z.infer<typeof ProductSchema>;
export type ProductFlattenedErrors = Record<string, string | string[]>;
//z.ZodFlattenedError<Product>["fieldErrors"];

export type ProductInputData = z.input<typeof ProductSchema>;
//export type ProductInputData = Record<keyof ProductOutputData, string>;
export type ProductOutputData = z.output<typeof ProductSchema>;

// Complex example with actionState and zod validation
export async function createProductZodActionState(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	// We create an object with all our form data
	const rawData = Object.fromEntries(formData) as unknown as ProductInputData;
	// We use zods safeParse on our schema to convert and validate
	const validatedFields = ProductSchema.safeParse(rawData);

	// If there are validation errors we flatten the validated errors and send them back with our state
	if (!validatedFields.success) {
		const flattened = z.flattenError(validatedFields.error);

		return {
			message: "Please fix the errors below.",
			errors: flattened.fieldErrors,
			data: rawData, // preserves user inputs on failure
		};
	}

	const newProduct = {
		...validatedFields.data,
		images: [],
	};

	try {
		await createProduct(newProduct);
		revalidatePath("/");
		// return {
		// 	status: "success",
		// 	message: "Product updated successfully.",
		// };
	} catch {
		return {
			status: "error",
			message: "Something went wrong, check your data and try again",
			data: rawData,
		};
	}

	redirect("/admin/?status=success");
}

// ----------------------------------------------

// ---- UPDATE functions ----

// Simple/basic action for updating a product, without error handling or state
export async function editProductAction(id: number, formData: FormData) {
	// We manually get the fields from the form data and cast to strings
	const title = formData.get("title") as string;
	const price = formData.get("price") as string;
	const description = formData.get("description") as string;
	const thumbnail = formData.get("thumbnail") as string;
	const categoryId = formData.get("categoryId") as string;
	const stock = formData.get("stock") as string;
	const brand = formData.get("brand") as string;

	const now = new Date().toISOString();

	// Create a new object with the right conversions to pass to the fetch/API
	const newProduct = {
		title,
		brand,
		description,
		thumbnail,
		price: parseInt(price, 10),
		stock: parseInt(stock, 10),
		categoryId: parseInt(categoryId, 10),
		meta: {
			createdAt: now, //TODO: Remove this
			updatedAt: now,
		},
		images: [],
	};

	//Try/catch
	try {
		await updateProduct(id, newProduct);
		revalidatePath("/");
		updateTag("products-list"); // Purges cached status box results immediately
	} catch {
		console.error("...");
		// We can't return anything if we don't use client actions or useActionState
		// 	return {
		//   message: "Something went wrong, check your data and try again",
		//   data: newProduct,
		// };
	}

	redirect("/admin/?status=success");
}

// ----------------------------------------------

export type FormState = {
	error?: string;
	errors?: Record<string, string | string[]>; //ProductFlattenedErrors;
	formData?: FormData;
};

// Update action with actionState
export async function editProductActionState(
	id: number,
	_prevState: ActionState,
	formData: FormData,
) {
	const rawData = Object.fromEntries(formData.entries());
	const validatedFields = ProductSchema.safeParse(rawData);

	if (!validatedFields.success) {
		const flattened = z.flattenError(validatedFields.error);
		return {
			errors: flattened.fieldErrors,
			error: "Please correct the incorrect fields",
			formData,
		};
	}

	const now = new Date().toISOString();

	const newProduct = {
		...validatedFields.data,
		meta: {
			createdAt: now,
			updatedAt: now,
		},
		images: [],
	};

	//Try/catch
	try {
		await updateProduct(id, newProduct);
		revalidatePath("/");
		updateTag("products-list"); // Purges cached status box results immediately
	} catch {
		console.error("...");
		return {
			error: "Unknow server error has occured",
			formData,
		};
	}

	redirect("/admin/?status=success");
}

// ---- DELETE functions ----
export async function deleteProductAction(formData: FormData) {
	const id = formData.get("id") as string;
	try {
		await deleteProduct(id); //fetch localhost.../products/id, method: DELETE
		revalidatePath("/");
	} catch (error) {
		console.error(error);
	}
}

export async function deleteProductActionBind(id: number) {
	try {
		await deleteProduct(id); //fetch localhost.../products/id, method: DELETE
		revalidatePath("/");
	} catch (error) {
		console.error(error);
	}
}

export async function deleteProductFromClientAction(id: number) {
	try {
		const success = await deleteProduct(id);
		revalidatePath("/");
		return success;
	} catch (error) {
		console.error("Error deleting product from client:", error);
		return false;
	}
}
