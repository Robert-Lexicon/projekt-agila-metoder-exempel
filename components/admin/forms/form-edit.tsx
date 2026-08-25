"use client";
import Link from "next/link";
import { useActionState } from "react";
import { editProductActionState, type FormState } from "@/app/admin/actions";
import type { Category, Product } from "@/lib/types";

const style = {
	input: "border p-2 bg-white border-neutral-300 rounded-md",
	label: "font-semibold",
};

const initialState: FormState = {};

export function FormEditProduct({
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
			{state.error && <p>{state.error}</p>}
			<div
				className={`grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center [&>label]:${style.label}`}
			>
				<label htmlFor="title">Title</label>
				<input
					className={style.input}
					type="text"
					id="title"
					name="title"
					defaultValue={getDefault("title")}
					required
				/>
				{state.errors?.title && <p>{state.errors.title}</p>}
				<label htmlFor="brand">Brand</label>
				<input
					className={style.input}
					type="text"
					id="brand"
					name="brand"
					defaultValue={product.brand}
					required
				/>
				<label htmlFor="price">Price</label>
				<input
					className={style.input}
					type="number"
					min="0.5"
					step="0.01"
					id="price"
					name="price"
					defaultValue={product.price}
					required
				/>
				<label htmlFor="stock">Stock</label>
				<input
					className={style.input}
					type="number"
					id="stock"
					name="stock"
					defaultValue={product.stock}
					required
				/>
				<label className="font-semibold" htmlFor="categoryId">
					Category
				</label>
				<select
					className="border p-2 bg-white"
					id="categoryId"
					name="categoryId"
					defaultValue={product.categoryId}
					required
				>
					<option value="">Select a category</option>
					{categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</select>
				<label htmlFor="description">Description</label>
				<textarea
					className={style.input}
					id="description"
					name="description"
					minLength={5}
					maxLength={400}
					defaultValue={product.description}
					required
				/>
				<label htmlFor="thumbnail">Thumbnail</label>
				<input
					className={style.input}
					type="url"
					id="thumbnail"
					name="thumbnail"
					defaultValue={product.thumbnail}
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
