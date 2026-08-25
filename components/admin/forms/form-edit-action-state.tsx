"use client";
import Link from "next/link";
import { useActionState } from "react";
import { editProductActionState, type FormState } from "@/app/admin/actions";
import {
	FormInput,
	FormSelect,
	FormTextarea,
} from "@/components/admin/forms/form-field";
import type { Category, Product } from "@/lib/types";

const style = {
	input: "border p-2 bg-white border-neutral-300 rounded-md",
	label: "font-semibold",
};

const initialState: FormState = {};

export function FormEditProductZod({
	product,
	categories,
}: {
	product: Product;
	categories: Category[];
}) {
	const updateWithId = editProductActionState.bind(null, product.id);
	const [state, formAction, isPending] = useActionState(
		updateWithId,
		initialState,
	);

	const getDefault = (name: keyof Product) => {
		if (state.errors && state.formData) {
			const val = state.formData.get(name);
			if (val !== null) return String(val);
		}
		const val = product[name];

		return typeof val === "string" || typeof val === "number" ? val : "";
	};

	return (
		<form
			action={formAction}
			key={product.meta.updatedAt ?? product.id}
			className="grid gap-4"
		>
			{state.error && (
				<div
					role="alert"
					className="rounded bg-red-50 p-3 text-sm text-red-800"
				>
					{state.error}
				</div>
			)}
			<div
				className={`grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center [&>label]:${style.label}`}
			>
				<FormInput
					className={style.input}
					type="text"
					id="title"
					name="title"
					label="title"
					defaultValue={getDefault("title")}
					aria-invalid={Boolean(state.errors?.title?.length)}
					aria-describedby={
						state.errors?.title?.length ? "title-error" : undefined
					}
					error={state.errors?.title}
					required
				/>
				<FormInput
					className={style.input}
					type="text"
					name="brand"
					id="brand"
					label="brand"
					defaultValue={getDefault("brand")}
					error={state.errors?.brand}
					required
				/>
				<FormInput
					className={style.input}
					type="number"
					min="0.5"
					step="0.01"
					id="price"
					name="price"
					label="Price"
					defaultValue={getDefault("price")}
					error={state.errors?.price}
					required
				/>
				<FormInput
					className={style.input}
					type="number"
					name="stock"
					id="stock"
					label="Stock"
					defaultValue={getDefault("stock")}
					error={state.errors?.stock}
					required
				/>

				<FormSelect
					className={style.input}
					label="Category"
					id="categoryId"
					name="categoryId"
					defaultValue={getDefault("categoryId")}
					required
				>
					<option value="">Select a category</option>
					{categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</FormSelect>

				<FormTextarea
					className={style.input}
					id="description"
					name="description"
					label="Description"
					minLength={5}
					maxLength={400}
					defaultValue={getDefault("description")}
					error={state.errors?.description}
					required
				/>
				<FormInput
					className={style.input}
					type="url"
					id="thumbnail"
					name="thumbnail"
					label="Thumbnail"
					defaultValue={getDefault("thumbnail")}
					error={state.errors?.thumbnail}
					required
				/>
			</div>
			<div className="flex justify-end gap-2">
				<Link
					href={"/admin"}
					className="border rounded-lg py-2 px-4 bg-neutral-50 border-neutral-200  hover:bg-neutral-100 transition-colors"
				>
					Cancel
				</Link>
				<button
					className="border rounded-lg py-2 px-4 bg-accent text-white border-neutral-200 cursor-pointer hover:bg-warning transition-colors"
					type="submit"
					disabled={isPending}
				>
					{isPending ? "Saving..." : "Save"}
				</button>
			</div>
		</form>
	);
}
