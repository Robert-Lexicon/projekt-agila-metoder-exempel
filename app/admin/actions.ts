"use server";

import { revalidatePath, updateTag } from "next/cache";
import z from "zod";
import { createProduct, deleteProduct, updateProduct } from "@/lib/api";
import { ProductSchema } from "@/lib/schemas";
import type { ActionState, ProductInputData } from "@/lib/types";

//TODO: Simplify into one action for both alt error handling centralized?

export async function createProductZodActionState(
	_prevState: ActionState<ProductInputData>,
	formData: FormData,
): Promise<ActionState<ProductInputData>> {
	// We create an object with all our form data
	const rawData = Object.fromEntries(formData);
	// We use zods safeParse on our schema to convert and validate
	const validatedFields = ProductSchema.safeParse(rawData);

	// If there are validation errors we flatten the validated errors and send them back with our state
	if (!validatedFields.success) {
		const flattened = z.flattenError(validatedFields.error);

		return {
			status: "error",
			message: "Please fix the errors below.",
			errors: flattened.fieldErrors,
			data: rawData as unknown as ProductInputData, // preserves user inputs on failure
		};
	}

	const newProduct = {
		...validatedFields.data,
		images: [],
	};

	try {
		await createProduct(newProduct);
		revalidatePath("/");
		return {
			status: "success",
			message: "Product created successfully.",
		};
	} catch (error) {
		console.error("Failed to update product:", error);
		return {
			status: "error",
			message: "Something went wrong, check your data and try again",
			data: rawData as unknown as ProductInputData,
		};
	}
	// moved into client action instead
	//redirect("/admin/?status=success");
}

// Update action with actionState
export async function editProductActionState(
	id: number,
	_prevState: ActionState<ProductInputData>,
	formData: FormData,
): Promise<ActionState<ProductInputData>> {
	const rawData = Object.fromEntries(formData.entries());
	const validatedFields = ProductSchema.safeParse(rawData);

	if (!validatedFields.success) {
		const flattened = z.flattenError(validatedFields.error);
		return {
			status: "error",
			errors: flattened.fieldErrors,
			message: "Please fix the errors in the form.",
			data: rawData as unknown as ProductInputData, // preserves user inputs on failure
		};
	}

	const newProduct = {
		...validatedFields.data,
		images: [],
	};

	try {
		await updateProduct(id, newProduct);
		revalidatePath("/");
		updateTag("products-list"); // Purges cached status box results immediately
		return {
			status: "success",
			message: "Product updated successfully.",
		};
	} catch (error) {
		console.error("Failed to update product:", error);
		return {
			status: "error",
			message: "An unknown server error has occurred.",
			data: rawData as unknown as ProductInputData,
		};
	}
}

// ---- DELETE functions ----
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
