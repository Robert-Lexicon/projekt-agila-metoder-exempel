"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	createProductActionState,
	editProductActionState,
} from "@/app/admin/actions";
import {
	FormInput,
	FormSelect,
	FormTextarea,
} from "@/components/admin/forms/form-field";
import { useFormMutation } from "@/components/admin/hooks/use-form-mutation";
import type { Category, Product, ProductInputData } from "@/lib/types";

// ── Form field configuration ─────────────────────────────────────────

const FORM_FIELDS = [
	{ name: "title", label: "Title", required: true },
	{ name: "brand", label: "Brand", required: true },
	{
		name: "price",
		label: "Price",
		type: "number",
		min: "0.5",
		step: "0.01",
		required: true,
	},
	{
		name: "discountPercentage",
		label: "Discount %",
		type: "number",
		min: 0,
		max: 100,
	},
	{ name: "stock", label: "Stock", type: "number", required: true },
	{
		component: "select",
		name: "categoryId",
		label: "Category",
		type: "number",
		required: true,
	},
	{
		component: "textarea",
		name: "description",
		label: "Description",
		minLength: 5,
		maxLength: 256,
		required: true,
	},
	{ name: "thumbnail", label: "Thumbnail", type: "url", required: true },
];

// ── Props (discriminated union) ──────────────────────────────────────

type ProductFormProps =
	| { mode: "create"; categories: Category[]; product?: never }
	| { mode: "edit"; categories: Category[]; product: Product };

// ── Component ────────────────────────────────────────────────────────

function ProductFormInner({ mode, categories, product }: ProductFormProps) {
	const action =
		mode === "edit"
			? editProductActionState.bind(null, product.id)
			: createProductActionState;

	const successMessage =
		mode === "edit" ? "Product updated!" : "Product created!";

	const [state, formAction, isPending] = useFormMutation(action, null, {
		redirectTo: "/admin",
		successMessage,
	});

	const data = state?.data ?? product;

	return (
		<form action={formAction} className="grid gap-4">
			{/* Container always exists in the DOM, screen readers are primed to watch it */}
			<div
				role="alert"
				className="block text-red-500 font-bold text-center min-h-6"
			>
				{state?.message || ""}
			</div>

			<div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center [&>input,&>textarea]:border [&>input,&>textarea]:bg-white [&>input,&>textarea]:p-2">
				{FORM_FIELDS.map((field) => {
					const { component, name, ...rest } = field;

					const dynamicProps = {
						id: name,
						name,
						defaultValue: data?.[name as keyof ProductInputData],
						"aria-invalid": Boolean(
							state?.errors?.[name as keyof typeof state.errors],
						),
						"aria-describedby": state?.errors?.[
							name as keyof typeof state.errors
						]
							? `${name}-error`
							: undefined,
						error: state?.errors?.[name as keyof typeof state.errors],
						...rest,
					};

					if (component === "textarea") {
						return <FormTextarea key={name} {...dynamicProps} />;
					}

					if (component === "select") {
						return (
							<FormSelect key={name} {...dynamicProps}>
								<option value="">Select a category</option>
								{categories.map((c) => (
									<option key={c.id} value={c.id}>
										{c.name}
									</option>
								))}
							</FormSelect>
						);
					}

					return <FormInput key={name} {...dynamicProps} />;
				})}
			</div>

			<div className="flex justify-end gap-2">
				<Link
					href={"/admin"}
					className="border rounded-lg py-2 px-4 bg-neutral-50 border-neutral-200 hover:bg-neutral-100 transition-colors"
				>
					Cancel
				</Link>
				<button
					className="border rounded-lg py-2 px-4 bg-neutral-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
					type="submit"
					disabled={isPending}
				>
					{isPending ? "Saving..." : "Save"}
				</button>
			</div>
		</form>
	);
}

export function ProductForm(props: ProductFormProps) {
	const { bfcacheId } = useRouter();
	return <ProductFormInner key={bfcacheId} {...props} />;
}
