"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import {
	createProductZodActionState,
} from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/forms/product-form";
import type { ActionState, Category, ProductInputData } from "@/lib/types";

const initialState: ActionState<ProductInputData> = null;

function CreateFormProductInner({
	categories,
}: {
	categories: Category[];
}) {
	const [state, formAction, pending] = useActionState(
		createProductZodActionState,
		initialState,
	);

	return (
		<ProductForm
			action={formAction}
			state={state}
			isPending={pending}
			categories={categories}
		/>
	);
}

export function CreateFormProduct({
	categories,
}: {
	categories: Category[];
}) {
	const { bfcacheId } = useRouter();
	return <CreateFormProductInner key={bfcacheId} categories={categories} />;
}
