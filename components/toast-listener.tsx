"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import toast from "react-hot-toast";

function ToastListenerContent() {
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const status = searchParams.get("status");

		if (status === "success") {
			toast.success("Operation successful!");
			// Clean up the URL
			const newParams = new URLSearchParams(searchParams.toString());
			newParams.delete("status");
			router.replace(`?${newParams.toString()}`);
		} else if (status === "updated") {
			toast.success("Product updated successfully!");
			const newParams = new URLSearchParams(searchParams.toString());
			newParams.delete("status");
			router.replace(`?${newParams.toString()}`);
		}
	}, [searchParams, router]);

	return null;
}

export function ToastListener() {
	return (
		<Suspense fallback={null}>
			<ToastListenerContent />
		</Suspense>
	);
}

