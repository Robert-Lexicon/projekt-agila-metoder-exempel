"use client";

import { LoaderCircle, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { createQueryStringClient } from "@/lib/utils";

export function SearchInput() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Debounce input to prevent firing route transitions on every keystroke
	const handleSearch = useDebouncedCallback((term: string) => {
		const query = createQueryStringClient(searchParams, {
			q: term,
			page: undefined, // Reset to page 1 so search results start from the first page
		});

		// Wrap router navigation inside startTransition for non-blocking UI
		startTransition(() => {
			router.push(`${pathname}?${query}`, { scroll: false });
		});
	}, 300);

	return (
		<div className="flex-2 flex flex-col gap-2 min-w-[20ch]">
			<label
				htmlFor="search"
				className="text-neutral-500 text-sm font-semibold"
			>
				Search products
			</label>
			<div className="relative flex items-center">
				<input
					id="search"
					type="search"
					placeholder="Search products..."
					defaultValue={searchParams.get("q") ?? ""}
					onChange={(e) => handleSearch(e.target.value)}
					className="w-full border border-neutral-300 rounded py-2 pl-3 pr-9 focus:outline-none focus:ring-2 focus:ring-neutral-800"
				/>

				{/* Visual pending indicator powered by useTransition */}
				<div className="absolute right-3 text-neutral-400 pointer-events-none">
					{isPending ? (
						<LoaderCircle className="h-4 w-4 animate-spin text-neutral-700" />
					) : (
						<Search className="h-4 w-4" />
					)}
				</div>
			</div>
		</div>
	);
}
