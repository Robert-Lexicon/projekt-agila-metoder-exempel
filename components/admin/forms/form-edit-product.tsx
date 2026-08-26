"use client";

import { useRouter } from "next/navigation";
import { editProductActionState } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/forms/product-form";
import { useFormMutation } from "@/lib/hooks/use-form-mutation";
import type { Category, Product } from "@/lib/types";


function FormEditProductInner({
	product,
	categories,
}: {
	product: Product;
	categories: Category[];
}) {
	const updateWithId = editProductActionState.bind(null, product.id);
	const [state, formAction, isPending] = useFormMutation(
		updateWithId,
		null,
		{ redirectTo: "/admin", successMessage: "Product updated!" }
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
