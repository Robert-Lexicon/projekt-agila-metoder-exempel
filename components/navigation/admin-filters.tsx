import FilterSelect from "@/components/navigation/filter-select";
import { getCategories } from "@/lib/api";
import ResetButton from "./reset-button";
import { SearchInput } from "./search-input";

export async function AdminFilters() {
	const categories = await getCategories();

	return (
		<div className="flex flex-wrap gap-4 justify-between items-end p-6 bg-white border border-neutral-300 rounded-lg">
			<SearchInput />

			<FilterSelect
				paramKey="category"
				label="Category"
				options={[
					{ label: "All", value: "" },
					...categories.map((c) => ({ label: c.name, value: c.id })),
				]}
			/>

			<FilterSelect
				paramKey="stock"
				label="Stock"
				options={[
					{ label: "All", value: "" },
					{ label: "In Stock", value: "in-stock" },
					{ label: "Low Stock", value: "low-stock" },
					{ label: "Out of Stock", value: "out-of-stock" },
				]}
			/>

			<FilterSelect
				paramKey="limit"
				label="Items/Page"
				defaultValue="16"
				options={[
					{ label: "8", value: "8" },
					{ label: "16", value: "16" },
					{ label: "24", value: "24" },
					{ label: "48", value: "48" },
				]}
			/>
			<ResetButton />
		</div>
	);
}
