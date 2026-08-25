"use client";

import { useFormStatus } from "react-dom";

export default function SaveButton() {
	const { pending } = useFormStatus();

	return (
		<button
			className="border rounded-lg py-2 px-4 bg-accent text-white border-neutral-200 cursor-pointer hover:bg-warning transition-colors"
			type="submit"
			disabled={pending}
		>
			{pending ? "Saving..." : "Save"}
		</button>
	);
}
