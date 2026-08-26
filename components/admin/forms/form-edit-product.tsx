"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import toast from "react-hot-toast";
import { editProductActionState } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/forms/product-form";
import type { ActionState, Category, Product, ProductInputData } from "@/lib/types";

const initialState: ActionState<ProductInputData> = {};

function FormEditProductInner({
	product,
	categories,
}: {
	product: Product;
	categories: Category[];
}) {
	const router = useRouter();

	const clientAction = async (prevState: ActionState<ProductInputData>, formData: FormData) => {
		const result = await editProductActionState(product.id, prevState, formData);

		if (result?.errors || result?.status === "error") {
			toast.error(result.message || "Please correct the errors.");
		} else {
			toast.success(result?.message || "Product updated!");
			router.push("/admin");
		}

		return result;
	};

	const [state, formAction, isPending] = useActionState(
		clientAction,
		initialState,
	);

	return (
		<ProductForm
			action={formAction}
			state={state}
			isPending={isPending}
			categories={categories}
			product={product}
		/>
	);
}

export function FormEditProduct({
	product,
	categories,
}: {
	product: Product;
	categories: Category[];
}) {
	const { bfcacheId } = useRouter();
	return (
		<FormEditProductInner
			key={bfcacheId}
			product={product}
			categories={categories}
		/>
	);
}
