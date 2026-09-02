"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { deleteProductFromClientAction } from "@/app/admin/actions";

function DeleteButtonIcon() {
	const { pending } = useFormStatus();
	return (
		<button
			className="flex justify-center w-full p-2 cursor-pointer disabled:cursor-not-allowed hover:text-red-600 transition-colors"
			type="submit"
			aria-label="Delete product"
			disabled={pending}
		>
			{pending ? (
				<LoaderCircle className="animate-spin" aria-hidden="true" />
			) : (
				<Trash2 aria-hidden="true" />
			)}
		</button>
	);
}

export function DeleteButton({ id }: { id: number }) {
	// Client action handler with confirmation dialog
	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this product?")) return;

		const result = await deleteProductFromClientAction(id);

		if (!result) {
			toast.error("Product not deleted");
			return;
		}

		toast.success("Product deleted");
	};
	return (
		<form action={handleDelete}>
			<DeleteButtonIcon />
		</form>
	);
}
