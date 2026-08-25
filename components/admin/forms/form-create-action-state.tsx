"use client";
import Form from "next/form";
import Link from "next/link";
import { useActionState } from "react";
import {
	type ActionState,
	createProductZodActionState,
} from "@/app/admin/actions";
import {
	FormInput,
	FormSelect,
	FormTextarea,
} from "@/components/admin/forms/form-field";
import type { Category, ProductFormData } from "@/lib/types";

const FORM_FIELDS = [
	{ name: "title", label: "Title", required: true }, // defaults to 'input' if omitted
	{ name: "brand", label: "Brand", required: true },
	{
		name: "price",
		label: "Price",
		type: "number",
		min: "0.5",
		step: "0.01",
		required: true,
	},
	{ name: "stock", label: "Stock", type: "number", required: true },
	{
		component: "select",
		name: "categoryId",
		label: "Category ID",
		type: "number",
		required: true,
	},
	{
		component: "textarea",
		name: "description",
		label: "Description",
		minLength: 5,
		maxLength: 400,
		required: true,
	},
	{ name: "thumbnail", label: "Thumbnail", type: "url", required: true },
];

const initialState: ActionState = null;

export function CreateFormActionState({
	categories,
}: {
	categories: Category[];
}) {
	const [state, formAction, pending] = useActionState(
		createProductZodActionState,
		initialState,
	);

	const data = state?.data as ProductFormData;

	return (
		<Form action={formAction} className="grid gap-4">
			<output className="block text-red-500 font-bold text-center min-h-6">
				{state?.message}
			</output>
			<div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center [&>input,&>textarea]:border [&>input,&>textarea]:bg-white [&>input,&>textarea]:p-2">
				{FORM_FIELDS.map((field) => {
					const { component, name, ...rest } = field;

					const dynamicProps = {
						id: name,
						name,
						defaultValue: data?.[name as keyof ProductFormData],
						error: state?.errors?.[name as keyof typeof state.errors],
						...rest,
					};

					if (component === "textarea") {
						return <FormTextarea key={name} {...dynamicProps} />;
					}

					if (component === "select") {
						return (
							<FormSelect key={name} {...dynamicProps}>
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

				{/* <FormInput
					label="Title"
					id="title"
					name="title"
					required
					defaultValue={data?.title}
					error={state?.errors?.title}
				/> */}
				{/* <label className="font-semibold" htmlFor="title">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          defaultValue={data?.title}
        /> */}
				{/* <FormInput
					label="Brand"
					id="brand"
					name="brand"
					required
					defaultValue={data?.brand}
					error={state?.errors?.brand}
				/> */}
				{/* <label className="font-semibold" htmlFor="brand">
          Brand
        </label>
        <input
          type="text"
          id="brand"
          name="brand"
          required
          defaultValue={data?.brand}
        /> */}
				{/* <FormInput
					label="Price"
					id="price"
					name="price"
					type="number"
					min="0.5"
					step="0.01"
					required
					defaultValue={data?.price}
					error={state?.errors?.price}
				/> */}
				{/* <label className="font-semibold" htmlFor="price">
          Price
        </label>
        <input
          type="number"
          min="0.5"
          step="0.01"
          id="price"
          name="price"
          required
          defaultValue={data?.price}
        /> */}
				{/* <FormInput
					label="Stock"
					id="stock"
					name="stock"
					type="number"
					required
					defaultValue={data?.stock}
					error={state?.errors?.stock}
				/> */}
				{/* <label className="font-semibold" htmlFor="stock">
          Stock
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          required
          defaultValue={data?.stock}
        />  */}
				{/* <FormInput
					label="Category ID"
					id="categoryId"
					name="categoryId"
					type="number"
					required
					defaultValue={data?.categoryId}
					error={state?.errors?.categoryId}
				/> */}
				{/* <label className="font-semibold" htmlFor="categoryId">
          Category ID
        </label>
        <input
          type="number"
          id="categoryId"
          name="categoryId"
          required
          defaultValue={data?.categoryId}
        /> */}
				{/* <FormTextarea
					label="Description"
					id="description"
					name="description"
					minLength={5}
					maxLength={400}
					required
					defaultValue={data?.description}
					error={state?.errors?.description}
				/> */}
				{/* <label className="font-semibold" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          minLength={5}
          maxLength={400}
          required
          defaultValue={data?.description}
        /> */}
				{/* <FormInput
					label="Thumbnail"
					id="thumbnail"
					name="thumbnail"
					type="url"
					required
					defaultValue={data?.thumbnail}
					error={state?.errors?.thumbnail}
				/> */}
				{/* <label className="font-semibold" htmlFor="thumbnail">
          Thumbnail
        </label>
        <input
          type="url"
          id="thumbnail"
          name="thumbnail"
          required
          defaultValue={data?.thumbnail}
        /> */}
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
					disabled={pending}
				>
					{pending ? "Saving..." : "Save"}
				</button>
			</div>
		</Form>
	);
}
