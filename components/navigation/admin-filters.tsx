import FilterSelect from "@/components/navigation/filter-select";
import { getCategories } from "@/lib/api";
import { SearchInput } from "./search-input";

export async function AdminFilters() {
    const categories = await getCategories();

    return (
        <div className="flex flex-wrap gap-4 justify-between items-center p-6 bg-white border border-neutral-300 rounded-lg">
            {/* <Form action="" className="flex-2 flex flex-col gap-2 min-w-[20ch]">
                <label htmlFor="search" className="text-neutral-500 text-sm font-semibold">Search products</label>
                <input
                    id="search"
                    type="search"
                    name="q"
                    placeholder="Search products..."
                    className="w-full border border-neutral-300 rounded py-2 px-3"
                />
            </Form> */}
            <SearchInput />

            <FilterSelect paramKey="category" label="Category" options={[
                { label: "All", value: "" },
                ...categories.map((c) => ({ label: c.name, value: c.id })),
            ]} />

            <FilterSelect paramKey="stock" label="Stock" options={[
                { label: "All", value: "" },
                { label: "In Stock", value: "in-stock" },
                { label: "Low Stock", value: "low-stock" },
                { label: "Out of Stock", value: "out-of-stock" }
            ]} />

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
            {/* TODO: Make a reset button */}
        </div>
    );
}
