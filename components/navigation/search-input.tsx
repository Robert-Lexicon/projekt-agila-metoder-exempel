// components/navigation/search-input.tsx
"use client";

import { LoaderCircle, Search } from "lucide-react";
import {
	type ReadonlyURLSearchParams,
	usePathname,
	useRouter,
	useSearchParams,
} from "next/navigation";
import { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

export function SearchInput() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Debounce to avoid firing route transitions on every keystroke
	const handleSearch = useDebouncedCallback((term: string) => {
		const query = createClientQueryString(searchParams, {
			q: term,
			page: undefined,
		});

		// Wrap the router navigation inside startTransition
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

				{/* Dynamic visual indicator powered by useTransition */}
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

function createClientQueryString(
	searchParams: ReadonlyURLSearchParams,
	arg1: { q: string; page: undefined },
) {
	throw new Error("Function not implemented.");
}
