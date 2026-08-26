"use server";

import { revalidatePath, updateTag } from "next/cache";
import z from "zod";
import { createProduct, deleteProduct, updateProduct } from "@/lib/api";
import { ProductSchema } from "@/lib/schemas";
import type {
	ActionState,
	Product,
	ProductInputData,
	ProductOutputData,
} from "@/lib/types";

function revalidateProducts() {
	revalidatePath("/");
	updateTag("products-list");
}

async function handleProductMutation(
	formData: FormData,
	mutationFn: (
		data: ProductOutputData & { images: string[] },
	) => Promise<Product>,
	successMessage: string,
): Promise<ActionState<ProductInputData>> {
	const rawData = Object.fromEntries(formData);
	const validatedFields = ProductSchema.safeParse(rawData);

	if (!validatedFields.success) {
		const flattened = z.flattenError(validatedFields.error);

		return {
			status: "error",
			message: "Please fix the errors below.",
			errors: flattened.fieldErrors,
			data: rawData as unknown as ProductInputData, // raw form input preserved for the UI
		};
	}

	const payload = {
		...validatedFields.data,
		images: [],
	};

	try {
		await mutationFn(payload);
		revalidateProducts();
		return {
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		console.error("Product mutation failed:", error);
		return {
			status: "error",
			message: "Something went wrong. Please try again.",
			data: rawData as unknown as ProductInputData,
		};
	}
}

export async function createProductActionState(
	_prevState: ActionState<ProductInputData>,
	formData: FormData,
): Promise<ActionState<ProductInputData>> {
	return handleProductMutation(
		formData,
		(data) => createProduct(data),
		"Product created successfully.",
	);
}

export async function editProductActionState(
	id: number,
	_prevState: ActionState<ProductInputData>,
	formData: FormData,
): Promise<ActionState<ProductInputData>> {
	return handleProductMutation(
		formData,
		(data) => updateProduct(id, data),
		"Product updated successfully.",
	);
}

export async function deleteProductFromClientAction(
	id: number,
): Promise<boolean> {
	try {
		const success = await deleteProduct(id);
		revalidateProducts();
		return Boolean(success);
	} catch (error) {
		console.error("Error deleting product from client:", error);
		return false;
	}
}
