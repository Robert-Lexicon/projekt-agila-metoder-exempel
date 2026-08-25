"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import {
	deleteProductAction,
	deleteProductActionBind,
	deleteProductFromClientAction,
} from "@/app/admin/actions";

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
	return (
		<form action={deleteProductAction}>
			<input type="hidden" name="id" value={id} />
			<button type="submit">Delete</button>
		</form>
	);
}

export function DeleteButtonBind({ id }: { id: number }) {
	return (
		<form action={deleteProductActionBind.bind(null, id)}>
			<button type="submit">Delete</button>
		</form>
	);
}

export function DeleteButtonClient({ id }: { id: number }) {
	// client action
	const handleDelete = async () => {
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
